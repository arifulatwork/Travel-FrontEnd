/*
  # Add Payment Methods Table

  1. New Tables
    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `last4` (text)
      - `expiry` (text)
      - `type` (text, either 'visa' or 'mastercard')
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_methods` table
    - Add policies for users to manage their own payment methods
*/

-- Create payment_methods table
CREATE TABLE public.payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    last4 text NOT NULL,
    expiry text NOT NULL,
    type text NOT NULL CHECK (type IN ('visa', 'mastercard')),
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_default_per_user UNIQUE (user_id, is_default) DEFERRABLE INITIALLY DEFERRED
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payment methods"
    ON public.payment_methods
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
    ON public.payment_methods
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
    ON public.payment_methods
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
    ON public.payment_methods
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_payment_methods_user ON public.payment_methods (user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at_payment_methods
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Sample data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.payment_methods (user_id, last4, expiry, type, is_default)
    VALUES
      ('00000000-0000-0000-0000-000000000001', '4242', '12/25', 'visa', true),
      ('00000000-0000-0000-0000-000000000001', '8888', '10/24', 'mastercard', false);
  END IF;
END $$;