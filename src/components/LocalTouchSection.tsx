import React, { useState, useEffect } from 'react';
import { Users, Star, Clock, MapPin, Heart, Music, Utensils, Palette, X, Info, Check, CreditCard, ChevronDown, Sun, Moon, Award, Leaf, Wine, Sparkles } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface Experience {
  id: number;
  type: 'food' | 'music' | 'craft';
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  duration: string;
  max_participants: number;
  image: string;
  city: string;
  host: {
    name: string;
    rating: number;
    reviews: number;
    image: string | null;
  };
  highlights: string[];
  why_choose: {
    icon: string;
    title: string;
    description: string;
  }[];
  user_has_booking?: boolean; // ✅ Added new field
}

interface BookingDetails {
  date: string;
  time: string;
  participants: number;
  specialRequests: string;
}

const LocalTouchSection: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  
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
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:8000/api/auth/localtouch/experiences', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        
        const processedData = data.map((exp: any) => {
          const host = typeof exp.host === 'string' ? JSON.parse(exp.host) : exp.host;
          const highlights = typeof exp.highlights === 'string' ? JSON.parse(exp.highlights) : exp.highlights;
          const why_choose = typeof exp.why_choose === 'string' ? JSON.parse(exp.why_choose) : exp.why_choose;
          
          return {
            ...exp,
            price: parseFloat(exp.price),
            host: {
              ...host,
              rating: typeof host.rating === 'string' ? parseFloat(host.rating) : host.rating,
              reviews: typeof host.reviews === 'string' ? parseInt(host.reviews) : host.reviews
            },
            highlights,
            why_choose,
            user_has_booking: exp.user_has_booking || false // ✅ Added processing for new field
          };
        });
        
        setExperiences(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Get unique cities from experiences
  const cities = Array.from(new Set(experiences.map(exp => exp.city)));

  // Filter experiences based on selected filters
  const filteredExperiences = experiences.filter(exp => 
    (!selectedType || exp.type === selectedType) &&
    (!selectedCity || exp.city === selectedCity)
  );

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExperience) return;

    try {
      const res = await fetch('http://localhost:8000/api/auth/localtouch/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          experience_id: selectedExperience.id,
          ...bookingDetails,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setClientSecret(data.client_secret);
        setBookingConfirmed(true);
        setShowPaymentButton(true);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      alert('Failed to book. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('✅ Payment successful!');
      // Reset UI
      setShowBookingModal(false);
      setBookingConfirmed(false);
      setSelectedExperience(null);
      setShowPaymentButton(false);
      setClientSecret(null);
      setBookingDetails({
        date: '',
        time: '',
        participants: 1,
        specialRequests: ''
      });
      // Refresh experiences to update booking status
      window.location.reload();
    }
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Award,
      Leaf,
      Wine,
      Sparkles,
      Utensils,
      Music,
      Palette,
      Sun,
      Moon
    };
    
    const Icon = iconMap[iconName] || Info;
    return <Icon className="h-5 w-5 text-purple-600" />;
  };

  const renderWhyChoose = (experience: Experience) => (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 className="font-medium text-sm flex items-center gap-2 text-purple-600 mb-3">
        <Info className="h-4 w-4" />
        Why choose this experience?
      </h4>
      <div className="space-y-3">
        {experience.why_choose?.map((reason, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              {getIconComponent(reason.icon)}
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

  if (loading) {
    return <div className="text-center py-8">Loading experiences...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

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
                        src={experience.image.startsWith('http') ? experience.image : `http://localhost:8000/${experience.image}`}
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
                            Up to {experience.max_participants}
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
                          <p className="text-lg font-semibold dark:text-white">€{experience.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
                        </div>
                        {experience.user_has_booking ? (
                          <button
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                            disabled
                          >
                            View Details
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedExperience(experience);
                              setShowBookingModal(true);
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Book Now
                          </button>
                        )}
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
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your experience has been successfully booked. Please proceed with payment to secure your spot.
                </p>
                
                {showPaymentButton && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                      <CardElement options={{ 
                        style: { 
                          base: { 
                            fontSize: '16px', 
                            color: '#333',
                            '::placeholder': {
                              color: '#a0aec0',
                            },
                          },
                        } 
                      }} />
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={!stripe}
                      className="flex items-center justify-center w-full gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      <CreditCard className="h-5 w-5" />
                      Pay Now €{(selectedExperience.price * bookingDetails.participants).toFixed(2)}
                    </button>
                  </div>
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
                    max={selectedExperience.max_participants}
                    value={bookingDetails.participants}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, participants: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:text-white"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Maximum {selectedExperience.max_participants} participants
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
                      €{(selectedExperience.price * bookingDetails.participants).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    €{selectedExperience.price.toFixed(2)} × {bookingDetails.participants} participants
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