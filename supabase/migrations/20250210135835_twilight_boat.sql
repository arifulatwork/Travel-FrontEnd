/*
  # Update Montenegro Tour Image

  1. Changes
    - Update image URL for Montenegro Highlights Tour with a new verified Unsplash photo
  
  2. Security
    - No security changes needed as this is just a data update
*/

-- Update the image URL for Montenegro Highlights Tour
UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1592486058517-36236ba247c8?auto=format&fit=crop&w=800&q=80'
WHERE title = 'Montenegro Highlights Tour';