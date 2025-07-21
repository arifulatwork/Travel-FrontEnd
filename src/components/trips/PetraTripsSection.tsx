import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

const petraTrips = [
  {
    id: 'petra-discovery',
    title: 'Petra Discovery Tour',
    description: 'Explore the ancient city of Petra, one of the New Seven Wonders of the World. Walk through the Siq to the Treasury, discover the Monastery, and experience Bedouin culture in this unforgettable journey.',
    duration: '3 days',
    price: 699,
    image: 'https://images.unsplash.com/photo-1563177978-4c5f1e1b6efa?auto=format&fit=crop&w=800&q=80',
    destinations: ['Petra', 'Wadi Musa'],
    groupSize: {
      min: 2,
      max: 15
    },
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '14:00',
            activity: 'Arrival & Hotel Check-in',
            description: 'Welcome meeting and hotel check-in in Wadi Musa'
          },
          {
            time: '16:00',
            activity: 'Orientation Walk',
            description: 'Guided walk through Wadi Musa town with historical overview'
          },
          {
            time: '19:00',
            activity: 'Petra by Night Show',
            description: 'Experience the magical Petra by Night show with thousands of candles illuminating the Treasury'
          },
          {
            time: '21:30',
            activity: 'Welcome Dinner',
            description: 'Traditional Jordanian dinner at a local restaurant'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '07:00',
            activity: 'Early Breakfast',
            description: 'Start your day with a hearty breakfast at the hotel'
          },
          {
            time: '08:00',
            activity: 'Petra Main Trail',
            description: 'Begin your journey through the Siq to the Treasury'
          },
          {
            time: '10:00',
            activity: 'Treasury Exploration',
            description: 'Detailed tour of the iconic Treasury with photo opportunities'
          },
          {
            time: '11:30',
            activity: 'Royal Tombs',
            description: 'Visit the Royal Tombs and learn about Nabataean architecture'
          },
          {
            time: '13:00',
            activity: 'Lunch Break',
            description: 'Lunch at Basin Restaurant inside Petra'
          },
          {
            time: '14:30',
            activity: 'Monastery Hike',
            description: 'Challenging but rewarding hike to the magnificent Monastery'
          },
          {
            time: '17:00',
            activity: 'High Place of Sacrifice',
            description: 'Visit this important religious site with panoramic views'
          },
          {
            time: '19:00',
            activity: 'Dinner & Culture',
            description: 'Traditional dinner and Bedouin music experience'
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            time: '08:00',
            activity: 'Breakfast',
            description: 'Morning breakfast at the hotel'
          },
          {
            time: '09:00',
            activity: 'Little Petra Visit',
            description: 'Explore Siq al-Barid (Little Petra) and its unique features'
          },
          {
            time: '11:00',
            activity: 'Bedouin Experience',
            description: 'Traditional cooking class and tea ceremony with local Bedouin family'
          },
          {
            time: '13:00',
            activity: 'Farewell Lunch',
            description: 'Final lunch with the group'
          },
          {
            time: '14:30',
            activity: 'Departure',
            description: 'Transfer to your next destination or airport'
          }
        ]
      }
    ],
    included: [
      'Professional English-speaking guide',
      '2 nights hotel accommodation',
      'Daily breakfast and selected meals',
      '2-day Petra entrance tickets',
      'Petra by Night show tickets',
      'Little Petra entrance fees',
      'All transfers in air-conditioned vehicle',
      'Bedouin cooking class',
      'Traditional music experience',
      'Water during tours',
      'Local taxes and service charges'
    ],
    notIncluded: [
      'International flights',
      'Jordan visa fees',
      'Travel insurance',
      'Personal expenses',
      'Tips for guide and driver',
      'Beverages during meals',
      'Optional activities not mentioned in the itinerary'
    ],
    meetingPoint: 'Wadi Musa Hotels',
    maxParticipants: 15
  },
  {
    id: 'petra-jordan-highlights',
    title: 'Petra & Jordan Highlights',
    description: 'Combine your Petra adventure with Jordan\'s other wonders. Float in the Dead Sea, explore Wadi Rum desert, and discover the ancient city of Jerash in this comprehensive tour.',
    duration: '7 days',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: ['Petra', 'Wadi Rum', 'Dead Sea', 'Jerash'],
    groupSize: {
      min: 4,
      max: 12
    },
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '15:00',
            activity: 'Arrival in Amman',
            description: 'Airport pickup and transfer to hotel'
          },
          {
            time: '19:00',
            activity: 'Welcome Meeting',
            description: 'Meet your guide and fellow travelers'
          },
          {
            time: '20:00',
            activity: 'Welcome Dinner',
            description: 'Traditional Jordanian feast in Amman'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '08:00',
            activity: 'Jerash Tour',
            description: 'Explore the remarkable Roman ruins of Jerash'
          },
          {
            time: '13:00',
            activity: 'Lunch in Jerash',
            description: 'Local lunch with Roman ruins view'
          },
          {
            time: '15:00',
            activity: 'Dead Sea Transfer',
            description: 'Scenic drive to the Dead Sea'
          },
          {
            time: '17:00',
            activity: 'Dead Sea Experience',
            description: 'Float in the mineral-rich waters and mud treatment'
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            time: '09:00',
            activity: 'Petra Transfer',
            description: 'Journey to the ancient city of Petra'
          },
          {
            time: '14:00',
            activity: 'Petra Introduction',
            description: 'First glimpse of the rose-red city'
          },
          {
            time: '19:00',
            activity: 'Petra by Night',
            description: 'Magical candlelit experience'
          }
        ]
      },
      {
        day: 4,
        activities: [
          {
            time: '07:00',
            activity: 'Full Petra Tour',
            description: 'Comprehensive guided tour of Petra\'s main sites'
          },
          {
            time: '13:00',
            activity: 'Lunch Break',
            description: 'Traditional lunch inside Petra'
          },
          {
            time: '14:30',
            activity: 'Monastery Hike',
            description: 'Trek to Petra\'s largest monument'
          }
        ]
      },
      {
        day: 5,
        activities: [
          {
            time: '08:00',
            activity: 'Wadi Rum Transfer',
            description: 'Journey to the desert wilderness'
          },
          {
            time: '10:00',
            activity: 'Jeep Safari',
            description: '4x4 desert exploration'
          },
          {
            time: '17:00',
            activity: 'Sunset Experience',
            description: 'Watch the sunset over the red dunes'
          },
          {
            time: '19:00',
            activity: 'Bedouin Camp',
            description: 'Dinner and overnight in luxury desert camp'
          }
        ]
      },
      {
        day: 6,
        activities: [
          {
            time: '05:30',
            activity: 'Desert Sunrise',
            description: 'Optional sunrise camel ride'
          },
          {
            time: '09:00',
            activity: 'Mount Nebo',
            description: 'Visit Moses\' viewpoint of the Promised Land'
          },
          {
            time: '14:00',
            activity: 'Madaba',
            description: 'See the ancient mosaic map of Jerusalem'
          },
          {
            time: '17:00',
            activity: 'Return to Amman',
            description: 'Final evening in the capital'
          }
        ]
      },
      {
        day: 7,
        activities: [
          {
            time: '09:00',
            activity: 'Amman City Tour',
            description: 'Visit the Citadel and Roman Theater'
          },
          {
            time: '13:00',
            activity: 'Farewell Lunch',
            description: 'Final group meal'
          },
          {
            time: '15:00',
            activity: 'Departure',
            description: 'Airport transfer for departure'
          }
        ]
      }
    ],
    included: [
      'All accommodations (6 nights)',
      'Professional English-speaking guide',
      'Private transportation',
      'Breakfast daily',
      'Selected lunches and dinners',
      'Entrance fees to all sites',
      'Petra 2-day pass',
      'Wadi Rum jeep safari',
      'Luxury desert camping',
      'Dead Sea resort access',
      'Airport transfers',
      'Local experiences and activities',
      'Water during tours'
    ],
    notIncluded: [
      'International flights',
      'Jordan visa fees',
      'Travel insurance',
      'Optional activities',
      'Personal expenses',
      'Tips for guide and driver',
      'Beverages during meals',
      'Camera fees at sites'
    ],
    meetingPoint: 'Amman Airport',
    maxParticipants: 12
  }
];

const PetraTripsSection: React.FC = () => {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const handleBook = (tripId: string) => {
    console.log('Booking trip:', tripId);
  };

  if (selectedTrip) {
    const trip = petraTrips.find(t => t.id === selectedTrip);
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
          maxParticipants={trip.maxParticipants}
          highlights={trip.highlights}
          included={trip.included}
          meetingPoint={trip.meetingPoint}
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
          <h2 className="text-lg sm:text-2xl font-bold dark:text-white">Petra Tours</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base">
          Discover the ancient wonders of Petra with our expertly curated tours
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {petraTrips.map(trip => (
          <TripCard
            key={trip.id}
            title={trip.title}
            description={trip.description}
            durationDays={parseInt(trip.duration)}
            price={trip.price}
            image={trip.image}
            maxParticipants={trip.maxParticipants}
            highlights={trip.highlights}
            onClick={() => setSelectedTrip(trip.id)}
            isBooked={false}
          />
        ))}
      </div>
    </div>
  );
};

export default PetraTripsSection;