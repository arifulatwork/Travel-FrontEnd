import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, Info, Sun, Moon, Tag, Percent, Hotel, Ticket, Gift, Check } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

interface ShortTripsSectionProps {
  maxPrice: number;
  selectedType: string | null;
  searchQuery: string;
}

const shortTrips = [
  {
    id: '1',
    title: 'Montserrat Day Trip',
    description: 'Visit the stunning Montserrat monastery and mountains',
    type: 'one-day',
    duration: '10 hours',
    price: 79,
    originalPrice: 99,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1586957469525-7850e7bef283?auto=format&fit=crop&w=800&q=80',
    startTime: '08:30',
    endTime: '18:30',
    highlights: [
      {
        time: '08:30',
        activity: 'Departure from Barcelona',
        description: 'Meet your guide at Plaça Catalunya and board our comfortable coach'
      },
      {
        time: '09:45',
        activity: 'Montserrat Monastery Arrival',
        description: 'Reach the monastery and enjoy breathtaking mountain views'
      },
      {
        time: '10:00',
        activity: 'Guided Monastery Tour',
        description: 'Explore the basilica and learn about its rich history'
      },
      {
        time: '11:30',
        activity: 'Boys Choir Performance',
        description: 'Listen to the famous L\'Escolania boys choir (except school holidays)'
      },
      {
        time: '12:30',
        activity: 'Local Market & Free Time',
        description: 'Sample local products and enjoy free time for lunch'
      },
      {
        time: '14:00',
        activity: 'Mountain Hiking',
        description: 'Guided walk through scenic mountain paths'
      },
      {
        time: '15:30',
        activity: 'Cable Car Experience',
        description: 'Spectacular ride offering panoramic views'
      },
      {
        time: '16:30',
        activity: 'Wine Tasting',
        description: 'Visit a local winery for tasting of regional wines'
      },
      {
        time: '17:30',
        activity: 'Return Journey',
        description: 'Relaxing drive back to Barcelona'
      },
      {
        time: '18:30',
        activity: 'Arrival in Barcelona',
        description: 'Tour ends at Plaça Catalunya'
      }
    ],
    included: ['Transportation', 'Guide', 'Cable car tickets', 'Wine tasting'],
    meetingPoint: 'Plaça Catalunya',
    maxParticipants: 20,
    specialOffer: {
      type: 'Early Bird',
      validUntil: '2024-03-31',
      description: 'Book now and save 20%'
    }
  },
  {
    id: '2',
    title: 'Costa Brava Weekend',
    description: 'Explore the beautiful Costa Brava coastline',
    type: 'weekend',
    duration: '2 days',
    price: 199,
    originalPrice: 249,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1563784462386-044fd5197852?auto=format&fit=crop&w=800&q=80',
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '09:00',
            activity: 'Departure from Barcelona',
            description: 'Start your journey to Costa Brava'
          },
          {
            time: '10:30',
            activity: 'Tossa de Mar Visit',
            description: 'Explore the medieval walled town and lighthouse'
          },
          {
            time: '12:30',
            activity: 'Coastal Walk',
            description: 'Guided walk along the scenic Camí de Ronda'
          },
          {
            time: '14:00',
            activity: 'Seafood Lunch',
            description: 'Traditional Catalan lunch at a beachfront restaurant'
          },
          {
            time: '16:00',
            activity: 'Beach Time & Snorkeling',
            description: 'Free time for swimming and snorkeling'
          },
          {
            time: '19:00',
            activity: 'Hotel Check-in',
            description: 'Arrive at your boutique hotel in Calella de Palafrugell'
          },
          {
            time: '20:30',
            activity: 'Welcome Dinner',
            description: 'Group dinner featuring local specialties'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '09:00',
            activity: 'Breakfast',
            description: 'Buffet breakfast at the hotel'
          },
          {
            time: '10:00',
            activity: 'Kayaking Tour',
            description: 'Guided kayaking along the rocky coastline'
          },
          {
            time: '13:00',
            activity: 'Picnic Lunch',
            description: 'Beach picnic with local products'
          },
          {
            time: '14:30',
            activity: 'Medieval Villages',
            description: 'Visit Pals and Peratallada'
          },
          {
            time: '17:00',
            activity: 'Return Journey',
            description: 'Scenic drive back to Barcelona'
          },
          {
            time: '18:30',
            activity: 'Tour End',
            description: 'Arrival in Barcelona city center'
          }
        ]
      }
    ],
    included: ['Hotel', 'Breakfast', 'Transportation', 'Activities'],
    maxParticipants: 15,
    specialOffer: {
      type: 'Package Deal',
      validUntil: '2024-04-15',
      description: 'Hotel + Activities package with 20% off'
    }
  },
  {
    id: '3',
    title: 'Sunset Sailing',
    description: 'Afternoon sailing trip along the Barcelona coast',
    type: 'afternoon',
    duration: '4 hours',
    price: 65,
    originalPrice: 85,
    discountPercentage: 24,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    startTime: '16:00',
    endTime: '20:00',
    highlights: [
      {
        time: '16:00',
        activity: 'Check-in at Port Vell',
        description: 'Meet your crew and safety briefing'
      },
      {
        time: '16:30',
        activity: 'Set Sail',
        description: 'Learn basic sailing techniques as we leave the harbor'
      },
      {
        time: '17:00',
        activity: 'Barcelona Skyline',
        description: 'Sail past the city\'s iconic waterfront'
      },
      {
        time: '17:30',
        activity: 'Swimming Stop',
        description: 'Anchor in a quiet cove for swimming'
      },
      {
        time: '18:15',
        activity: 'Appetizers & Drinks',
        description: 'Enjoy Mediterranean snacks and cava'
      },
      {
        time: '18:45',
        activity: 'Sunset Sailing',
        description: 'Capture perfect photos of the golden hour'
      },
      {
        time: '19:30',
        activity: 'Return Sail',
        description: 'Relaxing journey back to port'
      },
      {
        time: '20:00',
        activity: 'Tour End',
        description: 'Arrive back at Port Vell'
      }
    ],
    included: ['Sailing', 'Snacks', 'Drinks', 'Swimming gear'],
    meetingPoint: 'Port Vell',
    maxParticipants: 12,
    specialOffer: {
      type: 'Last Minute',
      validUntil: '2024-03-20',
      description: 'Save 24% on afternoon sailing adventures'
    }
  },
  {
    id: '4',
    title: 'Girona & Figueres Tour',
    description: 'Two-day exploration of Dalí\'s museum and medieval Girona',
    type: 'two-day',
    duration: '2 days',
    price: 249,
    originalPrice: 299,
    discountPercentage: 17,
    image: 'https://images.unsplash.com/photo-1599484233778-5e1a27d3ddf8?auto=format&fit=crop&w=800&q=80',
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '08:30',
            activity: 'Departure to Figueres',
            description: 'Morning departure from Barcelona'
          },
          {
            time: '10:00',
            activity: 'Dalí Theatre-Museum',
            description: 'Guided tour of the surrealist museum'
          },
          {
            time: '12:30',
            activity: 'Lunch Break',
            description: 'Traditional Catalan lunch in Figueres'
          },
          {
            time: '14:00',
            activity: 'Dalí Jewels',
            description: 'Visit the unique jewelry collection'
          },
          {
            time: '15:30',
            activity: 'Transfer to Girona',
            description: 'Scenic drive to medieval Girona'
          },
          {
            time: '16:30',
            activity: 'Hotel Check-in',
            description: 'Rest and refresh at your hotel'
          },
          {
            time: '18:00',
            activity: 'Evening Walking Tour',
            description: 'Explore Girona\'s illuminated old town'
          },
          {
            time: '20:00',
            activity: 'Group Dinner',
            description: 'Dinner at a local restaurant'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '09:00',
            activity: 'Breakfast',
            description: 'Hotel breakfast'
          },
          {
            time: '10:00',
            activity: 'Jewish Quarter',
            description: 'Tour of the historic Call Jueu'
          },
          {
            time: '11:30',
            activity: 'Cathedral Visit',
            description: 'Explore the impressive Gothic cathedral'
          },
          {
            time: '13:00',
            activity: 'Game of Thrones Sites',
            description: 'Visit filming locations from the series'
          },
          {
            time: '14:30',
            activity: 'Free Time & Lunch',
            description: 'Explore and dine independently'
          },
          {
            time: '16:00',
            activity: 'City Walls Walk',
            description: 'Walk the medieval fortifications'
          },
          {
            time: '17:30',
            activity: 'Return Journey',
            description: 'Drive back to Barcelona'
          },
          {
            time: '19:00',
            activity: 'Tour End',
            description: 'Arrival in Barcelona'
          }
        ]
      }
    ],
    included: ['Hotel', 'Breakfast', 'Transportation', 'Museum entries'],
    maxParticipants: 18,
    specialOffer: {
      type: 'Spring Special',
      validUntil: '2024-05-31',
      description: 'Spring cultural package with 17% discount'
    }
  },
  {
    id: '5',
    title: 'Pyrenees Adventure',
    description: 'Three-day mountain exploration with hiking and village visits',
    type: 'three-day',
    duration: '3 days',
    price: 349,
    originalPrice: 399,
    discountPercentage: 13,
    image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?auto=format&fit=crop&w=800&q=80',
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '08:00',
            activity: 'Barcelona Departure',
            description: 'Journey to the Pyrenees mountains'
          },
          {
            time: '10:30',
            activity: 'Vall de Núria',
            description: 'Scenic rack railway journey to the valley'
          },
          {
            time: '12:00',
            activity: 'Mountain Hiking',
            description: 'Guided hike with panoramic views'
          },
          {
            time: '14:00',
            activity: 'Mountain Lunch',
            description: 'Traditional lunch at mountain restaurant'
          },
          {
            time: '16:00',
            activity: 'Nature Workshop',
            description: 'Learn about local flora and fauna'
          },
          {
            time: '18:00',
            activity: 'Hotel Check-in',
            description: 'Evening at mountain lodge'
          },
          {
            time: '20:00',
            activity: 'Welcome Dinner',
            description: 'Traditional Pyrenean cuisine'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '08:00',
            activity: 'Breakfast',
            description: 'Mountain lodge breakfast'
          },
          {
            time: '09:30',
            activity: 'Advanced Hiking',
            description: 'Full-day trek to mountain peaks'
          },
          {
            time: '13:00',
            activity: 'Picnic Lunch',
            description: 'Scenic lunch in nature'
          },
          {
            time: '15:00',
            activity: 'Alpine Lakes',
            description: 'Visit crystal-clear mountain lakes'
          },
          {
            time: '17:00',
            activity: 'Village Visit',
            description: 'Explore traditional mountain village'
          },
          {
            time: '19:00',
            activity: 'Spa Time',
            description: 'Relax in thermal waters'
          },
          {
            time: '20:30',
            activity: 'Group Dinner',
            description: 'Local specialties and wine'
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            time: '08:30',
            activity: 'Breakfast',
            description: 'Final mountain breakfast'
          },
          {
            time: '10:00',
            activity: 'Medieval Towns',
            description: 'Visit historic Pyrenean towns'
          },
          {
            time: '12:00',
            activity: 'Artisan Workshop',
            description: 'Traditional crafts demonstration'
          },
          {
            time: '14:00',
            activity: 'Farewell Lunch',
            description: 'Last meal in the mountains'
          },
          {
            time: '15:30',
            activity: 'Return Journey',
            description: 'Scenic drive back to Barcelona'
          },
          {
            time: '18:00',
            activity: 'Tour End',
            description: 'Arrival in Barcelona'
          }
        ]
      }
    ],
    included: [
      'Mountain lodge accommodation',
      'All meals',
      'Professional guide',
      'Transportation',
      'Rack railway tickets',
      'Spa access',
      'Workshop materials'
    ],
    maxParticipants: 12,
    specialOffer: {
      type: 'Mountain Escape',
      validUntil: '2024-06-30',
      description: 'Spring mountain adventure with 13% off'
    }
  },
  {
    id: '6',
    title: 'Mediterranean Island Hopping',
    description: 'Four-day exploration of the Spanish Mediterranean islands',
    type: 'four-day',
    duration: '4 days',
    price: 599,
    originalPrice: 699,
    discountPercentage: 14,
    image: 'https://images.unsplash.com/photo-1582120031356-f2e94aa4d1d7?auto=format&fit=crop&w=800&q=80',
    highlights: [
      {
        day: 1,
        activities: [
          {
            time: '07:00',
            activity: 'Barcelona Port',
            description: 'Morning ferry departure'
          },
          {
            time: '10:30',
            activity: 'Mallorca Arrival',
            description: 'Reach Palma de Mallorca'
          },
          {
            time: '12:00',
            activity: 'City Tour',
            description: 'Explore Palma\'s historic center'
          },
          {
            time: '14:00',
            activity: 'Local Lunch',
            description: 'Traditional Mallorcan cuisine'
          },
          {
            time: '16:00',
            activity: 'Beach Time',
            description: 'Relax at Playa de Palma'
          },
          {
            time: '19:00',
            activity: 'Hotel Check-in',
            description: 'Evening in Palma'
          },
          {
            time: '20:30',
            activity: 'Welcome Dinner',
            description: 'Seafood dinner by the marina'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            time: '08:00',
            activity: 'Breakfast',
            description: 'Hotel breakfast'
          },
          {
            time: '09:30',
            activity: 'Mountain Train',
            description: 'Scenic railway to Sóller'
          },
          {
            time: '11:00',
            activity: 'Orange Groves',
            description: 'Visit traditional orchards'
          },
          {
            time: '13:00',
            activity: 'Village Lunch',
            description: 'Lunch in Sóller'
          },
          {
            time: '15:00',
            activity: 'Tram to Port',
            description: 'Historic tram ride'
          },
          {
            time: '16:30',
            activity: 'Boat Tour',
            description: 'Coastal caves exploration'
          },
          {
            time: '19:00',
            activity: 'Return to Palma',
            description: 'Evening at leisure'
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            time: '08:30',
            activity: 'Ferry to Menorca',
            description: 'Island transfer'
          },
          {
            time: '11:00',
            activity: 'Ciutadella',
            description: 'Explore historic town'
          },
          {
            time: '13:30',
            activity: 'Beach Picnic',
            description: 'Lunch at Cala Galdana'
          },
          {
            time: '15:00',
            activity: 'Kayaking',
            description: 'Coastal exploration'
          },
          {
            time: '17:30',
            activity: 'Prehistoric Sites',
            description: 'Visit ancient monuments'
          },
          {
            time: '20:00',
            activity: 'Group Dinner',
            description: 'Traditional Menorcan feast'
          }
        ]
      },
      {
        day: 4,
        activities: [
          {
            time: '09:00',
            activity: 'Breakfast',
            description: 'Hotel breakfast'
          },
          {
            time: '10:30',
            activity: 'Monte Toro',
            description: 'Island\'s highest point'
          },
          {
            time: '12:00',
            activity: 'Cheese Farm',
            description: 'Traditional cheese making'
          },
          {
            time: '14:00',
            activity: 'Farewell Lunch',
            description: 'Final island meal'
          },
          {
            time: '16:00',
            activity: 'Return Ferry',
            description: 'Journey to Barcelona'
          },
          {
            time: '19:30',
            activity: 'Tour End',
            description: 'Arrival in Barcelona'
          }
        ]
      }
    ],
    included: [
      'Ferry transportation',
      'Hotel accommodations',
      'Breakfast daily',
      'Selected meals',
      'Local guides',
      'Activity equipment',
      'Entrance fees',
      'Train and tram tickets'
    ],
    maxParticipants: 14,
    specialOffer: {
      type: 'Island Adventure',
      validUntil: '2024-07-31',
      description: 'Early summer island hopping special with 14% off'
    }
  }
];

