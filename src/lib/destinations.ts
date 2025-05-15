export interface Destination {
  id: number;
  country: string;
  city: string;
  description?: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  visit_type: string;
  highlights: string[];
  cuisine: string[];
  max_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface PointOfInterest {
  id: number;
  name: string;
  type: string;
  position: {
    lat: number;
    lng: number;
  };
  description?: string;
  image?: string;
  rating?: number;
  price?: string;
  booking_url?: string;
  amenities?: string[];
  flight_details?: {
    departure: string;
    arrival: string;
    airline: string;
    flight_number: string;
    duration: string;
    cabin_class: string[];
  };
  shuttle_details?: any; // Define proper type if needed
  created_at?: string;
  updated_at?: string;
}

export interface Guide {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Attraction {
  id: number;
  name: string;
  type: string;
  duration: string;
  price: number;
  groupPrice?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  image: string;
  highlights: string[];
  guide?: Guide;
  created_at?: string;
  updated_at?: string;
}

export const destinationApi = {
  // Fetch all destinations (for Explore cards)
  getDestinations: async (): Promise<Destination[]> => {
    const res = await fetch('http://127.0.0.1:8000/api/destinations');
    if (!res.ok) throw new Error('Failed to fetch destinations.');
    const data = await res.json();

    return data.map((destination: any) => ({
      id: destination.id,
      country: destination.country,
      city: destination.city,
      image: destination.image,
      coordinates: destination.coordinates ? JSON.parse(destination.coordinates) : { lat: 0, lng: 0 },
      visit_type: destination.visit_type,
      highlights: destination.highlights ? JSON.parse(destination.highlights) : [],
      cuisine: destination.cuisine ? JSON.parse(destination.cuisine) : [],
      max_price: parseFloat(destination.max_price) || 0,
      description: destination.description,
      created_at: destination.created_at,
      updated_at: destination.updated_at
    })) as Destination[];
  },

  // Fetch single destination with points of interest and attractions
  getDestination: async (id: number): Promise<{
    destination: Destination;
    points_of_interest: PointOfInterest[];
    attractions: Attraction[];
  }> => {
    const res = await fetch(`http://127.0.0.1:8000/api/destinations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch destination details.');
    const data = await res.json();

    const destination: Destination = {
      id: data.id,
      country: data.country,
      city: data.city,
      image: data.image,
      coordinates: data.coordinates ? JSON.parse(data.coordinates) : { lat: 0, lng: 0 },
      visit_type: data.visit_type,
      highlights: data.highlights ? JSON.parse(data.highlights) : [],
      cuisine: data.cuisine ? JSON.parse(data.cuisine) : [],
      max_price: parseFloat(data.max_price) || 0,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    const points_of_interest: PointOfInterest[] = (data.points_of_interest || []).map((poi: any) => ({
      id: poi.id,
      name: poi.name,
      type: poi.type,
      position: poi.position ? JSON.parse(poi.position) : { lat: 0, lng: 0 },
      description: poi.description,
      image: poi.image,
      rating: poi.rating ? parseFloat(poi.rating) : undefined,
      price: poi.price,
      booking_url: poi.booking_url,
      amenities: poi.amenities ? JSON.parse(poi.amenities) : undefined,
      flight_details: poi.flight_details ? JSON.parse(poi.flight_details) : undefined,
      shuttle_details: poi.shuttle_details,
      created_at: poi.created_at,
      updated_at: poi.updated_at
    }));

    const attractions: Attraction[] = (data.attractions || []).map((attraction: any) => ({
  id: attraction.id,
  name: attraction.name,
  type: attraction.type,
  duration: attraction.duration,
  price: parseFloat(attraction.price),
  groupPrice: attraction.group_price ? parseFloat(attraction.group_price) : undefined,
  minGroupSize: attraction.min_group_size,
  maxGroupSize: attraction.max_group_size,
  image: attraction.image,
  highlights: attraction.highlights ? JSON.parse(attraction.highlights) : [],  // <-- Fix here
  guide: attraction.guide ? {
    id: attraction.guide.id,
    name: attraction.guide.name,
    avatar: attraction.guide.avatar,
    rating: parseFloat(attraction.guide.rating),
    reviews: attraction.guide.reviews,
    experience: attraction.guide.experience,
    languages: attraction.guide.languages ? JSON.parse(attraction.guide.languages) : [], // <-- And here
    created_at: attraction.guide.created_at,
    updated_at: attraction.guide.updated_at
  } : undefined,
  created_at: attraction.created_at,
  updated_at: attraction.updated_at
}));


    return { destination, points_of_interest, attractions };
  }
};