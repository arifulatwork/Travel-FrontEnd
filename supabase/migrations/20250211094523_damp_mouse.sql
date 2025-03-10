-- Remove duplicate Spanish cities
DELETE FROM public.destinations
WHERE city IN ('Córdoba', 'Granada')
AND id NOT IN (
  SELECT id FROM (
    SELECT DISTINCT ON (city) id
    FROM public.destinations
    WHERE city IN ('Córdoba', 'Granada')
    ORDER BY city, created_at ASC
  ) unique_cities
);

-- Remove duplicate activities for Spanish cities
DELETE FROM public.activities
WHERE destination_id IN (
  SELECT id 
  FROM public.destinations 
  WHERE city IN ('Córdoba', 'Granada')
)
AND id NOT IN (
  SELECT id FROM (
    SELECT DISTINCT ON (title, destination_id) id
    FROM public.activities
    WHERE destination_id IN (
      SELECT id 
      FROM public.destinations 
      WHERE city IN ('Córdoba', 'Granada')
    )
    ORDER BY title, destination_id, created_at ASC
  ) unique_activities
);

-- Ensure all Spanish cities have complete information
UPDATE public.destinations
SET
  population = CASE city
    WHEN 'Córdoba' THEN 326039
    WHEN 'Granada' THEN 232462
    ELSE population
  END,
  timezone = 'Europe/Madrid',
  weather_info = CASE city
    WHEN 'Córdoba' THEN '{
      "climate": "Mediterranean",
      "average_temperature": {
        "summer": 36,
        "winter": 10
      },
      "rainy_season": "October to April"
    }'::jsonb
    WHEN 'Granada' THEN '{
      "climate": "Mediterranean-Continental",
      "average_temperature": {
        "summer": 32,
        "winter": 7
      },
      "rainy_season": "November to April"
    }'::jsonb
    ELSE weather_info
  END,
  transportation_info = CASE city
    WHEN 'Córdoba' THEN '{
      "bus": true,
      "train": true,
      "airport": "Córdoba Airport",
      "main_stations": ["Córdoba Central Station"]
    }'::jsonb
    WHEN 'Granada' THEN '{
      "bus": true,
      "train": true,
      "airport": "Federico García Lorca Granada Airport",
      "main_stations": ["Granada Train Station"]
    }'::jsonb
    ELSE transportation_info
  END,
  best_times_to_visit = CASE city
    WHEN 'Córdoba' THEN ARRAY['March to May', 'September to November']
    WHEN 'Granada' THEN ARRAY['March to May', 'September to October']
    ELSE best_times_to_visit
  END,
  local_customs = CASE city
    WHEN 'Córdoba' THEN ARRAY['Siesta time observed strictly', 'Late dining culture', 'May Festival']
    WHEN 'Granada' THEN ARRAY['Free tapas with drinks', 'Flamenco culture', 'Afternoon tea houses']
    ELSE local_customs
  END,
  emergency_contacts = CASE city
    WHEN 'Córdoba' THEN '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+34 957 594 520",
      "hospitals": ["Hospital Reina Sofía", "Hospital San Juan de Dios"]
    }'::jsonb
    WHEN 'Granada' THEN '{
      "police": "112",
      "ambulance": "112",
      "tourist_police": "+34 958 539 753",
      "hospitals": ["Hospital Virgen de las Nieves", "Hospital San Rafael"]
    }'::jsonb
    ELSE emergency_contacts
  END
WHERE city IN ('Córdoba', 'Granada');

-- Ensure activities have consistent information
UPDATE public.activities
SET
  status = 'active',
  available_spots = CASE 
    WHEN type = 'tour' THEN 40
    ELSE 30
  END,
  booking_deadline = interval '2 hours'
WHERE destination_id IN (
  SELECT id 
  FROM public.destinations 
  WHERE city IN ('Córdoba', 'Granada')
);