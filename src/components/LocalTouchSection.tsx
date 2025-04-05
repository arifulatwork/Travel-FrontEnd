import React, { useState, useEffect } from 'react';
import { Users, Star, Clock, MapPin, Heart, Coffee, Music, Utensils, Palette, Search, X, Calendar, Info, Check, CreditCard, ChevronDown, Sun, Moon } from 'lucide-react';

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
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experiences from Laravel backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/experiences'); // Replace with your Laravel API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

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
    // Here you would integrate with your payment provider
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                  <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                      <div className="flex items-center justify-between">
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