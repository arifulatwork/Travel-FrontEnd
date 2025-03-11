import React, { useState, useEffect } from 'react';
import { Search, DollarSign, User, Users, ArrowLeft, Building2, Coffee, Music, Utensils, Palette, Search as SearchIcon, X, Calendar, Info, Check, CreditCard, ChevronDown, Sun, Moon, Plane, AlertCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import DestinationCard from './DestinationCard';
import DestinationDetails from './DestinationDetails';
import LocalTouchSection from './LocalTouchSection';
import BalkanTripsSection from './trips/BalkanTripsSection';
import MontenegroTripsSection from './trips/MontenegroTripsSection';
import PetraTripsSection from './trips/PetraTripsSection';
import ShortTripsSection from './trips/ShortTripsSection';
import { destinationApi } from '../lib/destinations';
import { checkConnection } from '../lib/supabase';

const TRANSLATIONS = {
  en: {
    exploreDestinations: 'Explore Destinations',
    findNextAdventure: 'Find your next adventure',
    searchPlaceholder: 'Search destinations or experiences...',
    maxPrice: 'Max price',
    individual: 'Individual',
    group: 'Group',
    company: 'For Companies',
    backToDestinations: 'Back to Destinations',
    corporateEvents: 'Corporate Events',
    teamBuilding: 'Team Building',
    congressTickets: 'Congress Tickets',
    upcomingCongresses: 'Upcoming Congresses',
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

const ExploreSection: React.FC<ExploreProps> = () => {
  const { settings } = useSettings();
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<'individual' | 'group' | 'company'>('individual');
  const [businessCategory, setBusinessCategory] = useState<'events' | 'team_building' | 'congress' | null>(null);
  const [activeSection, setActiveSection] = useState<'short-trips' | 'destinations' | 'local' | 'balkan-trips' | 'montenegro-tours' | 'petra-tours'>('destinations');
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [businessServices, setBusinessServices] = useState<any[]>([]);
  const [congressTickets, setCongressTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        setConnectionError(false);

        const isConnected = await checkConnection();
        if (!isConnected) {
          setConnectionError(true);
          return;
        }

        const [destinationsData, servicesData, ticketsData] = await Promise.all([
          destinationApi.getDestinations(),
          destinationApi.getBusinessServices(),
          destinationApi.getCongressTickets()
        ]);

        setDestinations(destinationsData);
        setBusinessServices(servicesData);
        setCongressTickets(ticketsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = (
      destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.activities?.some(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    const hasServicesInPriceRange = destination.activities?.some(
      activity => activity.price <= maxPrice
    );

    return matchesSearch && hasServicesInPriceRange;
  });

  if (connectionError) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Database Connection Required</h3>
          <p className="text-yellow-700 mb-4">
            Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
          </p>
        </div>
      </div>
    );
  }

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

  if (selectedDestination) {
    const destination = destinations.find(d => d.id === selectedDestination);
    if (!destination) return null;

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedDestination(null)}
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
          image={destination.image_url}
          pointsOfInterest={destination.pointsOfInterest || []}
          attractions={destination.activities?.map(activity => ({
            name: activity.title,
            type: activity.type,
            price: activity.price,
            groupPrice: activity.group_price,
            duration: activity.duration,
            image: activity.image_url,
            minGroupSize: activity.min_group_size,
            maxGroupSize: activity.max_group_size,
            guide: activity.guide
          })) || []}
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
            <button
              onClick={() => setVisitType('company')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                visitType === 'company'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Building2 className="h-4 w-4" />
              {t.company}
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
        <div className="">
          {filteredDestinations.slice(0, 1).map((destination) => (
            <DestinationCard
              key={destination.id}
              country={destination.country}
              city={destination.city}
              image={destination.image_url}
              services={destination.activities || []}
              onViewDetails={() => setSelectedDestination(destination.id)}
              visitType={visitType}
              metadata={destination.metadata}
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