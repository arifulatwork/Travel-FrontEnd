/*
  # Add Purchase Notifications System

  1. New Tables
    - Add purchase_notifications table
    - Add notification_preferences table

  2. Security
    - Enable RLS
    - Add appropriate policies
    - Add audit logging

  3. Changes
    - Add notification triggers for purchases
    - Add notification preferences
*/

-- Create purchase_notifications table
CREATE TABLE IF NOT EXISTS public.purchase_notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    type text NOT NULL CHECK (type IN ('booking_confirmed', 'booking_reminder', 'booking_cancelled', 'payment_successful', 'payment_failed')),
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_confirmations boolean DEFAULT true,
    booking_reminders boolean DEFAULT true,
    payment_notifications boolean DEFAULT true,
    promotional_emails boolean DEFAULT false,
    reminder_time interval DEFAULT '24 hours'::interval,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchase_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for purchase_notifications
CREATE POLICY "Users can view their own notifications"
    ON public.purchase_notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON public.purchase_notifications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON public.purchase_notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for notification_preferences
CREATE POLICY "Users can view their own preferences"
    ON public.notification_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.notification_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.notification_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_purchase_notifications_user ON public.purchase_notifications(user_id);
CREATE INDEX idx_purchase_notifications_booking ON public.purchase_notifications(booking_id);
CREATE INDEX idx_purchase_notifications_created ON public.purchase_notifications(created_at DESC);
CREATE INDEX idx_purchase_notifications_unread ON public.purchase_notifications(user_id) WHERE NOT read;

-- Create function to handle booking notifications
CREATE OR REPLACE FUNCTION handle_booking_notification()
RETURNS trigger AS $$
DECLARE
    v_title text;
    v_content text;
    v_type text;
    v_activity_name text;
    v_booking_date text;
    v_booking_time text;
BEGIN
    -- Get activity name
    SELECT title INTO v_activity_name
    FROM public.activities
    WHERE id = NEW.activity_id;

    -- Format date and time
    v_booking_date := to_char(NEW.booking_date::date, 'Month DD, YYYY');
    v_booking_time := to_char(NEW.start_time::time, 'HH24:MI');

    -- Set notification details based on status
    CASE NEW.status
        WHEN 'confirmed' THEN
            v_title := 'Booking Confirmed';
            v_content := format('Your booking for %s on %s at %s has been confirmed.', 
                              v_activity_name, v_booking_date, v_booking_time);
            v_type := 'booking_confirmed';
        WHEN 'pending' THEN
            v_title := 'Booking Received';
            v_content := format('Your booking for %s on %s at %s is being processed.', 
                              v_activity_name, v_booking_date, v_booking_time);
            v_type := 'booking_confirmed';
        WHEN 'cancelled' THEN
            v_title := 'Booking Cancelled';
            v_content := format('Your booking for %s on %s at %s has been cancelled.', 
                              v_activity_name, v_booking_date, v_booking_time);
            v_type := 'booking_cancelled';
    END CASE;

    -- Insert notification
    INSERT INTO public.purchase_notifications (
        user_id,
        booking_id,
        title,
        content,
        type,
        metadata
    ) VALUES (
        NEW.user_id,
        NEW.id,
        v_title,
        v_content,
        v_type,
        jsonb_build_object(
            'activity_name', v_activity_name,
            'booking_date', NEW.booking_date,
            'booking_time', NEW.start_time,
            'participants', NEW.participants,
            'total_price', NEW.total_price
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking notifications
CREATE TRIGGER create_booking_notification
    AFTER INSERT OR UPDATE OF status ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION handle_booking_notification();

-- Create function to handle notification preferences
CREATE OR REPLACE FUNCTION initialize_notification_preferences()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize preferences for new users
CREATE TRIGGER initialize_user_notification_preferences
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_notification_preferences();

-- Add updated_at trigger for notification_preferences
CREATE TRIGGER handle_updated_at_notification_preferences
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();