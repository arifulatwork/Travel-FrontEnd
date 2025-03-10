-- Add new Spanish cities
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
  -- Córdoba
  (
    gen_random_uuid(),
    'Spain',
    'Córdoba',
    'Ancient capital of Islamic Spain, known for its stunning Mezquita mosque-cathedral and historic Jewish quarter',
    POINT(37.8882, -4.7794),
    'https://images.unsplash.com/photo-1582729845428-b5e8c3c7c1e7?auto=format&fit=crop&w=800&q=80',
    326039,
    'Europe/Madrid',
    '{
      "climate": "Mediterranean",
      "average_temperature": {
        "summer": 36,
        "winter": 10
      },
      "rainy_season": "October to April"
    }'::jsonb,
    '{
      "bus": true,
      "train": true,
      "airport": "Córdoba Airport",
      "main_stations": ["Córdoba Central Station"]
    }'::jsonb,
    ARRAY['March to May', 'September to November'],
    ARRAY['Siesta time observed strictly', 'Late dining culture', 'May Festival'],
    '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+34 957 594 520",
      "hospitals": ["Hospital Reina Sofía", "Hospital San Juan de Dios"]
    }'::jsonb
  ),
  -- Granada
  (
    gen_random_uuid(),
    'Spain',
    'Granada',
    'Home to the magnificent Alhambra palace and the historic Albaicín quarter, Granada embodies the essence of Andalusian culture',
    POINT(37.1773, -3.5986),
    'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80',
    232462,
    'Europe/Madrid',
    '{
      "climate": "Mediterranean-Continental",
      "average_temperature": {
        "summer": 32,
        "winter": 7
      },
      "rainy_season": "November to April"
    }'::jsonb,
    '{
      "bus": true,
      "train": true,
      "airport": "Federico García Lorca Granada Airport",
      "main_stations": ["Granada Train Station"]
    }'::jsonb,
    ARRAY['March to May', 'September to October'],
    ARRAY['Free tapas with drinks', 'Flamenco culture', 'Afternoon tea houses'],
    '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+34 958 539 753",
      "hospitals": ["Hospital Virgen de las Nieves", "Hospital San Rafael"]
    }'::jsonb
  );

-- Add activities for new cities
WITH new_cordoba AS (
  SELECT id FROM public.destinations WHERE city = 'Córdoba' LIMIT 1
),
new_granada AS (
  SELECT id FROM public.destinations WHERE city = 'Granada' LIMIT 1
)
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
SELECT
  gen_random_uuid(),
  new_cordoba.id,
  'Mezquita & Jewish Quarter Tour',
  'Explore the stunning Mezquita mosque-cathedral and the historic Jewish quarter',
  'tour',
  45.00,
  35.00,
  4,
  15,
  interval '3 hours',
  'Mezquita',
  'https://images.unsplash.com/photo-1582729845428-b5e8c3c7c1e7?auto=format&fit=crop&w=800&q=80',
  'active',
  40
FROM new_cordoba
UNION ALL
SELECT
  gen_random_uuid(),
  new_granada.id,
  'Alhambra Palace Tour',
  'Discover the magnificent Alhambra palace complex and Generalife gardens',
  'tour',
  55.00,
  45.00,
  4,
  12,
  interval '3 hours 30 minutes',
  'Alhambra',
  'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80',
  'active',
  30
FROM new_granada;