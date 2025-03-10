-- Restore Istria's image URL to its previous value
UPDATE public.destinations
SET image_url = 'https://images.unsplash.com/photo-1555990538-c48aa0d12c47?auto=format&fit=crop&w=800&q=80'
WHERE city = 'Istra';