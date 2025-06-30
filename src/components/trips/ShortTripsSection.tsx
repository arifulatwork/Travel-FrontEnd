import React, { useState, useEffect } from 'react';
import { 
  Info, Bot as Lotus, Music, Trees as Tree, Smile as Family, 
  Factory, Dog, Home, Landmark, Heart, Music as Dance 
} from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

interface ShortTripsSectionProps {
  maxPrice: number;
  selectedType: string | null;
  searchQuery: string;
}

interface Trip {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  discount_percentage: number;
  image_url: string;
  duration_days: number;
  max_participants: number | null;
  highlights: { item: string }[];
  learning_outcomes?: { item: string }[];
  personal_development?: { item: string }[];
  certifications?: { item: string }[];
  environmental_impact?: { item: string }[];
  community_benefits?: { item: string }[];
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  lotus: Lotus,
  music: Music,
  tree: Tree,
  family: Family,
  factory: Factory,
  dog: Dog,
  home: Home,
  landmark: Landmark,
  heart: Heart,
  dance: Dance
};

const BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_PATH = 'storage';

const ShortTripsSection: React.FC<ShortTripsSectionProps> = ({ 
  maxPrice, 
  selectedType, 
  searchQuery 
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // First check authentication status
  useEffect(() => {
   const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${BASE_URL}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Not authenticated');
    const user = await res.json();
    console.log("✅ Authenticated user:", user);
    setIsAuthenticated(true);
  } catch (err) {
    setIsAuthenticated(false);
    console.error("❌ Authentication check failed:", err);
  }
};



    checkAuth();
  }, []);

  const processImageUrl = (url: string): string => {
    if (!url) return '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('trip-images/')) {
      return `${BASE_URL}/${STORAGE_PATH}/${url}`;
    }
    
    if (url.startsWith('storage/trip-images/')) {
      return `${BASE_URL}/${url}`;
    }
    
    if (url.startsWith('storage/')) {
      return `${BASE_URL}/${url}`;
    }
    
    return `${BASE_URL}/${STORAGE_PATH}/trip-images/${url}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tripsResponse = await fetch(`${BASE_URL}/api/trips`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (!tripsResponse.ok) throw new Error('Failed to fetch trips');
      const tripsData = await tripsResponse.json();
      
      const processedTrips = tripsData.data.map((trip: Trip) => ({
        ...trip,
        image_url: processImageUrl(trip.image_url)
      }));
      
      setTrips(processedTrips || []);

      const categoriesResponse = await fetch(`${BASE_URL}/api/trip-categories`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleBook = async (tripSlug: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/trips/${tripSlug}/book`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) throw new Error('Booking failed');
      
      const data = await response.json();
      console.log('Booking successful:', data);
      alert('Trip booked successfully!');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book trip. Please try again.');
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (!trip.category) return false;
    
    const matchesCategory = !activeCategory || trip.category.slug === activeCategory;
    const matchesPrice = parseFloat(trip.price) <= maxPrice;
    const matchesSearch = searchQuery === '' || 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  if (isAuthenticated === false) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <Info className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Authentication Required</h3>
        <p className="text-red-600">Please log in to view trips</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <Info className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error loading trips</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (selectedTrip) {
    const trip = trips.find(t => t.slug === selectedTrip);
    if (!trip) return null;

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails 
          id={trip.slug}
          type={trip.category.slug}
          name={trip.title}
          description={trip.description}
          price={parseFloat(trip.price)}
          originalPrice={parseFloat(trip.original_price)}
          discountPercentage={trip.discount_percentage}
          image={trip.image_url}
          highlights={trip.highlights || []}
          maxParticipants={trip.max_participants || 0}
          learningOutcomes={trip.learning_outcomes || []}
          personalDevelopment={trip.personal_development || []}
          certifications={trip.certifications || []}
          environmentalImpact={trip.environmental_impact || []}
          communityBenefits={trip.community_benefits || []}
          onBook={() => handleBook(trip.slug)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => {
          const IconComponent = iconMap[category.icon] || Info;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.slug ? null : category.slug)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeCategory === category.slug
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <IconComponent className={`h-6 w-6 ${
                  activeCategory === category.slug ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <h3 className={`font-medium ${
                  activeCategory === category.slug ? 'text-purple-600' : 'text-gray-700'
                }`}>
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => (
          <div key={trip.slug} className="relative">
            {trip.discount_percentage > 0 && (
              <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {trip.discount_percentage}% OFF
              </div>
            )}
            <TripCard
              id={trip.slug}
              type={trip.category.slug}
              name={trip.title}
              description={trip.description}
              price={parseFloat(trip.price)}
              originalPrice={parseFloat(trip.original_price)}
              discountPercentage={trip.discount_percentage}
              image={trip.image_url}
              onClick={() => setSelectedTrip(trip.slug)}
            />
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ShortTripsSection;