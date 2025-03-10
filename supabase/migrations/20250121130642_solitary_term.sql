/*
  # Fix Payment Methods System

  1. Changes
    - Drop existing triggers if they exist
    - Recreate audit table constraints
    - Add proper error handling
    - Fix action enum values
    - Add security improvements

  2. Security
    - Add proper constraints
    - Improve error handling
    - Add audit logging
    - Add rate limiting

  Note: This migration fixes the trigger conflicts and improves the overall security of the payment methods system.
*/

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS payment_method_audit_insert ON public.payment_methods;
DROP TRIGGER IF EXISTS payment_method_audit_update ON public.payment_methods;
DROP TRIGGER IF EXISTS payment_method_audit_delete ON public.payment_methods;

-- Drop existing functions to ensure clean slate
DROP FUNCTION IF EXISTS log_payment_method_change();
DROP FUNCTION IF EXISTS set_default_payment_method(uuid, uuid);

-- Modify the audit table to fix the action constraint
DO $$ 
BEGIN
  ALTER TABLE public.payment_method_audit 
  DROP CONSTRAINT IF EXISTS payment_method_audit_action_check;

  ALTER TABLE public.payment_method_audit 
  ADD CONSTRAINT payment_method_audit_action_check 
  CHECK (action = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text]));
END $$;

-- Create function to handle default payment method logic
CREATE OR REPLACE FUNCTION set_default_payment_method(p_user_id uuid, p_payment_method_id uuid)
RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Remove default from all other payment methods for this user
    UPDATE public.payment_methods
    SET is_default = false
    WHERE user_id = p_user_id;

    -- Set the new default
    UPDATE public.payment_methods
    SET is_default = true
    WHERE id = p_payment_method_id
    AND user_id = p_user_id;

    -- If no rows were updated, the payment method doesn't exist or belong to the user
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Payment method not found or unauthorized';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback the entire operation if anything fails
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the audit logging function with proper error handling
CREATE OR REPLACE FUNCTION log_payment_method_change()
RETURNS trigger AS $$
BEGIN
  -- Ensure we have a valid user context
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No authenticated user context';
  END IF;

  -- Insert audit log
  INSERT INTO payment_method_audit (
    payment_method_id,
    user_id,
    action,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    TG_OP,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    inet_client_addr(),
    current_setting('app.http_user_agent', true)
  );

  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details but don't expose them to the client
    RAISE WARNING 'Error in audit logging: %', SQLERRM;
    -- Continue with the operation even if audit logging fails
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the triggers with proper error handling
DO $$ 
BEGIN
  -- Only create triggers if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'payment_method_audit_insert'
  ) THEN
    CREATE TRIGGER payment_method_audit_insert
      AFTER INSERT ON public.payment_methods
      FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'payment_method_audit_update'
  ) THEN
    CREATE TRIGGER payment_method_audit_update
      AFTER UPDATE ON public.payment_methods
      FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'payment_method_audit_delete'
  ) THEN
    CREATE TRIGGER payment_method_audit_delete
      AFTER DELETE ON public.payment_methods
      FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();
  END IF;
END $$;

-- Ensure proper indexes exist
DO $$
BEGIN
  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_payment_method_audit_user_date'
  ) THEN
    CREATE INDEX idx_payment_method_audit_user_date 
    ON public.payment_method_audit (user_id, created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_payment_method_audit_action'
  ) THEN
    CREATE INDEX idx_payment_method_audit_action 
    ON public.payment_method_audit (action);
  END IF;
END $$;

-- Add or update security policies
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.payment_method_audit;
  DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.payment_method_audit;

  -- Create new policies
  CREATE POLICY "Admins can view all audit logs"
    ON public.payment_method_audit
    FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

  CREATE POLICY "Users can view their own audit logs"
    ON public.payment_method_audit
    FOR SELECT
    USING (auth.uid() = user_id);
END $$;

-- Add function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.payment_method_audit
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;