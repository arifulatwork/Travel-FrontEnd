-- Sample destinations
INSERT INTO public.destinations (id, country, city, description, coordinates, image_url)
VALUES
  ('d1b1c1d1-1234-5678-1234-567812345678', 'Spain', 'Barcelona', 'A vibrant city known for its art and architecture', POINT(41.3851, 2.1734), 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80'),
  ('d2b2c2d2-1234-5678-1234-567812345678', 'Spain', 'Madrid', 'Spain''s central capital', POINT(40.4168, -3.7038), 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'),
  ('d3b3c3d3-1234-5678-1234-567812345678', 'France', 'Paris', 'The City of Light, known for its art, culture, and iconic landmarks', POINT(48.8566, 2.3522), 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),
  ('d4b4c4d4-1234-5678-1234-567812345678', 'Italy', 'Rome', 'The Eternal City, home to ancient ruins and Renaissance masterpieces', POINT(41.9028, 12.4964), 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
  ('d5b5c5d5-1234-5678-1234-567812345678', 'Germany', 'Berlin', 'A city of art, history, and modern culture', POINT(52.5200, 13.4050), 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
  ('d6b6c6d6-1234-5678-1234-567812345678', 'Austria', 'Vienna', 'The City of Music, known for its imperial history and classical music heritage', POINT(48.2082, 16.3738), 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),
  ('d7b7c7d7-1234-5678-1234-567812345678', 'Croatia', 'Istra', 'A heart-shaped peninsula known for its coastal beauty and historic towns', POINT(45.1289, 13.7402), 'https://images.unsplash.com/photo-1555990538-c48aa0d12c47?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Update destination details for new cities
UPDATE public.destinations
SET
    population = CASE city
        WHEN 'Paris' THEN 2148271
        WHEN 'Rome' THEN 4342212
        WHEN 'Berlin' THEN 3669495
        WHEN 'Vienna' THEN 1897491
        WHEN 'Istra' THEN 208055
        ELSE population
    END,
    timezone = CASE city
        WHEN 'Paris' THEN 'Europe/Paris'
        WHEN 'Rome' THEN 'Europe/Rome'
        WHEN 'Berlin' THEN 'Europe/Berlin'
        WHEN 'Vienna' THEN 'Europe/Vienna'
        WHEN 'Istra' THEN 'Europe/Zagreb'
        ELSE timezone
    END,
    weather_info = CASE city
        WHEN 'Paris' THEN '{
            "climate": "Oceanic",
            "average_temperature": {
                "summer": 20,
                "winter": 5
            },
            "rainy_season": "Year-round precipitation"
        }'::jsonb
        WHEN 'Rome' THEN '{
            "climate": "Mediterranean",
            "average_temperature": {
                "summer": 30,
                "winter": 8
            },
            "rainy_season": "October to April"
        }'::jsonb
        WHEN 'Berlin' THEN '{
            "climate": "Continental",
            "average_temperature": {
                "summer": 23,
                "winter": 0
            },
            "rainy_season": "June to August"
        }'::jsonb
        WHEN 'Vienna' THEN '{
            "climate": "Continental",
            "average_temperature": {
                "summer": 24,
                "winter": 1
            },
            "rainy_season": "May to September"
        }'::jsonb
        WHEN 'Istra' THEN '{
            "climate": "Mediterranean",
            "average_temperature": {
                "summer": 28,
                "winter": 6
            },
            "rainy_season": "October to December"
        }'::jsonb
        ELSE weather_info
    END,
    transportation_info = CASE city
        WHEN 'Paris' THEN '{
            "metro": true,
            "bus": true,
            "bike_sharing": true,
            "airport": "Charles de Gaulle Airport",
            "main_stations": ["Gare du Nord", "Gare de Lyon"]
        }'::jsonb
        WHEN 'Rome' THEN '{
            "metro": true,
            "bus": true,
            "tram": true,
            "airport": "Leonardo da Vinci International Airport",
            "main_stations": ["Roma Termini", "Roma Tiburtina"]
        }'::jsonb
        WHEN 'Berlin' THEN '{
            "metro": true,
            "bus": true,
            "tram": true,
            "airport": "Berlin Brandenburg Airport",
            "main_stations": ["Berlin Hauptbahnhof", "Ostbahnhof"]
        }'::jsonb
        WHEN 'Vienna' THEN '{
            "metro": true,
            "bus": true,
            "tram": true,
            "airport": "Vienna International Airport",
            "main_stations": ["Wien Hauptbahnhof", "Wien Meidling"]
        }'::jsonb
        WHEN 'Istra' THEN '{
            "bus": true,
            "ferry": true,
            "airport": "Pula Airport",
            "main_stations": ["Pula Bus Terminal", "Rovinj Ferry Port"]
        }'::jsonb
        ELSE transportation_info
    END,
    best_times_to_visit = CASE city
        WHEN 'Paris' THEN ARRAY['Spring (April to June)', 'Fall (September to October)']
        WHEN 'Rome' THEN ARRAY['Spring (March to May)', 'Fall (September to November)']
        WHEN 'Berlin' THEN ARRAY['Late Spring (May to June)', 'Early Fall (September)']
        WHEN 'Vienna' THEN ARRAY['April to May', 'September to October']
        WHEN 'Istra' THEN ARRAY['June to September', 'Wine harvest season (September)']
        ELSE best_times_to_visit
    END,
    local_customs = CASE city
        WHEN 'Paris' THEN ARRAY['Greeting with "Bonjour"', 'Long lunches', 'Late dinners', 'Fashion-conscious culture']
        WHEN 'Rome' THEN ARRAY['Aperitivo tradition', 'Afternoon riposo', 'Late dinners', 'Coffee culture']
        WHEN 'Berlin' THEN ARRAY['Direct communication style', 'Punctuality is important', 'Sunday shop closures', 'Cash preference']
        WHEN 'Vienna' THEN ARRAY['Coffee house culture', 'Formal greetings', 'Classical music appreciation', 'Ball season traditions']
        WHEN 'Istra' THEN ARRAY['Mediterranean lifestyle', 'Truffle hunting tradition', 'Wine culture', 'Konoba dining']
        ELSE local_customs
    END,
    emergency_contacts = CASE city
        WHEN 'Paris' THEN '{
            "police": "17",
            "ambulance": "15",
            "fire": "18",
            "emergency": "112",
            "tourist_police": "+33 1 53 71 53 71",
            "hospitals": ["Hôpital Saint-Louis", "Hôpital Pitié-Salpêtrière"]
        }'::jsonb
        WHEN 'Rome' THEN '{
            "police": "113",
            "ambulance": "118",
            "fire": "115",
            "emergency": "112",
            "tourist_police": "+39 06 4686",
            "hospitals": ["Policlinico Umberto I", "Ospedale San Camillo"]
        }'::jsonb
        WHEN 'Berlin' THEN '{
            "police": "110",
            "ambulance": "112",
            "fire": "112",
            "tourist_police": "+49 30 4664 4664",
            "hospitals": ["Charité", "Vivantes"]
        }'::jsonb
        WHEN 'Vienna' THEN '{
            "police": "133",
            "ambulance": "144",
            "fire": "122",
            "emergency": "112",
            "tourist_info": "+43 1 24 555",
            "hospitals": ["AKH Wien", "Rudolfstiftung"]
        }'::jsonb
        WHEN 'Istra' THEN '{
            "police": "192",
            "ambulance": "194",
            "fire": "193",
            "emergency": "112",
            "tourist_info": "+385 52 452 797",
            "hospitals": ["Pula General Hospital", "Rovinj Hospital"]
        }'::jsonb
        ELSE emergency_contacts
    END
