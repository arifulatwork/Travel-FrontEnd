export interface Destination {
  id: number;
  country: string;
  city: string;
  description?: string;
  image: string;
  highlights: string[];
  cuisine: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PointOfInterest {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
}

export interface Guide {
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
}

export interface Attraction {
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
      highlights: destination.highlights ? JSON.parse(destination.highlights) : [],
      cuisine: destination.cuisine ? JSON.parse(destination.cuisine) : [],
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
      highlights: data.highlights ? JSON.parse(data.highlights) : [],
      cuisine: data.cuisine ? JSON.parse(data.cuisine) : [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      description: data.description
    };

    const points_of_interest: PointOfInterest[] = (data.points_of_interest || []).map((poi: any) => ({
      name: poi.name,
      coordinates: {
        lat: parseFloat(poi.latitude),
        lng: parseFloat(poi.longitude)
      },
      type: poi.type
    }));

    const attractions: Attraction[] = (data.attractions || []).map((attraction: any) => ({
      name: attraction.name,
      type: attraction.type,
      duration: attraction.duration,
      price: parseFloat(attraction.price),
      groupPrice: attraction.group_price ? parseFloat(attraction.group_price) : undefined,
      minGroupSize: attraction.min_group_size,
      maxGroupSize: attraction.max_group_size,
      image: attraction.image,
      highlights: attraction.highlights ? JSON.parse(attraction.highlights) : [],
      guide: attraction.guide ? {
        name: attraction.guide.name,
        avatar: attraction.guide.avatar,
        rating: parseFloat(attraction.guide.rating),
        reviews: attraction.guide.reviews,
        experience: attraction.guide.experience,
        languages: attraction.guide.languages ? JSON.parse(attraction.guide.languages) : []
      } : undefined
    }));

    return { destination, points_of_interest, attractions };
  }
};
