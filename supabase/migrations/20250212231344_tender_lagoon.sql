-- Add new business activities to company_services table
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
    -- Networking Events
    (
        (SELECT id FROM barcelona_id),
        'Barcelona Tech Networking Hub',
        'event_venue',
        'Regular networking events for tech and startup professionals in Barcelona''s innovation district',
        150,
        '€€',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        '[
            "Monthly industry meetups",
            "Startup pitch events",
            "Innovation workshops",
            "Networking cocktails",
            "Speaker series",
            "Industry roundtables"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 17:00-23:00",
            "minimum_participants": 30,
            "maximum_participants": 150,
            "booking_notice": "14 days"
        }'::jsonb
    ),
    -- Private Corporate Tours
    (
        (SELECT id FROM barcelona_id),
        'Barcelona Business Heritage Tours',
        'team_building',
        'Exclusive corporate tours combining business history, architecture, and modern innovation',
        25,
        '€€€',
        'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
        '[
            "Customized tour routes",
            "Expert business historians",
            "Innovation hub visits",
            "Architecture focus",
            "Local business insights",
            "Networking opportunities"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 09:00-18:00",
            "minimum_participants": 5,
            "maximum_participants": 25,
            "booking_notice": "7 days"
        }'::jsonb
    ),
    -- VIP Transport Services
    (
        (SELECT id FROM barcelona_id),
        'Barcelona Executive Transport',
        'team_building',
        'Premium transportation services for corporate clients with luxury fleet and professional drivers',
        50,
        '€€€€',
        'https://images.unsplash.com/photo-1621976498727-9e5d56476276?auto=format&fit=crop&w=800&q=80',
        '[
            "Luxury vehicle fleet",
            "Professional chauffeurs",
            "Airport transfers",
            "Event transportation",
            "24/7 availability",
            "Corporate accounts"
        ]'::jsonb,
        '{
            "availability_hours": "24/7",
            "minimum_booking_hours": 3,
            "booking_notice": "24 hours"
        }'::jsonb
    ),
    -- Workshops & Training
    (
        (SELECT id FROM barcelona_id),
        'Innovation & Leadership Academy',
        'team_building',
        'Professional development workshops and training programs for corporate teams',
        40,
        '€€€',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        '[
            "Leadership development",
            "Innovation workshops",
            "Team dynamics",
            "Change management",
            "Digital transformation",
            "Custom programs"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Friday: 09:00-18:00",
            "minimum_participants": 8,
            "maximum_participants": 40,
            "booking_notice": "14 days"
        }'::jsonb
    ),
    -- Co-Working Spaces
    (
        (SELECT id FROM barcelona_id),
        'Barcelona Business Hub',
        'meeting_room',
        'Premium co-working and flexible office spaces in prime locations',
        200,
        '€€',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        '[
            "Private offices",
            "Hot desks",
            "Meeting rooms",
            "Event spaces",
            "Business services",
            "Networking events"
        ]'::jsonb,
        '{
            "availability_hours": "24/7",
            "minimum_booking_hours": 1,
            "booking_notice": "Same day"
        }'::jsonb
    ),
    -- Business Dining
    (
        (SELECT id FROM barcelona_id),
        'Corporate Dining & Entertainment',
        'catering',
        'Exclusive dining experiences and entertainment venues for corporate clients',
        100,
        '€€€€',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
        '[
            "Private dining rooms",
            "Wine tastings",
            "Chef''s table experiences",
            "Entertainment packages",
            "Custom menus",
            "Corporate packages"
        ]'::jsonb,
        '{
            "availability_hours": "Monday-Sunday: 12:00-00:00",
            "minimum_guests": 10,
            "maximum_guests": 100,
            "booking_notice": "48 hours"
        }'::jsonb
    );

-- Update Barcelona's company services metadata
UPDATE public.destinations
SET company_services_metadata = jsonb_build_object(
    'business_facilities', ARRAY[
        'Conference centers',
        'Meeting rooms',
        'Event venues',
        'Corporate lounges',
        'Business centers',
        'Co-working spaces',
        'Private dining rooms'
    ],
    'corporate_amenities', ARRAY[
        'High-speed internet',
        'AV equipment',
        'Catering services',
        'Transportation services',
        'Event planning assistance',
        'VIP services',
        'Business concierge'
    ],
    'event_capabilities', ARRAY[
        'Large conferences',
        'Corporate retreats',
        'Team building activities',
        'Product launches',
        'Board meetings',
        'Networking events',
        'Training workshops',
        'Private tours',
        'Executive dining'
    ],
    'business_activities', ARRAY[
        'Networking events',
        'Corporate tours',
        'VIP transport',
        'Professional training',
        'Co-working',
        'Business dining'
    ]
)
WHERE city = 'Barcelona';