WHERE city IN ('Paris', 'Rome', 'Berlin', 'Vienna', 'Istra');

-- Sample activities for new cities
INSERT INTO public.activities (id, destination_id, title, description, type, price, group_price, min_group_size, max_group_size, duration, location, image_url)
VALUES
  -- Paris Activities
  ('a3b3c3d3-1234-5678-1234-567812345678', 'd3b3c3d3-1234-5678-1234-567812345678', 'Eiffel Tower Skip-the-Line Tour', 'Priority access and guided tour of the Eiffel Tower', 'tour', 65.00, 55.00, 4, 15, '2 hours 30 minutes', 'Eiffel Tower', 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800&q=80'),
  -- Rome Activities
  ('a4b4c4d4-1234-5678-1234-567812345678', 'd4b4c4d4-1234-5678-1234-567812345678', 'Colosseum Underground Tour', 'Exclusive access to the Colosseum''s underground chambers', 'tour', 89.00, 79.00, 4, 12, '3 hours', 'Colosseum', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
  -- Berlin Activities
  ('a5b5c5d5-1234-5678-1234-567812345678', 'd5b5c5d5-1234-5678-1234-567812345678', 'Berlin Wall History Walk', 'Historical walking tour along the Berlin Wall', 'tour', 35.00, 30.00, 4, 15, '3 hours', 'East Side Gallery', 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
  -- Vienna Activities
  ('a6b6c6d6-1234-5678-1234-567812345678', 'd6b6c6d6-1234-5678-1234-567812345678', 'Classical Vienna Concert', 'Evening of Mozart & Strauss in a historic venue', 'attraction', 75.00, 65.00, 4, 20, '2 hours', 'Musikverein', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),
  -- Istra Activities
  ('a7b7c7d7-1234-5678-1234-567812345678', 'd7b7c7d7-1234-5678-1234-567812345678', 'Istrian Wine Tour', 'Wine tasting tour through Istrian vineyards', 'tour', 95.00, 85.00, 4, 8, '6 hours', 'Various Wineries', 'https://images.unsplash.com/photo-1555990538-c48aa0d12c47?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Sample reviews for new activities
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO public.reviews (user_id, activity_id, rating, comment)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'a3b3c3d3-1234-5678-1234-567812345678', 5, 'Incredible view of Paris! The skip-the-line access was worth it.'),
      ('00000000-0000-0000-0000-000000000001', 'a4b4c4d4-1234-5678-1234-567812345678', 5, 'Fascinating underground tour of the Colosseum!'),
      ('00000000-0000-0000-0000-000000000001', 'a5b5c5d5-1234-5678-1234-567812345678', 4, 'Very informative Berlin Wall tour.'),
      ('00000000-0000-0000-0000-000000000001', 'a6b6c6d6-1234-5678-1234-567812345678', 5, 'Beautiful concert in an amazing venue!'),
      ('00000000-0000-0000-0000-000000000001', 'a7b7c7d7-1234-5678-1234-567812345678', 5, 'Excellent wine tour through beautiful Istrian countryside!')
    ON CONFLICT ON CONSTRAINT one_review_per_activity DO NOTHING;
  END IF;
END $$;

-- Keep existing sample data below this line
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