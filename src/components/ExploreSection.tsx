import React, { useState, useEffect } from 'react';
import { Search, DollarSign, User, Users, ArrowLeft, Coffee, Music, Utensils, Palette, Search as SearchIcon, X, Calendar, Info, Check, CreditCard, ChevronDown, Sun, Moon, Plane, AlertCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import DestinationCard from './DestinationCard';
import DestinationDetails from './DestinationDetails';
import LocalTouchSection from './LocalTouchSection';
import BalkanTripsSection from './trips/BalkanTripsSection';
import MontenegroTripsSection from './trips/MontenegroTripsSection';
import PetraTripsSection from './trips/PetraTripsSection';
import ShortTripsSection from './trips/ShortTripsSection';
import { destinationApi } from '../lib/destinations';

const TRANSLATIONS = {
  en: {
    exploreDestinations: 'Explore Destinations',
    findNextAdventure: 'Find your next adventure',
    searchPlaceholder: 'Search destinations or experiences...',
    maxPrice: 'Max price',
    individual: 'Individual',
    group: 'Group',
    backToDestinations: 'Back to Destinations',
    shortTrips: 'Short Trips & Excursions',
    dayTrips: 'Day Trips',
    weekendEscapes: 'Weekend Escapes',
    afternoonTrips: 'Afternoon Trips',
    twoDayTrips: 'Two-Day Trips',
    threeDayTrips: 'Three-Day Trips',
    fourDayTrips: 'Four-Day Trips'
  },
  es: {
    // ... Spanish translations
  },
  fr: {
    // ... French translations  
  },
  de: {
    // ... German translations
  }
};

const tripTypes = [
  { id: 'one-day', label: 'One-Day Trips', icon: Sun },
  { id: 'weekend', label: 'Weekend Escapes', icon: Calendar },
  { id: 'afternoon', label: 'Afternoon Trips', icon: Moon },
  { id: 'two-day', label: 'Two-Day Trips', icon: Calendar },
  { id: 'three-day', label: 'Three-Day Trips', icon: Calendar },
  { id: 'four-day', label: 'Four-Day Trips', icon: Calendar }
];

interface ExploreProps {
  maxPrice?: number;
  selectedType?: string | null;
  searchQuery?: string;
}

interface DestinationDetailsData {
  destination: any;
  points_of_interest: any[];
  attractions: any[];
}

const ExploreSection: React.FC<ExploreProps> = () => {
  const { settings } = useSettings();
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedDestinationDetails, setSelectedDestinationDetails] = useState<DestinationDetailsData | null>(null);
  const [visitType, setVisitType] = useState<'individual' | 'group'>('individual');
  const [activeSection, setActiveSection] = useState<'short-trips' | 'destinations' | 'local' | 'balkan-trips' | 'montenegro-tours' | 'petra-tours'>('destinations');
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await destinationApi.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setError('Failed to load destinations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleViewDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const fullData = await destinationApi.getDestination(id);
      setSelectedDestination(id);
      setSelectedDestinationDetails(fullData);
    } catch (err) {
      console.error('Failed to fetch destination details:', err);
      setError('Failed to load destination details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(destination =>
    destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (destination.highlights || []).some((highlight: string) => 
      highlight.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (detailsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-gray-200 h-96 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (selectedDestinationDetails) {
    const { destination, points_of_interest, attractions } = selectedDestinationDetails;

    return (
      <div className="p-4">
        <button
          onClick={() => {
            setSelectedDestination(null);
            setSelectedDestinationDetails(null);
          }}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          {t.backToDestinations}
        </button>
        <DestinationDetails
          country={destination.country}
          city={destination.city}
          description={destination.description}
          coordinates={destination.coordinates}
          image={destination.image}
          pointsOfInterest={points_of_interest}
          attractions={attractions}
          visitType={visitType}
          maxPrice={maxPrice}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.exploreDestinations}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.findNextAdventure}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="w-64">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder={t.maxPrice}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVisitType('individual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                visitType === 'individual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <User className="h-4 w-4" />
              {t.individual}
            </button>
            <button
              onClick={() => setVisitType('group')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                visitType === 'group'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Users className="h-4 w-4" />
              {t.group}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 border-b overflow-x-auto">
          <button
            onClick={() => setActiveSection('short-trips')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeSection === 'short-trips'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.shortTrips}
          </button>
          <button
            onClick={() => setActiveSection('destinations')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeSection === 'destinations'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setActiveSection('local')}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'local'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Coffee className="h-4 w-4" />
            Local Touch
          </button>
          <button
            onClick={() => setActiveSection('balkan-trips')}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'balkan-trips'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plane className="h-4 w-4" />
            Balkan Adventures
          </button>
          <button
            onClick={() => setActiveSection('montenegro-tours')}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'montenegro-tours'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plane className="h-4 w-4" />
            Montenegro Tours
          </button>
          <button
            onClick={() => setActiveSection('petra-tours')}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'petra-tours'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plane className="h-4 w-4" />
            Petra Tours
          </button>
        </div>
      </div>

      {activeSection === 'short-trips' ? (
        <ShortTripsSection 
          maxPrice={maxPrice} 
          selectedType={selectedTripType} 
          searchQuery={searchQuery}
        />
      ) : activeSection === 'destinations' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              country={destination.country}
              city={destination.city}
              image={destination.image}
              services={[]}
              onViewDetails={() => handleViewDetails(destination.id)}
              visitType={visitType}
              metadata={{
                highlights: destination.highlights,
                cuisine: destination.cuisine
              }}
            />
          ))}
        </div>
      ) : activeSection === 'local' ? (
        <LocalTouchSection />
      ) : activeSection === 'balkan-trips' ? (
        <BalkanTripsSection />
      ) : activeSection === 'montenegro-tours' ? (
        <MontenegroTripsSection />
      ) : activeSection === 'petra-tours' ? (
        <PetraTripsSection />
      ) : null}
    </div>
  );
};

export default ExploreSection;