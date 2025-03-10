-- Add Portuguese cities
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
  emergency_contacts,
  metadata
)
VALUES
  -- Porto
  (
    gen_random_uuid(),
    'Portugal',
    'Porto',
    'Historic riverside city famous for its port wine, stunning bridges, and colorful riverfront district',
    POINT(41.1579, -8.6291),
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
    214349,
    'Europe/Lisbon',
    '{
      "climate": "Mediterranean-Atlantic",
      "average_temperature": {
        "summer": 25,
        "winter": 10
      },
      "rainy_season": "October to April"
    }'::jsonb,
    '{
      "metro": true,
      "bus": true,
      "train": true,
      "airport": "Francisco Sá Carneiro Airport",
      "main_stations": ["São Bento Railway Station", "Campanhã"]
    }'::jsonb,
    ARRAY['March to May', 'September to October'],
    ARRAY['Port wine tasting', 'Fado music', 'Late dining culture'],
    '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+351 222 081 833",
      "hospitals": ["Hospital de São João", "Hospital Santo António"]
    }'::jsonb,
    '{
      "region": "Northern Portugal",
      "highlights": ["Ribeira District", "Dom Luís I Bridge", "Port Wine Cellars", "Livraria Lello", "Clérigos Tower"],
      "cuisine": ["Francesinha", "Bacalhau", "Port Wine", "Tripas à Moda do Porto"],
      "unesco_sites": ["Historic Centre of Porto"]
    }'::jsonb
  ),
  -- Lisbon
  (
    gen_random_uuid(),
    'Portugal',
    'Lisbon',
    'Portugal''s vibrant capital, known for its historic trams, stunning viewpoints, and rich maritime heritage',
    POINT(38.7223, -9.1393),
    'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=800&q=80',
    544851,
    'Europe/Lisbon',
    '{
      "climate": "Mediterranean",
      "average_temperature": {
        "summer": 28,
        "winter": 12
      },
      "rainy_season": "November to March"
    }'::jsonb,
    '{
      "metro": true,
      "bus": true,
      "train": true,
      "tram": true,
      "airport": "Humberto Delgado Airport",
      "main_stations": ["Santa Apolónia", "Oriente"]
    }'::jsonb,
    ARRAY['March to May', 'September to October'],
    ARRAY['Fado music', 'Pastel de Nata tasting', 'Café culture'],
    '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+351 213 421 634",
      "hospitals": ["Hospital de Santa Maria", "Hospital São José"]
    }'::jsonb,
    '{
      "region": "Lisbon Metropolitan Area",
      "highlights": ["Belém Tower", "Jerónimos Monastery", "São Jorge Castle", "Alfama District", "Time Out Market"],
      "cuisine": ["Pastel de Nata", "Bacalhau", "Ginjinha", "Sardines"],
      "unesco_sites": ["Belém Tower", "Jerónimos Monastery"]
    }'::jsonb
  ),
  -- Braga
  (
    gen_random_uuid(),
    'Portugal',
    'Braga',
    'Portugal''s religious capital, featuring baroque churches, historic architecture, and the iconic Bom Jesus do Monte',
    POINT(41.5454, -8.4265),
    'https://images.unsplash.com/photo-1600264302287-c2fe3d84a2d6?auto=format&fit=crop&w=800&q=80',
    136885,
    'Europe/Lisbon',
    '{
      "climate": "Mediterranean-Atlantic",
      "average_temperature": {
        "summer": 24,
        "winter": 9
      },
      "rainy_season": "October to April"
    }'::jsonb,
    '{
      "bus": true,
      "train": true,
      "airport": "Porto Airport (nearby)",
      "main_stations": ["Braga Railway Station"]
    }'::jsonb,
    ARRAY['April to October'],
    ARRAY['Religious festivals', 'São João celebrations', 'Café culture'],
    '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+351 253 200 420",
      "hospitals": ["Hospital de Braga"]
    }'::jsonb,
    '{
      "region": "Northern Portugal",
      "highlights": ["Bom Jesus do Monte", "Braga Cathedral", "Sanctuary of Our Lady of Sameiro", "Garden of Santa Barbara"],
      "cuisine": ["Bacalhau à Braga", "Pudim Abade de Priscos", "Vinho Verde"],
      "unesco_sites": ["Bom Jesus do Monte"]
    }'::jsonb
  );

-- Add activities for Portuguese cities
WITH porto_id AS (
  SELECT id FROM public.destinations WHERE city = 'Porto' LIMIT 1
),
lisbon_id AS (
  SELECT id FROM public.destinations WHERE city = 'Lisbon' LIMIT 1
),
braga_id AS (
  SELECT id FROM public.destinations WHERE city = 'Braga' LIMIT 1
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
  porto_id.id,
  'Porto Food & Wine Tour',
  'Discover Porto''s culinary delights and famous port wine cellars',
  'tour',
  65.00,
  55.00,
  4,
  12,
  interval '4 hours',
  'Ribeira District',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
  'active',
  30
FROM porto_id
UNION ALL
SELECT
  gen_random_uuid(),
  lisbon_id.id,
  'Lisbon Historic Tram Tour',
  'Explore Lisbon''s historic neighborhoods aboard the iconic Tram 28',
  'tour',
  45.00,
  35.00,
  4,
  15,
  interval '3 hours',
  'Alfama',
  'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=800&q=80',
  'active',
  40
FROM lisbon_id
UNION ALL
SELECT
  gen_random_uuid(),
  braga_id.id,
  'Braga Religious Heritage Tour',
  'Visit the city''s most important religious sites including Bom Jesus do Monte',
  'tour',
  50.00,
  40.00,
  4,
  12,
  interval '4 hours',
  'Bom Jesus do Monte',
  'https://images.unsplash.com/photo-1600264302287-c2fe3d84a2d6?auto=format&fit=crop&w=800&q=80',
  'active',
  25
FROM braga_id;