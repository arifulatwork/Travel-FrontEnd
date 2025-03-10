/*
  # Enhanced City Features Migration

  1. New Columns
    - Added detailed information columns to destinations table
    - Population, timezone, weather info, transportation info, etc.
  
  2. New Tables
    - city_guides: For local tour guides
    - city_events: For city events and festivals
    - city_tips: For user-submitted city tips
  
  3. Security
    - Enabled RLS on all new tables
    - Added appropriate policies for each table
*/

-- Add new columns to destinations table
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS population integer;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS timezone text;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS weather_info jsonb;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS transportation_info jsonb;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS best_times_to_visit text[];
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS local_customs text[];
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS emergency_contacts jsonb;

-- Create city_guides table
CREATE TABLE public.city_guides (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id uuid REFERENCES public.destinations ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    specialties text[],
    years_of_experience integer,
    hourly_rate decimal(10,2),
    availability jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_guide_per_city UNIQUE (destination_id, user_id)
);

-- Create city_events table
CREATE TABLE public.city_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id uuid REFERENCES public.destinations ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    location text,
    type text CHECK (type IN ('festival', 'concert', 'exhibition', 'sports', 'cultural', 'other')),
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create city_tips table
CREATE TABLE public.city_tips (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id uuid REFERENCES public.destinations ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    category text CHECK (category IN ('food', 'transport', 'accommodation', 'safety', 'culture', 'shopping', 'other')),
    title text NOT NULL,
    content text NOT NULL,
    upvotes integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_tips ENABLE ROW LEVEL SECURITY;

-- Policies for city_guides
CREATE POLICY "City guides are viewable by everyone"
    ON public.city_guides FOR SELECT
    USING (true);

CREATE POLICY "Guides can manage their own profiles"
    ON public.city_guides FOR ALL
    USING (auth.uid() = user_id);

-- Policies for city_events
CREATE POLICY "City events are viewable by everyone"
    ON public.city_events FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage events"
    ON public.city_events FOR ALL
    USING (auth.role() = 'admin');

-- Policies for city_tips
CREATE POLICY "City tips are viewable by everyone"
    ON public.city_tips FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create tips"
    ON public.city_tips FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own tips"
    ON public.city_tips FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tips"
    ON public.city_tips FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_city_guides_destination ON public.city_guides (destination_id);
CREATE INDEX idx_city_guides_user ON public.city_guides (user_id);
CREATE INDEX idx_city_events_destination ON public.city_events (destination_id);
CREATE INDEX idx_city_events_dates ON public.city_events (start_date, end_date);
CREATE INDEX idx_city_tips_destination ON public.city_tips (destination_id);
CREATE INDEX idx_city_tips_category ON public.city_tips (category);
CREATE INDEX idx_city_tips_upvotes ON public.city_tips (upvotes DESC);

-- Add triggers for updated_at
CREATE TRIGGER handle_updated_at_city_guides
    BEFORE UPDATE ON public.city_guides
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_city_events
    BEFORE UPDATE ON public.city_events
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_city_tips
    BEFORE UPDATE ON public.city_tips
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Update existing Barcelona data with enhanced information
UPDATE public.destinations
SET 
    population = 1620343,
    timezone = 'Europe/Madrid',
    weather_info = '{
        "climate": "Mediterranean",
        "average_temperature": {
            "summer": 25,
            "winter": 10
        },
        "rainy_season": "October to April"
    }'::jsonb,
    transportation_info = '{
        "metro": true,
        "bus": true,
        "bike_sharing": true,
        "airport": "Barcelona-El Prat Airport",
        "main_stations": ["Barcelona Sants", "Passeig de Gràcia"]
    }'::jsonb,
    best_times_to_visit = ARRAY['Spring (March to May)', 'Fall (September to November)'],
    local_customs = ARRAY['Late dinners (after 9 PM)', 'Siesta in early afternoon', 'Catalan is widely spoken'],
    emergency_contacts = '{
        "police": "112",
        "ambulance": "112",
        "tourist_police": "+34 932 903 000",
        "hospitals": ["Hospital Clínic", "Hospital de Sant Pau"]
    }'::jsonb
WHERE city = 'Barcelona';

-- Sample data for city guides
INSERT INTO public.city_guides (destination_id, user_id, specialties, years_of_experience, hourly_rate, availability)
SELECT 
    d.id,
    '00000000-0000-0000-0000-000000000001',
    ARRAY['Architecture', 'History', 'Food'],
    5,
    45.00,
    '{"weekdays": ["Monday", "Wednesday", "Friday"], "hours": "9:00-17:00"}'::jsonb
FROM public.destinations d
WHERE d.city = 'Barcelona';

-- Sample data for city events
INSERT INTO public.city_events (destination_id, name, description, start_date, end_date, type, location)
SELECT 
    d.id,
    'La Mercè Festival',
    'Annual festival celebrating Barcelona''s patron saint with music, dance, and traditional activities',
    '2024-09-24',
    '2024-09-27',
    'festival',
    'Various locations in Barcelona'
FROM public.destinations d
WHERE d.city = 'Barcelona';

-- Sample data for city tips
INSERT INTO public.city_tips (destination_id, user_id, category, title, content)
SELECT 
    d.id,
    '00000000-0000-0000-0000-000000000001',
    'transport',
    'Getting Around Barcelona',
    'Buy a T-Casual ticket for multiple journeys on public transport. It''s more economical than single tickets.'
FROM public.destinations d
WHERE d.city = 'Barcelona';