-- Add metadata column to destinations table
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Update existing Spanish cities with additional metadata
UPDATE public.destinations
SET metadata = jsonb_build_object(
  'region', 'Catalonia',
  'highlights', ARRAY['Sagrada Familia', 'Gothic Quarter', 'Park Güell'],
  'cuisine', ARRAY['Tapas', 'Paella', 'Catalan specialties'],
  'unesco_sites', ARRAY['Works of Antoni Gaudí']
)
WHERE city = 'Barcelona';

UPDATE public.destinations
SET metadata = jsonb_build_object(
  'region', 'Community of Madrid',
  'highlights', ARRAY['Royal Palace', 'Prado Museum', 'Retiro Park'],
  'cuisine', ARRAY['Cocido madrileño', 'Tapas', 'Spanish omelette'],
  'unesco_sites', ARRAY['University and Historic Precinct of Alcalá de Henares']
)
WHERE city = 'Madrid';

UPDATE public.destinations
SET metadata = jsonb_build_object(
  'region', 'Andalusia',
  'highlights', ARRAY['Mezquita', 'Jewish Quarter', 'Alcázar'],
  'cuisine', ARRAY['Salmorejo', 'Rabo de toro', 'Flamenquín'],
  'unesco_sites', ARRAY['Historic Centre of Córdoba']
)
WHERE city = 'Córdoba';

UPDATE public.destinations
SET metadata = jsonb_build_object(
  'region', 'Andalusia',
  'highlights', ARRAY['Alhambra', 'Albaicín', 'Cathedral'],
  'cuisine', ARRAY['Free tapas', 'Pionono', 'Plato Alpujarreño'],
  'unesco_sites', ARRAY['Alhambra, Generalife and Albayzín']
)
WHERE city = 'Granada';