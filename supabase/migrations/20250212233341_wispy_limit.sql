-- Add congress_tickets table
CREATE TABLE IF NOT EXISTS public.congress_tickets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id uuid REFERENCES public.destinations(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    event_type text NOT NULL CHECK (
        event_type IN (
            'conference',
            'summit',
            'expo',
            'workshop',
            'seminar'
        )
    ),
    start_date date NOT NULL,
    end_date date NOT NULL,
    venue text NOT NULL,
    price_range text,
    image_url text,
    booking_url text,
    capacity int,
    available_tickets int,
    early_bird_deadline date,
    early_bird_price text,
    features jsonb DEFAULT '[]'::jsonb,
    schedule jsonb DEFAULT '[]'::jsonb,
    speakers jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.congress_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Congress tickets are viewable by everyone"
    ON public.congress_tickets FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify congress tickets"
    ON public.congress_tickets FOR ALL
    USING (auth.role() = 'admin');

-- Add indexes
CREATE INDEX idx_congress_tickets_destination ON public.congress_tickets(destination_id);
CREATE INDEX idx_congress_tickets_dates ON public.congress_tickets(start_date, end_date);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at_congress_tickets
    BEFORE UPDATE ON public.congress_tickets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample congress tickets for Barcelona
WITH barcelona_id AS (
    SELECT id FROM public.destinations WHERE city = 'Barcelona' LIMIT 1
)
INSERT INTO public.congress_tickets (
    destination_id,
    title,
    description,
    event_type,
    start_date,
    end_date,
    venue,
    price_range,
    image_url,
    capacity,
    available_tickets,
    early_bird_deadline,
    early_bird_price,
    features,
    schedule,
    speakers
) VALUES
    (
        (SELECT id FROM barcelona_id),
        'Barcelona Tech Summit 2024',
        'Leading technology conference featuring global tech leaders, startups, and innovators',
        'summit',
        '2024-09-15',
        '2024-09-17',
        'Fira Barcelona Gran Via',
        '€599-€999',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        5000,
        3500,
        '2024-07-15',
        '€499',
        '[
            "Access to all keynotes",
            "Workshop participation",
            "Networking events",
            "Conference materials",
            "Lunch and refreshments",
            "Evening reception"
        ]'::jsonb,
        '[
            {
                "day": "2024-09-15",
                "sessions": [
                    {
                        "time": "09:00-10:30",
                        "title": "Opening Keynote",
                        "speaker": "Tech Industry Leader"
                    },
                    {
                        "time": "11:00-12:30",
                        "title": "Future of AI Panel",
                        "speakers": ["AI Expert 1", "AI Expert 2"]
                    }
                ]
            }
        ]'::jsonb,
        '[
            {
                "name": "Sarah Johnson",
                "title": "CEO, TechCorp",
                "topic": "Digital Transformation",
                "bio": "20+ years in tech leadership"
            },
            {
                "name": "Dr. Michael Chang",
                "title": "AI Research Director",
                "topic": "Future of AI",
                "bio": "Leading AI researcher"
            }
        ]'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Mediterranean Business Forum',
        'Annual business conference focusing on Mediterranean economic cooperation',
        'conference',
        '2024-10-20',
        '2024-10-22',
        'Barcelona International Convention Center',
        '€799-€1299',
        'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80',
        2000,
        1800,
        '2024-08-20',
        '€699',
        '[
            "Full conference access",
            "B2B meeting platform",
            "Gala dinner",
            "Industry reports",
            "Translation services",
            "Business matchmaking"
        ]'::jsonb,
        '[
            {
                "day": "2024-10-20",
                "sessions": [
                    {
                        "time": "09:00-10:00",
                        "title": "Economic Outlook 2025",
                        "speaker": "Economic Expert"
                    },
                    {
                        "time": "10:30-12:00",
                        "title": "Cross-Border Trade Panel",
                        "speakers": ["Trade Expert 1", "Trade Expert 2"]
                    }
                ]
            }
        ]'::jsonb,
        '[
            {
                "name": "Prof. Elena Martinez",
                "title": "Economic Advisor",
                "topic": "Mediterranean Economy",
                "bio": "Leading economic researcher"
            },
            {
                "name": "Ahmed Hassan",
                "title": "Trade Minister",
                "topic": "International Trade",
                "bio": "Former trade minister"
            }
        ]'::jsonb
    );

-- Add congress tickets metadata to destinations
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS congress_metadata jsonb DEFAULT '{
    "upcoming_events": [],
    "venues": [],
    "industries": []
}'::jsonb;

-- Update Barcelona's congress metadata
UPDATE public.destinations
SET congress_metadata = '{
    "upcoming_events": [
        "Barcelona Tech Summit",
        "Mediterranean Business Forum",
        "Smart City Expo",
        "Mobile World Congress"
    ],
    "venues": [
        "Fira Barcelona Gran Via",
        "Barcelona International Convention Center",
        "Centre de Convencions Internacional de Barcelona",
        "Palau de Congressos de Catalunya"
    ],
    "industries": [
        "Technology",
        "Mobile & Communications",
        "Smart Cities",
        "Business & Trade",
        "Healthcare",
        "Innovation"
    ]
}'::jsonb
WHERE city = 'Barcelona';

-- Add new team building activities
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
        'Sailing Team Challenge',
        'team_building',
        'Corporate team building through Mediterranean sailing challenges',
        40,
        '€€€',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        '[
            "Professional skippers",
            "Safety equipment",
            "Team challenges",
            "Catering included",
            "Photo documentation",
            "Awards ceremony"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Sunday: 09:00-18:00",
            "minimum_participants": 8,
            "maximum_participants": 40,
            "booking_notice": "7 days"
        }'::jsonb
    ),
    (
        (SELECT id FROM barcelona_id),
        'Culinary Leadership Workshop',
        'team_building',
        'Team building through gourmet cooking challenges and leadership exercises',
        30,
        '€€',
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
        '[
            "Professional chefs",
            "Cooking stations",
            "Leadership exercises",
            "Wine pairing",
            "Team competitions",
            "Dining experience"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 10:00-22:00",
            "minimum_participants": 10,
            "maximum_participants": 30,
            "booking_notice": "5 days"
        }'::jsonb
    );