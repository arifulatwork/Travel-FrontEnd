-- Update Barcelona's image URL
UPDATE public.destinations
SET image_url = 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80'
WHERE city = 'Barcelona';