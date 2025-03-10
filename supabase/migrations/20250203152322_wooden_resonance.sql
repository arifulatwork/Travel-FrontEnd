-- Temporarily disable the foreign key constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create profile for mock user
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  avatar_url,
  preferences
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'mockuser',
  'Mock User',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
  '{
    "climate": ["Mediterranean", "Tropical"],
    "groupSize": "couple",
    "travelStyle": ["Adventure", "Cultural"],
    "budget": "moderate",
    "seasonPreference": ["Spring", "Fall"],
    "activityLevel": "moderate",
    "interests": ["History", "Food", "Photography"]
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  preferences = EXCLUDED.preferences;