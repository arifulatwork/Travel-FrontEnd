/*
  # Secure Payment Methods Implementation

  1. Changes
    - Add encryption for sensitive data
    - Add additional validation constraints
    - Add audit logging
    - Add rate limiting

  2. Security
    - Enable RLS
    - Add strict validation policies
    - Add audit logging
*/

-- Create extension for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_card_data(data text, key_id text DEFAULT 'default')
RETURNS text AS $$
BEGIN
  RETURN encode(
    encrypt(
      data::bytea,
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_card_data(encrypted_data text, key_id text DEFAULT 'default')
RETURNS text AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_data, 'base64'),
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create payment_method_audit table
CREATE TABLE IF NOT EXISTS public.payment_method_audit (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_method_id uuid REFERENCES public.payment_methods(id),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
    changes jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.payment_method_audit ENABLE ROW LEVEL SECURITY;

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_payment_method_change()
RETURNS trigger AS $$
BEGIN
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
        TG_OP::text,
        jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        ),
        inet_client_addr(),
        current_setting('app.http_user_agent', true)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
CREATE TRIGGER payment_method_audit_insert
    AFTER INSERT ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();

CREATE TRIGGER payment_method_audit_update
    AFTER UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();

CREATE TRIGGER payment_method_audit_delete
    AFTER DELETE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION log_payment_method_change();

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_payment_method_rate_limit(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
    recent_attempts int;
BEGIN
    SELECT COUNT(*)
    INTO recent_attempts
    FROM payment_method_audit
    WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 hour';

    RETURN recent_attempts < 10; -- Limit to 10 operations per hour
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting policy
ALTER TABLE public.payment_methods
    ADD CONSTRAINT check_rate_limit
    CHECK (check_payment_method_rate_limit(user_id));