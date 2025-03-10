-- Add Regent Porto Montenegro hotel details
UPDATE public.activities
SET metadata = jsonb_set(
  metadata,
  '{full_itinerary,5}',
  jsonb_build_object(
    'day', 6,
    'title', 'Coastal Montenegro',
    'description', 'Discover Montenegro''s coastal highlights, starting with Herceg Novi''s medieval fortresses and botanical gardens. Visit Porto Montenegro, the luxury yacht marina in Tivat, with time for shopping and lunch. Optional afternoon sailing trip along the coast or relaxation at a beach club. Visit an ancient olive grove and mill, some trees over 2000 years old. Evening cooking class featuring seafood specialties, followed by dinner with paired wines.',
    'highlights', ARRAY['Herceg Novi fortresses', 'Porto Montenegro', 'Ancient olive trees', 'Cooking class', 'Coastal views'],
    'meals', ARRAY['Breakfast', 'Dinner'],
    'accommodation', jsonb_build_object(
      'name', 'Regent Porto Montenegro',
      'category', '5-star luxury hotel',
      'location', 'Porto Montenegro, Tivat',
      'description', 'Inspired by Renaissance Venice, this luxury hotel offers elegant rooms with balconies overlooking the marina or mountains. Features include an indoor pool, outdoor infinity pool, spa, and multiple restaurants.',
      'amenities', ARRAY[
        'Infinity pools',
        'Luxury spa',
        'Fine dining restaurants',
        'Marina views',
        'Fitness center',
        'Private beach access'
      ],
      'room_type', 'Deluxe Marina View Room',
      'website', 'https://www.regenthotels.com/regent-portomontenegro',
      'coordinates', jsonb_build_object(
        'lat', 42.4334,
        'lng', 18.6896
      )
    ),
    'included_activities', ARRAY['Fortress tours', 'Cooking class', 'Olive mill visit'],
    'optional_activities', ARRAY['Sailing trip', 'Spa treatments']
  )
)
WHERE title = 'Montenegro Highlights Tour';