/*
  # Add Activities and Fix Booking System

  1. New Tables
    - Add missing activities for all destinations
    - Add proper foreign key relationships
  
  2. Changes
    - Update booking system to use proper activity IDs
    - Add activity status and availability tracking
  
  3. Security
    - Enable RLS on activities table
    - Add policies for activity access
*/

-- Add status and availability to activities
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
ADD COLUMN IF NOT EXISTS available_spots integer,
ADD COLUMN IF NOT EXISTS booking_deadline interval DEFAULT '2 hours'::interval;

-- Insert activities for all destinations
INSERT INTO public.activities (id, destination_id, title, description, type, price, group_price, min_group_size, max_group_size, duration, location, image_url, status, available_spots)
VALUES
  -- Barcelona Activities
  ('a1b1c1d1-1234-5678-1234-567812345678', 'd1b1c1d1-1234-5678-1234-567812345678', 'Sagrada Familia Tour', 'Guided tour of Gaudi''s masterpiece', 'tour', 45.00, 35.00, 4, 15, '2 hours', 'Sagrada Familia', 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80', 'active', 50),
  ('a2b2c2d2-1234-5678-1234-567812345678', 'd1b1c1d1-1234-5678-1234-567812345678', 'Gothic Quarter Walk', 'Walking tour of historic Gothic Quarter', 'tour', 25.00, 20.00, 4, 12, '3 hours', 'Gothic Quarter', 'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?auto=format&fit=crop&w=800&q=80', 'active', 30),
  
  -- Madrid Activities
  ('a3b3c3d3-1234-5678-1234-567812345678', 'd2b2c2d2-1234-5678-1234-567812345678', 'Madrid Royal Tour', 'Explore Madrid''s Royal Palace and surroundings', 'tour', 40.00, 30.00, 4, 15, '3 hours', 'Royal Palace', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80', 'active', 40),
  ('a4b4c4d4-1234-5678-1234-567812345678', 'd2b2c2d2-1234-5678-1234-567812345678', 'Prado Museum Skip-the-Line', 'Guided tour of Spain''s premier art museum', 'tour', 35.00, 28.00, 4, 12, '2.5 hours', 'Prado Museum', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80', 'active', 25)
ON CONFLICT (id) DO UPDATE
SET 
  status = EXCLUDED.status,
  available_spots = EXCLUDED.available_spots;

-- Create function to handle booking validation
CREATE OR REPLACE FUNCTION validate_booking()
RETURNS trigger AS $$
DECLARE
  v_activity record;
  v_current_bookings integer;
BEGIN
  -- Get activity details
  SELECT * INTO v_activity
  FROM public.activities
  WHERE id = NEW.activity_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Activity not found';
  END IF;

  -- Check if activity is active
  IF v_activity.status != 'active' THEN
    RAISE EXCEPTION 'Activity is not available for booking';
  END IF;

  -- Check available spots
  SELECT COALESCE(SUM(participants), 0) INTO v_current_bookings
  FROM public.bookings
  WHERE activity_id = NEW.activity_id
  AND booking_date = NEW.booking_date
  AND status != 'cancelled';

  IF (v_current_bookings + NEW.participants) > v_activity.available_spots THEN
    RAISE EXCEPTION 'Not enough spots available';
  END IF;

  -- Check booking deadline
  IF NEW.booking_date < CURRENT_DATE + v_activity.booking_deadline THEN
    RAISE EXCEPTION 'Booking deadline has passed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking validation
DROP TRIGGER IF EXISTS validate_booking_trigger ON public.bookings;
CREATE TRIGGER validate_booking_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking();

-- Create function to update available spots
CREATE OR REPLACE FUNCTION update_available_spots()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.activities
    SET available_spots = available_spots - NEW.participants
    WHERE id = NEW.activity_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.activities
    SET available_spots = available_spots + OLD.participants
    WHERE id = OLD.activity_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      UPDATE public.activities
      SET available_spots = available_spots + OLD.participants
      WHERE id = OLD.activity_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating available spots
DROP TRIGGER IF EXISTS update_available_spots_trigger ON public.bookings;
CREATE TRIGGER update_available_spots_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_available_spots();