// Special accommodation offers
const accommodationOffers = [
  {
    id: 'hotel1',
    name: 'Hotel Arts Barcelona',
    type: 'Luxury Hotel',
    discount: 25,
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-04-30',
    description: 'Luxury beachfront hotel with stunning views',
    perks: ['Spa access', 'Breakfast included', 'Late checkout']
  },
  {
    id: 'hotel2',
    name: 'Casa Camper',
    type: 'Boutique Hotel',
    discount: 20,
    price: 189,
    originalPrice: 239,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-05-15',
    description: 'Unique boutique hotel in the heart of the city',
    perks: ['24/7 snack lounge', 'Bike rental', 'Welcome drink']
  }
];

const ShortTripsSection: React.FC<ShortTripsSectionProps> = ({ maxPrice, selectedType, searchQuery }) => {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [showAccommodationOffers, setShowAccommodationOffers] = useState(false);

  const handleBook = (tripId: string) => {
    console.log('Booking trip:', tripId);
  };

  const filteredTrips = shortTrips
    .filter(trip => !selectedType || trip.type === selectedType)
    .filter(trip => trip.price <= maxPrice)
    .filter(trip => 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (selectedTrip) {
    const trip = shortTrips.find(t => t.id === selectedTrip);
    if (!trip) return null;

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails {...trip} onBook={() => handleBook(trip.id)} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {/* Special Offers Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Gift className="h-6 w-6" />
              Special Offers & Discounts
            </h3>
            <p className="text-white/90">Limited time deals on trips and accommodations</p>
          </div>
          <button
            onClick={() => setShowAccommodationOffers(!showAccommodationOffers)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Hotel className="h-5 w-5" />
            View Hotel Deals
          </button>
        </div>
      </div>

      {/* Accommodation Offers */}
      {showAccommodationOffers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodationOffers.map(offer => (
            <div key={offer.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-48">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  {offer.discount}% OFF
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{offer.name}</h3>
                    <p className="text-gray-600 text-sm">{offer.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">€{offer.price}</p>
                    <p className="text-sm text-gray-500 line-through">€{offer.originalPrice}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {offer.perks.map((perk, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {perk}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="relative">
            {trip.specialOffer && (
              <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {trip.discountPercentage}% OFF
              </div>
            )}
            <TripCard
              {...trip}
              onClick={() => setSelectedTrip(trip.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortTripsSection;