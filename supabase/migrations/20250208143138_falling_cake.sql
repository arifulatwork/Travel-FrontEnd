-- Add Albania destinations
INSERT INTO public.destinations (
  id,
  country,
  city,
  description,
  coordinates,
  image_url,
  population,
  timezone,
  weather_info,
  transportation_info,
  best_times_to_visit,
  local_customs,
  emergency_contacts
)
VALUES
  (
    'd8b8c8d8-1234-5678-1234-567812345678',
    'Albania',
    'Tirana',
    'Albania''s vibrant capital, blending Ottoman heritage with modern culture',
    POINT(41.3275, 19.8187),
    'https://images.unsplash.com/photo-1592486058517-36236ba247c8?auto=format&fit=crop&w=800&q=80',
    421286,
    'Europe/Tirane',
    '{
      "climate": "Mediterranean",
      "average_temperature": {
        "summer": 28,
        "winter": 7
      },
      "rainy_season": "November to March"
    }'::jsonb,
    '{
      "bus": true,
      "taxi": true,
      "airport": "Tirana International Airport",
      "main_stations": ["Tirana Central Bus Station"]
    }'::jsonb,
    ARRAY['Spring (April to June)', 'Fall (September to October)'],
    ARRAY['Traditional hospitality (Mikpritja)', 'Coffee culture', 'Late lunches', 'Family-oriented society'],
    '{
      "police": "129",
      "ambulance": "127",
      "fire": "128",
      "emergency": "112",
      "tourist_police": "+355 4 2279242",
      "hospitals": ["Mother Teresa University Hospital", "American Hospital"]
    }'::jsonb
  );

-- Add activities for Tirana
INSERT INTO public.activities (
  id,
  destination_id,
  title,
  description,
  type,
  price,
  group_price,
  min_group_size,
  max_group_size,
  duration,
  location,
  image_url,
  status,
  available_spots
)
VALUES
  (
    'a8b8c8d8-1234-5678-1234-567812345678',
    'd8b8c8d8-1234-5678-1234-567812345678',
    'Tirana Historical Tour',
    'Explore the fascinating history of Albania''s capital, from Ottoman times to the Communist era and beyond',
    'tour',
    35.00,
    28.00,
    4,
    15,
    '3 hours',
    'Skanderbeg Square',
    'https://images.unsplash.com/photo-1601284903331-eaa5d5cc456f?auto=format&fit=crop&w=800&q=80',
    'active',
    40
  ),
  (
    'a9b9c9d9-1234-5678-1234-567812345678',
    'd8b8c8d8-1234-5678-1234-567812345678',
    'Bunk''Art Museum Visit',
    'Visit the unique atomic bunker turned contemporary art museum',
    'tour',
    25.00,
    20.00,
    4,
    12,
    '2 hours',
    'Bunk''Art Museum',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    'active',
    30
  ),
  (
    'aababbcc-1234-5678-1234-567812345678',
    'd8b8c8d8-1234-5678-1234-567812345678',
    'Albanian Cooking Class',
    'Learn to cook traditional Albanian dishes with local chefs',
    'tour',
    55.00,
    45.00,
    4,
    10,
    '4 hours',
    'City Center',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    'active',
    20
  );