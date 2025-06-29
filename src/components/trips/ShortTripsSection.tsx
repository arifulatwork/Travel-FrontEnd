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

  const processImageUrl = (url: string): string => {
    if (!url) return '';
    
    // If already a full URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Handle cases where URL might start with 'trip-images/' or 'storage/trip-images/'
    if (url.startsWith('trip-images/')) {
      return `${BASE_URL}/${STORAGE_PATH}/${url}`;
    }
    
    if (url.startsWith('storage/trip-images/')) {
      return `${BASE_URL}/${url}`;
    }
    
    if (url.startsWith('storage/')) {
      return `${BASE_URL}/${url}`;
    }
    
    // Default case - prepend base URL and storage path
    return `${BASE_URL}/${STORAGE_PATH}/trip-images/${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trips
        const tripsResponse = await fetch(`${BASE_URL}/api/trips`);
        if (!tripsResponse.ok) throw new Error('Failed to fetch trips');
        const tripsData = await tripsResponse.json();
        
        // Process image URLs to ensure they're complete
        const processedTrips = tripsData.data.map((trip: Trip) => ({
          ...trip,
          image_url: processImageUrl(trip.image_url)
        }));
        
        setTrips(processedTrips || []);

        // Fetch categories
        const categoriesResponse = await fetch(`${BASE_URL}/api/trip-categories`);
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

    fetchData();
  }, []);

  const handleBook = (tripSlug: string) => {
    console.log('Booking trip:', tripSlug);
    // Add your booking logic here
  };

  const filteredTrips = trips.filter(trip => {
    // Check if trip has a category
    if (!trip.category) return false;
    
    // Apply filters
    const matchesCategory = !activeCategory || trip.category.slug === activeCategory;
    const matchesPrice = parseFloat(trip.price) <= maxPrice;
    const matchesSearch = searchQuery === '' || 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

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
          onBook={() => handleBook(trip.slug)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {/* Category Selection */}
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

      {/* Trips Grid */}
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