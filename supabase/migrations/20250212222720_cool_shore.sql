-- Add metadata column if it doesn't exist
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Update Montenegro tour data
UPDATE public.activities
SET 
  description = 'Experience the best of Montenegro in this comprehensive tour covering stunning coastlines, historic towns, and majestic mountains. From the medieval streets of Kotor to the pristine shores of Budva and the wilderness of Durmitor National Park, this immersive 8-day journey showcases the country''s rich heritage, natural wonders, and warm hospitality.',
  duration = '8 days',
  metadata = jsonb_build_object(
    'full_itinerary', jsonb_build_array(
      jsonb_build_object(
        'day', 1,
        'title', 'Arrival in Kotor',
        'description', 'Welcome to Montenegro! Transfer to your hotel in the UNESCO-listed town of Kotor. Evening walking tour of the medieval Old Town followed by a welcome dinner featuring traditional Montenegrin cuisine.',
        'highlights', ARRAY['Old Town orientation', 'Welcome dinner', 'Medieval architecture'],
        'meals', ARRAY['Dinner'],
        'accommodation', 'Boutique Hotel in Kotor'
      ),
      jsonb_build_object(
        'day', 2,
        'title', 'Kotor Bay & Perast',
        'description', 'Explore the stunning Bay of Kotor, visit Our Lady of the Rocks island, and discover the charming town of Perast. Afternoon boat tour with swimming opportunities.',
        'highlights', ARRAY['Our Lady of the Rocks', 'Perast town', 'Bay boat tour'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Boutique Hotel in Kotor'
      ),
      jsonb_build_object(
        'day', 3,
        'title', 'Budva Riviera',
        'description', 'Discover the beautiful Budva Riviera, its beaches, and the picturesque Sveti Stefan island. Evening food and wine tasting experience.',
        'highlights', ARRAY['Sveti Stefan viewpoint', 'Old Town Budva', 'Wine tasting'],
        'meals', ARRAY['Breakfast', 'Dinner'],
        'accommodation', 'Luxury Resort in Budva'
      ),
      jsonb_build_object(
        'day', 4,
        'title', 'Durmitor National Park',
        'description', 'Journey to the magnificent Durmitor National Park for hiking and scenic views. Visit the Tara River Canyon, the deepest in Europe.',
        'highlights', ARRAY['Tara Canyon', 'Black Lake', 'Mountain hiking'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Mountain Lodge in Žabljak'
      ),
      jsonb_build_object(
        'day', 5,
        'title', 'Cetinje & Lake Skadar',
        'description', 'Visit the historic capital Cetinje and explore Lake Skadar National Park with a boat trip and birdwatching.',
        'highlights', ARRAY['Cetinje Monastery', 'Lake boat tour', 'Wine tasting'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Lakeside Hotel in Virpazar'
      ),
      jsonb_build_object(
        'day', 6,
        'title', 'Coastal Montenegro',
        'description', 'Explore the coastal towns of Herceg Novi and Tivat, including Porto Montenegro. Optional sailing experience available.',
        'highlights', ARRAY['Porto Montenegro', 'Herceg Novi fortress', 'Coastal walking'],
        'meals', ARRAY['Breakfast', 'Dinner'],
        'accommodation', 'Waterfront Hotel in Tivat'
      ),
      jsonb_build_object(
        'day', 7,
        'title', 'Lovćen National Park',
        'description', 'Visit Lovćen National Park and the Njegoš Mausoleum, offering panoramic views of Montenegro. Traditional village visit and cooking class.',
        'highlights', ARRAY['Njegoš Mausoleum', 'Mountain views', 'Cooking class'],
        'meals', ARRAY['Breakfast', 'Lunch', 'Dinner'],
        'accommodation', 'Mountain Resort in Lovćen'
      ),
      jsonb_build_object(
        'day', 8,
        'title', 'Departure Day',
        'description', 'Morning at leisure before transfer to the airport. Optional visit to local markets for last-minute shopping.',
        'highlights', ARRAY['Local market visit', 'Souvenir shopping'],
        'meals', ARRAY['Breakfast'],
        'accommodation', 'N/A'
      )
    ),
    'highlights', ARRAY[
      'UNESCO World Heritage sites',
      'National Parks exploration',
      'Cultural experiences',
      'Coastal adventures',
      'Traditional cuisine'
    ],
    'included_services', ARRAY[
      'Professional English-speaking guide',
      'Luxury accommodation',
      'Daily breakfast and selected meals',
      'Private transportation',
      'Entrance fees',
      'Wine tastings',
      'Cooking class',
      'Boat tours'
    ],
    'optional_activities', ARRAY[
      'Sailing experience',
      'Photography tours',
      'Additional wine tastings',
      'Spa treatments'
    ],
    'cta_message', 'Join this unforgettable journey through Montenegro''s breathtaking landscapes and charming towns. Secure your spot now for an immersive 8-day adventure!',
    'best_seasons', ARRAY['Spring (April-May)', 'Summer (June-August)', 'Fall (September-October)'],
    'difficulty_level', 'Moderate',
    'group_size', jsonb_build_object(
      'min', 4,
      'max', 12,
      'ideal', 8
    ),
    'sustainability', ARRAY[
      'Local guide employment',
      'Community-based tourism',
      'Environmental conservation support',
      'Cultural heritage preservation'
    ]
  )
WHERE title = 'Montenegro Highlights Tour';