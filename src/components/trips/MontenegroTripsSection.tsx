import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

const montenegroTrips = [
  {
    id: 'montenegro-highlights',
    title: 'Montenegro Highlights Tour',
    description: 'Experience the best of Montenegro in this comprehensive tour covering stunning coastlines, historic towns, and majestic mountains. From the medieval streets of Kotor to the pristine shores of Budva and the wilderness of Durmitor National Park.',
    duration: '8 days',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1591984942817-805d35c81b6a?auto=format&fit=crop&w=800&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    destinations: ['Kotor', 'Budva', 'Durmitor'],
    groupSize: {
      min: 4,
      max: 12
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kotor',
        description: 'Welcome to Montenegro! Transfer to your hotel in the UNESCO-listed town of Kotor. Evening walking tour and welcome dinner.',
        meals: ['Dinner'],
        accommodation: 'Hotel in Kotor'
      },
      {
        day: 2,
        title: 'Kotor Bay & Perast',
        description: 'Explore the stunning Bay of Kotor, visit Our Lady of the Rocks island, and discover the charming town of Perast.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Hotel in Kotor'
      },
      {
        day: 3,
        title: 'Budva Riviera',
        description: 'Discover the beautiful Budva Riviera, its beaches, and the picturesque Sveti Stefan island.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Hotel in Budva'
      },
      {
        day: 4,
        title: 'Durmitor National Park',
        description: 'Journey to the magnificent Durmitor National Park for hiking and scenic views.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Mountain Lodge in Žabljak'
      }
    ],
    included: [
      'All accommodations (4-star hotels and mountain lodge)',
      'Professional English-speaking guide',
      'Private transportation',
      'Daily breakfast and selected meals',
      'All entrance fees',
      'Airport transfers',
      'Local experiences and activities'
    ],
    notIncluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Optional activities',
      'Gratuities'
    ]
  },
  {
    id: 'montenegro-coast-adventure',
    title: 'Coastal Montenegro Adventure',
    description: 'Explore Montenegro\'s stunning Adriatic coastline, combining beach relaxation with cultural discoveries. Visit ancient coastal towns, enjoy water activities, and savor fresh seafood.',
    duration: '6 days',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    destinations: ['Budva', 'Kotor', 'Herceg Novi'],
    groupSize: {
      min: 2,
      max: 10
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Budva',
        description: 'Welcome to Montenegro\'s coast! Transfer to your beachfront hotel and evening orientation walk.',
        meals: ['Dinner'],
        accommodation: 'Hotel in Budva'
      },
      {
        day: 2,
        title: 'Beaches & Old Town',
        description: 'Explore Budva\'s beautiful beaches and historic old town. Optional water sports activities.',
        meals: ['Breakfast'],
        accommodation: 'Hotel in Budva'
      }
    ],
    included: [
      'Beachfront accommodation',
      'Expert local guide',
      'Transportation',
      'Daily breakfast',
      'Welcome dinner',
      'Beach access',
      'City tours'
    ],
    notIncluded: [
      'Flights',
      'Insurance',
      'Optional activities',
      'Additional meals',
      'Personal expenses'
    ]
  }
];

const MontenegroTripsSection: React.FC = () => {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const handleBook = (tripId: string) => {
    console.log('Booking trip:', tripId);
  };

  if (selectedTrip) {
    const trip = montenegroTrips.find(t => t.id === selectedTrip);
    if (!trip) return null;

    return (
      <div className="p-2 sm:p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-4 sm:mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-base"
        >
          ← Back to All Tours
        </button>
        <TripDetails 
          title={trip.title}
          description={trip.description}
          duration={parseInt(trip.duration)}
          price={trip.price}
          image={trip.image}
          maxParticipants={trip.groupSize?.max || 0}
          highlights={trip.itinerary.map(item => ({ day: item.day, activities: [{ time: '', activity: item.title, description: item.description }] }))}
          included={trip.included}
          isBooked={false}
          onBook={() => handleBook(trip.id)}
          onViewDetails={() => setSelectedTrip(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          <h2 className="text-lg sm:text-2xl font-bold dark:text-white">Montenegro Tours</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base">
          Discover the hidden gem of the Adriatic with our curated Montenegro tours
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {montenegroTrips.map(trip => (
          <TripCard
            key={trip.id}
            title={trip.title}
            description={trip.description}
            durationDays={parseInt(trip.duration)}
            price={trip.price}
            image={trip.image}
            maxParticipants={trip.groupSize?.max || 0}
            highlights={trip.itinerary.map(item => ({ day: item.day, activities: [{ time: '', activity: item.title, description: item.description }] }))}
            onClick={() => setSelectedTrip(trip.id)}
            isBooked={false}
          />
        ))}
      </div>
    </div>
  );
};

export default MontenegroTripsSection;