-- Create company_services table
CREATE TABLE IF NOT EXISTS public.company_services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id uuid REFERENCES public.destinations(id) ON DELETE CASCADE,
    service_name text NOT NULL,
    service_type text NOT NULL CHECK (
        service_type IN (
            'conference_hall',
            'event_venue',
            'meeting_room',
            'catering',
            'team_building'
        )
    ),
    description text,
    capacity int,
    price_range text,
    image_url text,
    booking_url text,
    features jsonb DEFAULT '[]'::jsonb,
    availability jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Company services are viewable by everyone"
    ON public.company_services FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify company services"
    ON public.company_services FOR ALL
    USING (auth.role() = 'admin');

-- Add indexes
CREATE INDEX idx_company_services_destination ON public.company_services(destination_id);
CREATE INDEX idx_company_services_type ON public.company_services(service_type);

-- Insert sample data for Barcelona
WITH barcelona_id AS (
    SELECT id FROM public.destinations WHERE city = 'Barcelona' LIMIT 1
)
INSERT INTO public.company_services (
    destination_id,
    service_name,
    service_type,
    description,
    capacity,
    price_range,
    image_url,
    features,
    availability
) VALUES
    (
        (SELECT id FROM barcelona_id),
        'Barcelona International Convention Center',
        'conference_hall',
        'State-of-the-art convention center with multiple configurable spaces and advanced AV equipment',
        2000,
        '€€€',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
        '[
            "Advanced AV equipment",
            "High-speed WiFi",
            "Multiple breakout rooms",
            "Catering services",
            "Event planning assistance",
            "Translation services"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Sunday: 08:00-22:00",
            "minimum_booking_hours": 4,
            "setup_time": "2 hours",
            "booking_notice": "14 days"
        }'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Casa Batlló Corporate Events',
        'event_venue',
        'Host your corporate event in this modernist masterpiece by Antoni Gaudí',
        200,
        '€€€€',
        'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80',
        '[
            "Unique modernist setting",
            "Professional event staff",
            "Custom lighting",
            "Sound system",
            "Catering options",
            "Photography services"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Sunday: 19:00-00:00",
            "minimum_booking_hours": 4,
            "setup_time": "3 hours",
            "booking_notice": "30 days"
        }'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Mediterranean Team Building Adventures',
        'team_building',
        'Unique team building experiences combining culture, cuisine, and adventure',
        50,
        '€€',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        '[
            "Cooking competitions",
            "City-wide treasure hunts",
            "Sailing challenges",
            "Art workshops",
            "Wine tasting team events",
            "Beach Olympics"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 09:00-18:00",
            "minimum_participants": 10,
            "maximum_participants": 50,
            "booking_notice": "7 days"
        }'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Tech Hub Meeting Rooms',
        'meeting_room',
        'Modern meeting rooms in Barcelona''s innovation district',
        30,
        '€€',
        'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
        '[
            "4K displays",
            "Video conferencing",
            "Whiteboard walls",
            "Coffee service",
            "Tech support",
            "Breakout areas"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 08:00-20:00",
            "minimum_booking_hours": 1,
            "setup_time": "15 minutes",
            "booking_notice": "24 hours"
        }'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Catalonian Corporate Catering',
        'catering',
        'Premium catering service specializing in local and international cuisine',
        500,
        '€€€',
        'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        '[
            "Local and international menus",
            "Dietary accommodations",
            "Full service staff",
            "Equipment rental",
            "Bar service",
            "Event styling"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Sunday: 07:00-23:00",
            "minimum_guests": 20,
            "maximum_guests": 500,
            "booking_notice": "7 days"
        }'::jsonb
    );

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at_company_services
    BEFORE UPDATE ON public.company_services
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add company services metadata to destinations
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS company_services_metadata jsonb DEFAULT '{
    "business_facilities": [],
    "corporate_amenities": [],
    "event_capabilities": []
}'::jsonb;

-- Update Barcelona's company services metadata
UPDATE public.destinations
SET company_services_metadata = '{
    "business_facilities": [
        "Conference centers",
        "Meeting rooms",
        "Event venues",
        "Corporate lounges",
        "Business centers"
    ],
    "corporate_amenities": [
        "High-speed internet",
        "AV equipment",
        "Catering services",
        "Transportation services",
        "Event planning assistance"
    ],
    "event_capabilities": [
        "Large conferences",
        "Corporate retreats",
        "Team building activities",
        "Product launches",
        "Board meetings"
    ]
}'::jsonb
WHERE city = 'Barcelona';