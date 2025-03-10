-- Sample destinations
INSERT INTO public.destinations (id, country, city, description, coordinates, image_url)
VALUES
  ('d1b1c1d1-1234-5678-1234-567812345678', 'Spain', 'Barcelona', 'A vibrant city known for its art and architecture', POINT(41.3851, 2.1734), 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80'),
  ('d2b2c2d2-1234-5678-1234-567812345678', 'Spain', 'Madrid', 'Spain''s central capital', POINT(40.4168, -3.7038), 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Sample activities
INSERT INTO public.activities (id, destination_id, title, description, type, price, group_price, min_group_size, max_group_size, duration, location, image_url)
VALUES
  ('a1b1c1d1-1234-5678-1234-567812345678', 'd1b1c1d1-1234-5678-1234-567812345678', 'Sagrada Familia Tour', 'Guided tour of Gaudi''s masterpiece', 'tour', 45.00, 35.00, 4, 15, '2 hours', 'Sagrada Familia', 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80'),
  ('a2b2c2d2-1234-5678-1234-567812345678', 'd1b1c1d1-1234-5678-1234-567812345678', 'Gothic Quarter Walk', 'Walking tour of historic Gothic Quarter', 'tour', 25.00, 20.00, 4, 12, '3 hours', 'Gothic Quarter', 'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Sample reviews
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.reviews (user_id, activity_id, rating, comment)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'a1b1c1d1-1234-5678-1234-567812345678', 5, 'Amazing tour! The guide was very knowledgeable.'),
      ('00000000-0000-0000-0000-000000000002', 'a2b2c2d2-1234-5678-1234-567812345678', 4, 'Great experience walking through the historic streets.')
    ON CONFLICT ON CONSTRAINT one_review_per_activity DO NOTHING;
  END IF;
END $$;

-- Sample schedules
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.schedules (user_id, day_of_week, activity_id, start_time, duration)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'Monday', 'a1b1c1d1-1234-5678-1234-567812345678', '10:00', '2 hours'),
      ('00000000-0000-0000-0000-000000000001', 'Wednesday', 'a2b2c2d2-1234-5678-1234-567812345678', '14:00', '3 hours');
  END IF;
END $$;

-- Sample messages
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.messages (sender_id, receiver_id, content)
    VALUES
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hi! Would you like to join the Sagrada Familia tour?'),
      ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Sure! That sounds great!');
  END IF;
END $$;

-- Sample connections
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.connections (user_id, connected_user_id, status)
    VALUES
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted'),
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'pending')
    ON CONFLICT ON CONSTRAINT unique_connection DO NOTHING;
  END IF;
END $$;

-- Sample notifications
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.notifications (user_id, type, title, content)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'booking', 'Booking Confirmed', 'Your Sagrada Familia tour is confirmed for tomorrow at 10:00'),
      ('00000000-0000-0000-0000-000000000002', 'connection', 'New Connection Request', 'Emma Wilson wants to connect with you');
  END IF;
END $$;

-- Sample bookings
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.bookings (user_id, activity_id, booking_date, start_time, participants, total_price, status)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'a1b1c1d1-1234-5678-1234-567812345678', '2024-03-15', '10:00', 2, 90.00, 'confirmed'),
      ('00000000-0000-0000-0000-000000000002', 'a2b2c2d2-1234-5678-1234-567812345678', '2024-03-20', '14:00', 1, 25.00, 'pending');
  END IF;
END $$;