import React, { useState } from 'react';
import { Users, Star, Clock, MapPin, Heart, Coffee, Music, Utensils, Palette, Search, X, Calendar, Info, Check, CreditCard, ChevronDown, Sun, Moon, Award, Leaf, Wine, Sparkles } from 'lucide-react';

interface Experience {
  id: string;
  type: 'food' | 'music' | 'craft';
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  duration: string;
  maxParticipants: number;
  image: string;
  city: string;
  host: {
    name: string;
    rating: number;
    reviews: number;
    image?: string;
  };
  highlights?: string[]; // Added highlights array
  whyChoose?: { // Added structured why choose reasons
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

interface BookingDetails {
  date: string;
  time: string;
  participants: number;
  specialRequests: string;
}

const LocalTouchSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'food' | 'music' | 'craft' | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    time: '',
    participants: 1,
    specialRequests: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const experiences: Experience[] = [
    // Existing Barcelona Experiences
    {
      id: 'paella-cooking',
      type: 'food',
      name: 'Traditional Paella Cooking Class',
      description: 'Learn to cook authentic Valencian paella with a local chef',
      price: 65,
      rating: 4.9,
      reviews: 128,
      location: 'Gothic Quarter',
      city: 'Barcelona',
      duration: '3 hours',
      maxParticipants: 8,
      image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Chef Maria',
        rating: 4.9,
        reviews: 245,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
      },
      highlights: [
        'Authentic family recipe passed down for generations',
        'Fresh ingredients from La Boqueria market',
        'Enjoy your creation with local wines'
      ],
      whyChoose: [
        {
          icon: <Award className="h-5 w-5 text-purple-600" />,
          title: "Award-Winning Chef",
          description: "Learn from a chef featured in Spain's top culinary magazines"
        },
        {
          icon: <Leaf className="h-5 w-5 text-purple-600" />,
          title: "Farm-to-Table",
          description: "Ingredients sourced directly from local producers"
        },
        {
          icon: <Wine className="h-5 w-5 text-purple-600" />,
          title: "Wine Pairing",
          description: "Includes tasting of 3 regional wines with your meal"
        }
      ]
    },
    // Italian Experiences - Rome
    {
      id: 'rome-pasta-making',
      type: 'food',
      name: 'Traditional Pasta Making Class',
      description: 'Learn the secrets of homemade pasta from a Roman nonna in her Trastevere kitchen. Includes wine pairing.',
      price: 70,
      rating: 4.9,
      reviews: 245,
      location: 'Trastevere',
      city: 'Rome',
      duration: '3 hours',
      maxParticipants: 8,
      image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Nonna Maria',
        rating: 5.0,
        reviews: 189
      },
      highlights: [
        'Hands-on pasta making with traditional tools',
        'Secret family recipes from rural Lazio',
        'Dine on your creations with local wines'
      ],
      whyChoose: [
        {
          icon: <Sparkles className="h-5 w-5 text-purple-600" />,
          title: "Generational Wisdom",
          description: "Learn techniques perfected over 60 years of pasta making"
        },
        {
          icon: <Utensils className="h-5 w-5 text-purple-600" />,
          title: "Authentic Setting",
          description: "Cook in a real Roman home kitchen in historic Trastevere"
        },
        {
          icon: <Wine className="h-5 w-5 text-purple-600" />,
          title: "Complete Experience",
          description: "Includes antipasti, two pasta types, dessert and wine"
        }
      ]
    },
    // German Experiences - Berlin
    {
      id: 'berlin-street-art',
      type: 'craft',
      name: 'Berlin Street Art Workshop',
      description: 'Create urban art with local street artists in Kreuzberg',
      price: 45,
      rating: 4.8,
      reviews: 92,
      location: 'Kreuzberg',
      city: 'Berlin',
      duration: '3 hours',
      maxParticipants: 10,
      image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Max Weber',
        rating: 4.8,
        reviews: 156
      },
      highlights: [
        'Legal walls with iconic Berlin graffiti history',
        'All materials provided - no experience needed',
        'Take home your own urban artwork'
      ],
      whyChoose: [
        {
          icon: <Palette className="h-5 w-5 text-purple-600" />,
          title: "Local Experts",
          description: "Learn from artists who've worked with Berlin's top collectives"
        },
        {
          icon: <MapPin className="h-5 w-5 text-purple-600" />,
          title: "Iconic Location",
          description: "Create art where Berlin's street art movement began"
        },
        {
          icon: <Award className="h-5 w-5 text-purple-600" />,
          title: "Unique Souvenir",
          description: "Leave with artwork you created and photos of the process"
        }
      ]
    },
    // Croatian Experiences - Split
    {
      id: 'dalmatian-cooking',
      type: 'food',
      name: 'Dalmatian Cooking Experience',
      description: 'Learn traditional Dalmatian recipes in a family home overlooking the Adriatic',
      price: 75,
      rating: 4.9,
      reviews: 84,
      location: 'Old Town',
      city: 'Split',
      duration: '4 hours',
      maxParticipants: 6,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Ana Kovač',
        rating: 4.9,
        reviews: 134
      },
      highlights: [
        'Seaside cooking with panoramic views',
        'Authentic peka cooking technique',
        'Includes homemade rakija tasting'
      ],
      whyChoose: [
        {
          icon: <Sun className="h-5 w-5 text-purple-600" />,
          title: "Breathtaking Setting",
          description: "Cook with Adriatic Sea views from a terrace vineyard"
        },
        {
          icon: <Leaf className="h-5 w-5 text-purple-600" />,
          title: "Hyper-Local",
          description: "Ingredients from host's garden and local fishermen"
        },
        {
          icon: <Wine className="h-5 w-5 text-purple-600" />,
          title: "Cultural Immersion",
          description: "Learn about Dalmatian traditions beyond just cooking"
        }
      ]
    },
    // Additional German Experience - Munich
    {
      id: 'munich-beer-crafting',
      type: 'craft',
      name: 'Bavarian Beer Crafting',
      description: 'Learn traditional German beer brewing techniques from a master brewer',
      price: 80,
      rating: 4.8,
      reviews: 167,
      location: 'Altstadt',
      city: 'Munich',
      duration: '4 hours',
      maxParticipants: 8,
      image: 'https://images.unsplash.com/photo-1505075106905-fb052892c116?auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Hans Schmidt',
        rating: 4.9,
        reviews: 203
      },
      highlights: [
        'Hands-on brewing with traditional equipment',
        'Taste rare Bavarian beer varieties',
        'Certificate of completion'
      ],
      whyChoose: [
        {
          icon: <Award className="h-5 w-5 text-purple-600" />,
          title: "Master Brewer",
          description: "Learn from a 4th generation brewing family"
        },
        {
          icon: <Sparkles className="h-5 w-5 text-purple-600" />,
          title: "Exclusive Access",
          description: "Visit a brewery normally closed to the public"
        },
        {
          icon: <Utensils className="h-5 w-5 text-purple-600" />,
          title: "Complete Package",
          description: "Includes tasting flight and brewing handbook"
        }
      ]
    }
  ];

  const cities = Array.from(new Set(experiences.map(exp => exp.city)));

  const filteredExperiences = experiences.filter(exp => 
    (!selectedType || exp.type === selectedType) &&
    (!selectedCity || exp.city === selectedCity)
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      experience: selectedExperience,
      ...bookingDetails
    });
    setBookingConfirmed(true);
    setShowPaymentButton(true);
  };

  const handlePayment = () => {
    console.log('Processing payment...');
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingConfirmed(false);
      setSelectedExperience(null);
      setShowPaymentButton(false);
      setBookingDetails({
        date: '',
        time: '',
        participants: 1,
        specialRequests: ''
      });
    }, 2000);
  };

  const renderWhyChoose = (experience: Experience) => (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 className="font-medium text-sm flex items-center gap-2 text-purple-600 mb-3">
        <Info className="h-4 w-4" />
        Why choose this experience?
      </h4>
      <div className="space-y-3">
        {experience.whyChoose?.map((reason, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              {reason.icon}
            </div>
            <div>
              <h5 className="font-medium text-sm dark:text-white">{reason.title}</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHighlights = (experience: Experience) => (
    <div className="mt-3">
      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Experience highlights:</h4>
      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {experience.highlights?.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* City Filter */}
        <div className="relative">
          <select
            value={selectedCity || ''}
            onChange={(e) => setSelectedCity(e.target.value || null)}
            className="appearance-none bg-white dark:bg-gray-800 dark:text-white pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
        </div>

        {/* Category Filters */}
        <button
          onClick={() => setSelectedType(selectedType === 'food' ? null : 'food')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'food'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Utensils className="h-4 w-4" />
          Food
        </button>
        <button
          onClick={() => setSelectedType(selectedType === 'music' ? null : 'music')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'music'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Music className="h-4 w-4" />
          Music
        </button>
        <button
          onClick={() => setSelectedType(selectedType === 'craft' ? null : 'craft')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'craft'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Palette className="h-4 w-4" />
          Craft
        </button>
      </div>

      {/* City Sections */}
      <div className="space-y-8">
        {(selectedCity ? [selectedCity] : cities).map(city => (
          <div key={city} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
              <MapPin className="h-6 w-6 text-purple-600" />
              {city}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences
                .filter(exp => exp.city === city)
                .map(experience => (
                  <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={experience.image}
                        alt={experience.name}
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
                        {experience.type === 'food' && <Utensils className="h-4 w-4" />}
                        {experience.type === 'music' && <Music className="h-4 w-4" />}
                        {experience.type === 'craft' && <Palette className="h-4 w-4" />}
                        <span className="capitalize">{experience.type}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 dark:text-white">{experience.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{experience.description}</p>
                      
                      {renderHighlights(experience)}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 mt-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {experience.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Up to {experience.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        {experience.rating} ({experience.reviews})
                      </div>
                    </div>
                      
                      {renderWhyChoose(experience)}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-lg font-semibold dark:text-white">€{experience.price}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedExperience(experience);
                            setShowBookingModal(true);
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedExperience && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Book Experience</h3>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingConfirmed(false);
                  setSelectedExperience(null);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your experience has been successfully booked. Please proceed with payment to secure your spot.
                </p>
                {showPaymentButton && (
                  <button
                    onClick={handlePayment}
                    className="flex items-center justify-center w-full gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    Pay Now €{selectedExperience.price * bookingDetails.participants}
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={bookingDetails.time}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedExperience.maxParticipants}
                    value={bookingDetails.participants}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, participants: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:text-white"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Maximum {selectedExperience.maxParticipants} participants
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:text-white"
                    placeholder="Any dietary restrictions, accessibility needs, etc."
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-white">Total Price</span>
                    <span className="text-lg font-bold dark:text-white">
                      €{selectedExperience.price * bookingDetails.participants}
                    </span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    €{selectedExperience.price} × {bookingDetails.participants} participants
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalTouchSection;