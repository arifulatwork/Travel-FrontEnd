import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

const tripData = {
  id: 'albania-macedonia-greece',
  title: 'Albania, Macedonia & Greece Adventure',
  description: 'Embark on an unforgettable journey through the heart of the Balkans. Discover ancient ruins, vibrant cultures, and breathtaking landscapes across three fascinating countries. From the pristine beaches of the Albanian Riviera to the historic streets of Ohrid and the iconic monuments of Greece.',
  duration: '15 days',
  price: 2499,
  image: 'https://images.unsplash.com/photo-1592486058517-36236ba247c8?auto=format&fit=crop&w=800&q=80',
  destinations: ['Albania', 'North Macedonia', 'Greece'],
  groupSize: {
    min: 4,
    max: 12
  },
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Tirana',
      description: 'Welcome to Albania! Upon arrival at Tirana International Airport, transfer to your hotel. Evening welcome meeting and traditional dinner.',
      meals: ['Dinner'],
      accommodation: 'Hotel in Tirana'
    },
    {
      day: 2,
      title: 'Tirana City Tour & Kruja',
      description: 'Explore Tirana\'s highlights including Skanderbeg Square and the National Museum. Afternoon visit to historic Kruja.',
      meals: ['Breakfast', 'Lunch'],
      accommodation: 'Hotel in Tirana'
    },
    {
      day: 3,
      title: 'Ohrid, North Macedonia',
      description: 'Cross into Macedonia and discover UNESCO-listed Ohrid, known for its beautiful lake and historic churches.',
      meals: ['Breakfast', 'Dinner'],
      accommodation: 'Hotel in Ohrid'
    },
    {
      day: 4,
      title: 'Meteora, Greece',
      description: 'Travel to Greece to visit the magnificent monasteries of Meteora perched atop dramatic rock formations.',
      meals: ['Breakfast', 'Lunch'],
      accommodation: 'Hotel in Kalambaka'
    }
  ],
  included: [
    'All accommodations in 4-star hotels',
    'Professional English-speaking guide',
    'Private transportation',
    'Daily breakfast and selected meals',
    'All entrance fees',
    'Airport transfers',
    'Local experiences and cultural activities'
  ],
  notIncluded: [
    'International flights',
    'Travel insurance',
    'Personal expenses',
    'Optional activities',
    'Gratuities',
    'Visa fees (if applicable)'
  ]
};

const BalkanTripsSection: React.FC = () => {
  const [showFullTrip, setShowFullTrip] = useState(false);

  const handleBook = () => {
    // Implement booking logic
    console.log('Booking trip:', tripData.id);
  };

  if (showFullTrip) {
    return (
      <div className="p-4">
        <button
          onClick={() => setShowFullTrip(false)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails {...tripData} onBook={handleBook} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold dark:text-white">Balkan Adventures</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Discover our curated collection of multi-country adventures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TripCard
          {...tripData}
          onClick={() => setShowFullTrip(true)}
        />
      </div>
    </div>
  );
};

export default BalkanTripsSection;