-- Enhance Montenegro tour itinerary with more details
UPDATE public.activities
SET metadata = jsonb_build_object(
    'full_itinerary', jsonb_build_array(
      jsonb_build_object(
        'day', 1,
        'title', 'Arrival in Kotor',
        'description', 'Welcome to Montenegro! Upon arrival at Tivat or Podgorica airport, private transfer to your boutique hotel in Kotor. After check-in and refreshments, meet your guide for an evening walking tour through Kotor''s UNESCO-listed Old Town. Explore medieval squares, ancient churches, and Venetian palaces. Learn about the city''s 2000-year history while wandering through its romantic streets. End the day with a welcome dinner at a traditional konoba, featuring local specialties like black risotto, fresh seafood, and Montenegrin wines.',
        'highlights', ARRAY['UNESCO Old Town tour', 'Welcome dinner at traditional konoba', 'Medieval architecture', 'Venetian fortifications'],
        'meals', ARRAY['Dinner'],
        'accommodation', 'Boutique Hotel in Kotor',
        'included_activities', ARRAY['Airport transfer', 'Guided Old Town tour', 'Welcome dinner'],
        'optional_activities', ARRAY['Early arrival city tour', 'Sunset fortress walk']
      ),
      jsonb_build_object(
        'day', 2,
        'title', 'Kotor Bay & Perast',
        'description', 'Start your day with a scenic drive around the Bay of Kotor, often called Europe''s southernmost fjord. Visit the baroque town of Perast, known for its stunning Venetian architecture and maritime history. Take a boat to Our Lady of the Rocks, an artificial island with a historic church and museum. After a seafood lunch in Perast, enjoy an afternoon boat tour of the bay with swimming stops at secluded beaches. Visit a family-owned olive grove to learn about traditional oil production and enjoy a tasting. Return to Kotor for an evening at leisure.',
        'highlights', ARRAY['Our Lady of the Rocks island', 'Perast''s Venetian palaces', 'Bay boat tour', 'Olive oil tasting', 'Swimming in the bay'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Boutique Hotel in Kotor',
        'included_activities', ARRAY['Boat trips', 'Museum entries', 'Olive oil tasting'],
        'optional_activities', ARRAY['Sea kayaking', 'Photography workshop']
      ),
      jsonb_build_object(
        'day', 3,
        'title', 'Budva Riviera',
        'description', 'Journey to the Budva Riviera, Montenegro''s premier coastal region. Start with a guided tour of Budva''s fortified Old Town, dating back to the 5th century BC. Drive to the iconic Sveti Stefan island-hotel for a photo stop and beach time. In the afternoon, visit a family-owned winery in the Pastrovići hills for a wine tasting and traditional lunch. Return to Budva for an evening food tour, sampling local specialties like Njeguški prosciutto, local cheeses, and seafood, paired with Montenegrin wines.',
        'highlights', ARRAY['Budva Old Town tour', 'Sveti Stefan viewpoint', 'Wine tasting', 'Local food tour', 'Beach time'],
        'meals', ARRAY['Breakfast', 'Dinner'],
        'accommodation', 'Luxury Resort in Budva',
        'included_activities', ARRAY['Old Town guided tour', 'Wine tasting', 'Evening food tour'],
        'optional_activities', ARRAY['Parasailing', 'Sunset cruise']
      ),
      jsonb_build_object(
        'day', 4,
        'title', 'Durmitor National Park',
        'description', 'Early departure for Durmitor National Park, a UNESCO World Heritage site. Drive through the impressive Tara River Canyon, the deepest in Europe. Take a jeep safari through the park''s dramatic landscapes, visiting Black Lake and historic villages. After a traditional mountain lunch, choose between hiking to scenic viewpoints or zip-lining across the Tara Canyon. Visit a local farm to learn about mountain lifestyle and cheese production. Evening arrival at your cozy mountain lodge for dinner featuring local specialties.',
        'highlights', ARRAY['Tara Canyon views', 'Black Lake hike', 'Jeep safari', 'Traditional farm visit', 'Mountain cuisine'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Mountain Lodge in Žabljak',
        'included_activities', ARRAY['Jeep safari', 'National Park entry', 'Farm visit'],
        'optional_activities', ARRAY['Zip-lining', 'Rock climbing']
      ),
      jsonb_build_object(
        'day', 5,
        'title', 'Cetinje & Lake Skadar',
        'description', 'Explore Cetinje, Montenegro''s historic capital, starting with the National Museum and Cetinje Monastery, housing important Christian relics. Visit King Nikola''s Palace to learn about Montenegro''s royal history. Continue to Lake Skadar National Park, the largest lake in Southern Europe. Take a private boat tour to spot rare birds and visit island monasteries. Stop at a local winery for lunch and tasting of Crmnica wines. Afternoon visit to a honey farm to learn about traditional beekeeping.',
        'highlights', ARRAY['Cetinje historical tour', 'Lake Skadar boat trip', 'Wine tasting', 'Bird watching', 'Honey farm visit'],
        'meals', ARRAY['Breakfast', 'Lunch'],
        'accommodation', 'Lakeside Hotel in Virpazar',
        'included_activities', ARRAY['Museum entries', 'Boat tour', 'Wine tasting'],
        'optional_activities', ARRAY['Fishing trip', 'Kayaking']
      ),
      jsonb_build_object(
        'day', 6,
        'title', 'Coastal Montenegro',
        'description', 'Discover Montenegro''s coastal highlights, starting with Herceg Novi''s medieval fortresses and botanical gardens. Visit Porto Montenegro, the luxury yacht marina in Tivat, with time for shopping and lunch. Optional afternoon sailing trip along the coast or relaxation at a beach club. Visit an ancient olive grove and mill, some trees over 2000 years old. Evening cooking class featuring seafood specialties, followed by dinner with paired wines.',
        'highlights', ARRAY['Herceg Novi fortresses', 'Porto Montenegro', 'Ancient olive trees', 'Cooking class', 'Coastal views'],
        'meals', ARRAY['Breakfast', 'Dinner'],
        'accommodation', 'Waterfront Hotel in Tivat',
        'included_activities', ARRAY['Fortress tours', 'Cooking class', 'Olive mill visit'],
        'optional_activities', ARRAY['Sailing trip', 'Spa treatments']
      ),
      jsonb_build_object(
        'day', 7,
        'title', 'Lovćen National Park',
        'description', 'Ascend the serpentine road to Lovćen National Park, offering panoramic views of the coast and mountains. Visit the Njegoš Mausoleum, perched at 1,657 meters, honoring Montenegro''s most famous ruler and poet. Continue to the village of Njeguši for a prosciutto and cheese tasting. Afternoon cooking class in a traditional home, learning to make local specialties like ispod sača (meat under the bell). Visit the Mountain of Goat''s cheese producers before returning to your mountain resort.',
        'highlights', ARRAY['Njegoš Mausoleum visit', 'Njeguši village', 'Cooking class', 'Cheese tasting', 'Mountain views'],
        'meals', ARRAY['Breakfast', 'Lunch', 'Dinner'],
        'accommodation', 'Mountain Resort in Lovćen',
        'included_activities', ARRAY['Mausoleum entry', 'Cooking class', 'Food tastings'],
        'optional_activities', ARRAY['Hiking', 'Mountain biking']
      ),
      jsonb_build_object(
        'day', 8,
        'title', 'Departure Day',
        'description', 'Final morning in Montenegro at leisure. Optional visit to the local green market to purchase traditional products and souvenirs. Time permitting, stop at a local café for a final Montenegrin coffee and pastry. Private transfer to your departure airport (Tivat or Podgorica) with fond memories of your Montenegrin adventure.',
        'highlights', ARRAY['Local market visit', 'Souvenir shopping', 'Traditional coffee experience'],
        'meals', ARRAY['Breakfast'],
        'accommodation', 'N/A',
        'included_activities', ARRAY['Airport transfer'],
        'optional_activities', ARRAY['Market visit', 'City tour']
      )
    ),
    'highlights', ARRAY[
      'UNESCO World Heritage sites exploration',
      'National Parks and nature experiences',
      'Cultural and historical immersion',
      'Coastal and mountain adventures',
      'Traditional cuisine and wine tasting',
      'Local craft and tradition demonstrations',
      'Authentic community interactions'
    ],
    'included_services', ARRAY[
      'Professional English-speaking guide throughout',
      'Luxury and boutique accommodation',
      'Daily breakfast and selected meals',
      'Private transportation in comfortable vehicle',
      'All entrance fees and activities mentioned',
      'Wine and food tastings',
      'Cooking classes and cultural demonstrations',
      'Boat tours and local experiences',
      'Airport transfers',
      '24/7 local support'
    ],
    'optional_activities', ARRAY[
      'Sailing experiences',
      'Adventure sports (zip-lining, climbing)',
      'Photography tours and workshops',
      'Additional wine tastings',
      'Spa treatments',
      'Mountain biking',
      'Sea kayaking',
      'Fishing trips'
    ],
    'cta_message', 'Embark on an unforgettable 8-day journey through Montenegro''s most stunning landscapes and rich cultural heritage. From coastal gems to mountain retreats, experience the best of this Balkan jewel. Book now to secure your spot on this immersive adventure!',
    'best_seasons', ARRAY['Spring (April-May)', 'Summer (June-August)', 'Fall (September-October)'],
    'difficulty_level', 'Moderate',
    'group_size', jsonb_build_object(
      'min', 4,
      'max', 12,
      'ideal', 8
    ),
    'sustainability', ARRAY[
      'Local guide employment',
      'Community-based tourism initiatives',
      'Environmental conservation support',
      'Cultural heritage preservation',
      'Local food and craft promotion',
      'Responsible tourism practices'
    ],
    'additional_info', jsonb_build_object(
      'fitness_requirements', 'Moderate fitness level required. Some walking on uneven terrain and stairs.',
      'what_to_bring', ARRAY[
        'Comfortable walking shoes',
        'Swimwear and beach items',
        'Weather-appropriate clothing',
        'Camera',
        'Sun protection',
        'Valid passport'
      ],
      'weather_notes', 'Mediterranean climate with warm summers and mild winters. Mountain areas can be cooler.',
      'booking_conditions', ARRAY[
        'Minimum 4 participants required',
        '30% deposit at booking',
        'Full payment 30 days before departure',
        'Customizable for private groups'
      ]
    )
  )
WHERE title = 'Montenegro Highlights Tour';