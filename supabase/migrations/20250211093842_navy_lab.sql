-- Update Barcelona's information
UPDATE public.destinations
SET
  coordinates = POINT(41.3874, 2.1686),
  description = 'A vibrant Mediterranean city known for Gaudí''s architectural masterpieces, stunning beaches, and rich cultural heritage',
  image_url = 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80',
  metadata = jsonb_build_object(
    'region', 'Catalonia',
    'highlights', ARRAY['Sagrada Familia', 'Park Güell', 'Casa Batlló', 'La Rambla', 'Gothic Quarter'],
    'cuisine', ARRAY['Paella', 'Tapas', 'Crema Catalana', 'Bombas', 'Fresh Seafood'],
    'unesco_sites', ARRAY['Works of Antoni Gaudí', 'Palau de la Música Catalana', 'Hospital de Sant Pau']
  )
WHERE city = 'Barcelona';

-- Update Madrid's information
UPDATE public.destinations
SET
  coordinates = POINT(40.4168, -3.7038),
  description = 'Spain''s dynamic capital, blending world-class art museums, elegant boulevards, and vibrant nightlife',
  image_url = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
  metadata = jsonb_build_object(
    'region', 'Community of Madrid',
    'highlights', ARRAY['Prado Museum', 'Royal Palace', 'Plaza Mayor', 'Retiro Park', 'Gran Vía'],
    'cuisine', ARRAY['Cocido Madrileño', 'Bocadillo de Calamares', 'Churros con Chocolate', 'Tortilla Española'],
    'unesco_sites', ARRAY['Historic City of Toledo', 'Royal Site of San Lorenzo de El Escorial']
  )
WHERE city = 'Madrid';

-- Update Córdoba's information
UPDATE public.destinations
SET
  coordinates = POINT(37.8882, -4.7794),
  description = 'Historic gem of Andalusia featuring the magnificent Mezquita mosque-cathedral and charming flower-filled courtyards',
  image_url = 'https://images.unsplash.com/photo-1582729845428-b5e8c3c7c1e7?auto=format&fit=crop&w=800&q=80',
  metadata = jsonb_build_object(
    'region', 'Andalusia',
    'highlights', ARRAY['Mezquita-Catedral', 'Alcázar de los Reyes Cristianos', 'Jewish Quarter', 'Roman Bridge', 'Patios Festival'],
    'cuisine', ARRAY['Salmorejo', 'Rabo de Toro', 'Berenjenas con Miel', 'Flamenquín'],
    'unesco_sites', ARRAY['Historic Centre of Córdoba', 'Patios Festival']
  )
WHERE city = 'Córdoba';

-- Update Granada's information
UPDATE public.destinations
SET
  coordinates = POINT(37.1773, -3.5986),
  description = 'Enchanting city at the foot of the Sierra Nevada, home to the stunning Alhambra palace and rich Moorish heritage',
  image_url = 'https://images.unsplash.com/photo-1591801074764-3d9895c8c9e9?auto=format&fit=crop&w=800&q=80',
  metadata = jsonb_build_object(
    'region', 'Andalusia',
    'highlights', ARRAY['Alhambra', 'Generalife Gardens', 'Albaicín', 'Royal Chapel', 'Sierra Nevada'],
    'cuisine', ARRAY['Plato Alpujarreño', 'Pionono', 'Remojón Granadino', 'Free Tapas Culture'],
    'unesco_sites', ARRAY['Alhambra, Generalife and Albayzín']
  )
WHERE city = 'Granada';