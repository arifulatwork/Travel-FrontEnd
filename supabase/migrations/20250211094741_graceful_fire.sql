-- Step 1: Remove any duplicate cities while keeping the oldest record
WITH duplicate_cities AS (
  SELECT id
  FROM (
    SELECT id,
           city,
           ROW_NUMBER() OVER (PARTITION BY city ORDER BY created_at ASC) as rn
    FROM public.destinations
    WHERE city IN ('Córdoba', 'Granada')
  ) ranked
  WHERE rn > 1
)
DELETE FROM public.destinations
WHERE id IN (SELECT id FROM duplicate_cities);

-- Step 2: Remove orphaned activities
DELETE FROM public.activities
WHERE destination_id NOT IN (
  SELECT id FROM public.destinations
);

-- Step 3: Ensure consistent metadata for all Spanish cities
UPDATE public.destinations
SET metadata = CASE city
    WHEN 'Córdoba' THEN jsonb_build_object(
      'region', 'Andalusia',
      'highlights', ARRAY['Mezquita-Catedral', 'Alcázar de los Reyes Cristianos', 'Jewish Quarter', 'Roman Bridge', 'Patios Festival'],
      'cuisine', ARRAY['Salmorejo', 'Rabo de Toro', 'Berenjenas con Miel', 'Flamenquín'],
      'unesco_sites', ARRAY['Historic Centre of Córdoba', 'Patios Festival']
    )
    WHEN 'Granada' THEN jsonb_build_object(
      'region', 'Andalusia',
      'highlights', ARRAY['Alhambra', 'Generalife Gardens', 'Albaicín', 'Royal Chapel', 'Sierra Nevada'],
      'cuisine', ARRAY['Plato Alpujarreño', 'Pionono', 'Remojón Granadino', 'Free Tapas Culture'],
      'unesco_sites', ARRAY['Alhambra, Generalife and Albayzín']
    )
    ELSE metadata
  END
WHERE city IN ('Córdoba', 'Granada')
AND (metadata IS NULL OR metadata = '{}'::jsonb);

-- Step 4: Ensure consistent activity data
UPDATE public.activities
SET
  status = COALESCE(status, 'active'),
  available_spots = COALESCE(available_spots, 
    CASE 
      WHEN type = 'tour' THEN 40
      ELSE 30
    END
  ),
  booking_deadline = COALESCE(booking_deadline, interval '2 hours')
WHERE destination_id IN (
  SELECT id 
  FROM public.destinations 
  WHERE city IN ('Córdoba', 'Granada')
);

-- Step 5: Add missing activities if needed
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
  d.id,
  CASE d.city
    WHEN 'Córdoba' THEN 'Mezquita & Jewish Quarter Tour'
    WHEN 'Granada' THEN 'Alhambra Palace Tour'
  END,
  CASE d.city
    WHEN 'Córdoba' THEN 'Explore the stunning Mezquita mosque-cathedral and the historic Jewish quarter'
    WHEN 'Granada' THEN 'Discover the magnificent Alhambra palace complex and Generalife gardens'
  END,
  'tour',
  CASE d.city
    WHEN 'Córdoba' THEN 45.00
    WHEN 'Granada' THEN 55.00
  END,
  CASE d.city
    WHEN 'Córdoba' THEN 35.00
    WHEN 'Granada' THEN 45.00
  END,
  4,
  CASE d.city
    WHEN 'Córdoba' THEN 15
    WHEN 'Granada' THEN 12
  END,
  CASE d.city
    WHEN 'Córdoba' THEN interval '3 hours'
    WHEN 'Granada' THEN interval '3 hours 30 minutes'
  END,
  CASE d.city
    WHEN 'Córdoba' THEN 'Mezquita'
    WHEN 'Granada' THEN 'Alhambra'
  END,
  CASE d.city
    WHEN 'Córdoba' THEN 'https://images.unsplash.com/photo-1582729845428-b5e8c3c7c1e7?auto=format&fit=crop&w=800&q=80'
    WHEN 'Granada' THEN 'https://images.unsplash.com/photo-1591801074764-3d9895c8c9e9?auto=format&fit=crop&w=800&q=80'
  END,
  'active',
  40
FROM public.destinations d
WHERE d.city IN ('Córdoba', 'Granada')
AND NOT EXISTS (
  SELECT 1 
  FROM public.activities a 
  WHERE a.destination_id = d.id
);