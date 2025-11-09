import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import MontenegroTripsSection from './MontenegroTripsSection';
import PetraTripsSection from './PetraTripsSection';
import BalkanTripsSection from './BalkanTripsSection';

interface TripCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  priceRange: string;
  destinations: string[];
  section: React.ComponentType;
}

const TripSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const tripCategories: TripCategory[] = [
    {
      id: 'montenegro',
      title: 'Montenegro Adventures',
      description: 'Discover the stunning beauty of Montenegro with our curated multi-country tours. Experience breathtaking coastlines, medieval towns, and majestic mountains.',
      image: '/images/montenegro-trips.jpg',
      duration: '5-10 days',
      priceRange: '€800 - €2000',
      destinations: ['Montenegro', 'Croatia', 'Bosnia', 'Albania'],
      section: MontenegroTripsSection
    },
    {
      id: 'balkan',
      title: 'Balkan Adventures',
      description: 'Explore the diverse cultures and landscapes of the Balkan region. From historic cities to natural wonders, experience the best of Southeastern Europe.',
      image: '/images/balkan-trips.jpg',
      duration: '7-14 days',
      priceRange: '€1000 - €2500',
      destinations: ['Serbia', 'Croatia', 'Bosnia', 'Montenegro', 'Albania'],
      section: BalkanTripsSection
    },
    {
      id: 'spain',
      title: 'Spain & Mediterranean Tours',
      description: 'Immerse yourself in the vibrant culture, history, and cuisine of Spain. Explore iconic cities, beautiful coastlines, and rich architectural heritage.',
      image: '/images/spain-trips.jpg',
      duration: '4-12 days',
      priceRange: '€600 - €1800',
      destinations: ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Costa del Sol'],
      section: PetraTripsSection
    }
  ];

  if (selectedCategory) {
    const category = tripCategories.find(cat => cat.id === selectedCategory);
    if (category) {
      const CategoryComponent = category.section;
      return (
        <div className="p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            ← Back to All Trips
          </button>
          <CategoryComponent />
        </div>
      );
    }
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Trips & Tours</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover our curated collection of multi-country tours and adventures
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {tripCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300">
                {category.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {category.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{category.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{category.priceRange}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{category.destinations.join(', ')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-purple-600 font-semibold">View Tours</span>
                <ArrowRight className="h-5 w-5 text-purple-600 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 text-center">
        <Plane className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Can't Find What You're Looking For?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
          We specialize in creating custom itineraries tailored to your preferences. 
          Contact us to design your perfect trip.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300">
          Request Custom Trip
        </button>
      </div>
    </div>
  );
};

export default TripSection;