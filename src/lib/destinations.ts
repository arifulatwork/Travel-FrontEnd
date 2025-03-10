import { supabase } from './supabase';

export interface Destination {
  id: string;
  country: string;
  city: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image_url: string;
  population?: number;
  timezone?: string;
  weather_info?: {
    climate: string;
    average_temperature: {
      summer: number;
      winter: number;
    };
    rainy_season: string;
  };
  transportation_info?: {
    metro?: boolean;
    bus?: boolean;
    bike_sharing?: boolean;
    ferry?: boolean;
    airport?: string;
    main_stations?: string[];
  };
  best_times_to_visit?: string[];
  local_customs?: string[];
  emergency_contacts?: {
    police: string;
    ambulance: string;
    fire?: string;
    emergency?: string;
    tourist_police?: string;
    hospitals?: string[];
  };
  metadata?: {
    region: string;
    highlights: string[];
    cuisine: string[];
    unesco_sites: string[];
  };
  company_services_metadata?: {
    business_facilities: string[];
    corporate_amenities: string[];
    event_capabilities: string[];
    business_activities?: string[];
  };
  congress_metadata?: {
    upcoming_events: string[];
    venues: string[];
    industries: string[];
  };
}

export interface Activity {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  type: 'tour' | 'attraction' | 'restaurant' | 'custom';
  price: number;
  group_price?: number;
  min_group_size?: number;
  max_group_size?: number;
  duration: string;
  location: string;
  image_url: string;
  status: 'active' | 'inactive' | 'sold_out';
  available_spots: number;
  metadata?: any;
}

export interface BusinessService {
  id: string;
  destination_id: string;
  service_name: string;
  service_type: 'conference_hall' | 'event_venue' | 'catering' | 'team_building';
  description: string;
  capacity: number;
  price_range: string;
  image_url: string;
  booking_url?: string;
  features: string[];
  availability: {
    availability_hours: string;
    minimum_booking_hours?: number;
    setup_time?: string;
    booking_notice: string;
    minimum_participants?: number;
    maximum_participants?: number;
  };
}

export interface CongressTicket {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  event_type: 'conference' | 'summit' | 'expo' | 'workshop' | 'seminar';
  start_date: string;
  end_date: string;
  venue: string;
  price_range: string;
  image_url: string;
  booking_url?: string;
  capacity: number;
  available_tickets: number;
  early_bird_deadline?: string;
  early_bird_price?: string;
  features: string[];
  schedule: any[];
  speakers: any[];
}

const parseCoordinates = (coordinates: string | { lat: number; lng: number }) => {
  if (typeof coordinates === 'string') {
    // Handle point format from PostgreSQL: "(lat,lng)"
    const match = coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
  }
  return coordinates as { lat: number; lng: number };
};

export const destinationApi = {
  // Get all destinations with their activities
  getDestinations: async () => {
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('*')
      .order('city');

    if (destError) throw destError;

    // Get activities for all destinations in a single query
    const { data: activities, error: actError } = await supabase
      .from('activities')
      .select('*')
      .in('destination_id', destinations.map(d => d.id))
      .eq('status', 'active')
      .order('price');

    if (actError) throw actError;

    // Parse coordinates and combine with activities
    return destinations.map(destination => ({
      ...destination,
      coordinates: parseCoordinates(destination.coordinates),
      activities: activities.filter(activity => activity.destination_id === destination.id)
    })) as (Destination & { activities: Activity[] })[];
  },

  // Get destination by ID with activities
  getDestination: async (id: string) => {
    const { data, error } = await supabase
      .from('destinations')
      .select(`
        *,
        activities(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      coordinates: parseCoordinates(data.coordinates),
      activities: data.activities
    } as Destination & { activities: Activity[] };
  },

  // Get activities for a destination
  getActivities: async (destinationId: string) => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('destination_id', destinationId)
      .eq('status', 'active')
      .order('price');

    if (error) throw error;
    return data as Activity[];
  },

  // Get business services
  getBusinessServices: async () => {
    const { data, error } = await supabase
      .from('company_services')
      .select('*')
      .order('service_type');

    if (error) throw error;
    return data as BusinessService[];
  },

  // Get business services by destination
  getBusinessServicesByDestination: async (destinationId: string) => {
    const { data, error } = await supabase
      .from('company_services')
      .select('*')
      .eq('destination_id', destinationId)
      .order('service_type');

    if (error) throw error;
    return data as BusinessService[];
  },

  // Get business services by type
  getBusinessServicesByType: async (destinationId: string, serviceType: string) => {
    const { data, error } = await supabase
      .from('company_services')
      .select('*')
      .eq('destination_id', destinationId)
      .eq('service_type', serviceType)
      .order('service_name');

    if (error) throw error;
    return data as BusinessService[];
  },

  // Get congress tickets
  getCongressTickets: async () => {
    const { data, error } = await supabase
      .from('congress_tickets')
      .select('*')
      .order('start_date');

    if (error) throw error;
    return data as CongressTicket[];
  },

  // Get congress tickets by destination
  getCongressTicketsByDestination: async (destinationId: string) => {
    const { data, error } = await supabase
      .from('congress_tickets')
      .select('*')
      .eq('destination_id', destinationId)
      .order('start_date');

    if (error) throw error;
    return data as CongressTicket[];
  },

  // Create a booking
  createBooking: async (booking: {
    user_id: string;
    activity_id: string;
    booking_date: string;
    start_time: string;
    participants: number;
    total_price: number;
    special_requests?: string;
  }) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};