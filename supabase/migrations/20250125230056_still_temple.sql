/*
  # Add preferences column to profiles table

  1. Changes
    - Add preferences JSONB column to profiles table with default empty object
    - Add validation check for preferences structure
    - Update existing profiles to have default preferences

  2. Security
    - Maintain existing RLS policies
*/

-- Add preferences column with default empty object
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "climate": [],
  "groupSize": "solo",
  "travelStyle": [],
  "budget": "moderate",
  "seasonPreference": [],
  "activityLevel": "moderate",
  "interests": []
}'::jsonb;

-- Add check constraint to ensure preferences has required fields
ALTER TABLE public.profiles
ADD CONSTRAINT preferences_structure_check
CHECK (
  preferences ? 'climate' AND
  preferences ? 'groupSize' AND
  preferences ? 'travelStyle' AND
  preferences ? 'budget' AND
  preferences ? 'seasonPreference' AND
  preferences ? 'activityLevel' AND
  preferences ? 'interests'
);

-- Update existing profiles to have default preferences if null
UPDATE public.profiles
SET preferences = '{
  "climate": [],
  "groupSize": "solo",
  "travelStyle": [],
  "budget": "moderate",
  "seasonPreference": [],
  "activityLevel": "moderate",
  "interests": []
}'::jsonb
WHERE preferences IS NULL;