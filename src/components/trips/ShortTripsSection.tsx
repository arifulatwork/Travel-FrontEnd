import React, { useState, useEffect } from 'react';
import { 
  Info, Bot as Lotus, Music, Trees as Tree, Smile as Family, 
  Factory, Dog, Home, Landmark, Heart, Music as Dance 
} from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

interface ShortTripsSectionProps {
  maxPrice: number;
  selectedType: string | null;
  searchQuery: string;
}

interface Trip {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  discount_percentage: number;
  image_url: string;
  duration_days: number;
  max_participants: number | null;
  highlights: { item: string }[];
  learning_outcomes?: { item: string }[];
  personal_development?: { item: string }[];
  certifications?: { item: string }[];
  environmental_impact?: { item: string }[];
  community_benefits?: { item: string }[];
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  lotus: Lotus,
  music: Music,
  tree: Tree,
  family: Family,
  factory: Factory,
  dog: Dog,
  home: Home,
  landmark: Landmark,
  heart: Heart,
  dance: Dance
};

const BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_PATH = 'storage';

const ShortTripsSection: React.FC<ShortTripsSectionProps> = ({ 
  maxPrice, 
  selectedType, 
  searchQuery 
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentBookingSlug, setCurrentBookingSlug] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookedSlugs, setBookedSlugs] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const checkAndFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!res.ok) throw new Error('Auth failed');
        setIsAuthenticated(true);

        await fetchData();
        await fetchBookedTrips();
      } catch (err) {
        setIsAuthenticated(false);
        console.error('❌ Auth error:', err);
      }
    };

    checkAndFetch();
  }, []);

  const fetchBookedTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/auth/trip/booked`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch booked trips');
      const data = await res.json();
      setBookedSlugs(data);
    } catch (error) {
      console.error('Error fetching booked trips:', error);
    }
  };

  const handleViewDetails = async (tripSlug: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/trip/${tripSlug}/booking-details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to load booking details');

      const data = await res.json();
      setBookingDetails(data);
      setShowBookingModal(true);
    } catch (err) {
      alert('Could not fetch booking details.');
      console.error(err);
    }
  };

  const processImageUrl = (url: string): string => {
    if (!url) return '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('trip-images/')) {
      return `${BASE_URL}/${STORAGE_PATH}/${url}`;
    }
    
    if (url.startsWith('storage/trip-images/')) {
      return `${BASE_URL}/${url}`;
    }
    
    if (url.startsWith('storage/')) {
      return `${BASE_URL}/${url}`;
    }
    
    return `${BASE_URL}/${STORAGE_PATH}/trip-images/${url}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tripsResponse = await fetch(`${BASE_URL}/api/trips`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (!tripsResponse.ok) throw new Error('Failed to fetch trips');
      const tripsData = await tripsResponse.json();
      
      const processedTrips = tripsData.data.map((trip: Trip) => ({
        ...trip,
        image_url: processImageUrl(trip.image_url)
      }));
      
      setTrips(processedTrips || []);

      const categoriesResponse = await fetch(`${BASE_URL}/api/trip-categories`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });
      
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateBooking = (tripSlug: string) => {
    setCurrentBookingSlug(tripSlug);
    setShowPaymentForm(true);
  };

  const handleBook = async () => {
    if (!currentBookingSlug) return;
    if (!stripe || !elements) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to book trips');
      return;
    }

    setPaymentProcessing(true);

    try {
      // 1. Book the trip (create booking)
      const bookingRes = await fetch(`${BASE_URL}/api/auth/trip/${currentBookingSlug}/book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ participants: 1 })
      });

      if (!bookingRes.ok) throw new Error('Booking failed');
      const bookingData = await bookingRes.json();
      const bookingId = bookingData.booking_id;

      // 2. Create Stripe Payment Intent
      const paymentRes = await fetch(`${BASE_URL}/api/auth/trip/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ booking_id: bookingId })
      });

      if (!paymentRes.ok) throw new Error('Payment intent failed');
      const paymentData = await paymentRes.json();
      const clientSecret = paymentData.clientSecret;

      // 3. Use Stripe to confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (result.error) {
        console.error(result.error.message);
        alert('Payment failed: ' + result.error.message);
        return;
      }

      // 4. Notify backend about success
      const confirmRes = await fetch(`${BASE_URL}/api/auth/trip/payment/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          payment_intent_id: result.paymentIntent?.id
        })
      });

      if (!confirmRes.ok) throw new Error('Payment confirmation failed');

      // Update booked trips list
      setBookedSlugs(prev => [...prev, currentBookingSlug]);
      alert('✅ Trip booked and payment successful!');
      setShowPaymentForm(false);
      setCurrentBookingSlug(null);
      // Refresh trips data
      fetchData();
    } catch (err) {
      console.error('Booking/payment error:', err);
      alert('❌ Booking or payment failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setPaymentProcessing(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (!trip.category) return false;
    
    const matchesCategory = !activeCategory || trip.category.slug === activeCategory;
    const matchesPrice = parseFloat(trip.price) <= maxPrice;
    const matchesSearch = searchQuery === '' || 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  if (isAuthenticated === false) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <Info className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Authentication Required</h3>
        <p className="text-red-600">Please log in to view trips</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <Info className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error loading trips</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (selectedTrip) {
    const trip = trips.find(t => t.slug === selectedTrip);
    if (!trip) return null;

    const isBooked = bookedSlugs.includes(trip.slug);

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails 
          title={trip.title}
          description={trip.description}
          duration={trip.duration_days}
          price={parseFloat(trip.price)}
          originalPrice={parseFloat(trip.original_price)}
          image={trip.image_url}
          highlights={trip.highlights}
          included={[]}
          maxParticipants={trip.max_participants || 0}
          learningOutcomes={trip.learning_outcomes || []}
          personalDevelopment={trip.personal_development || []}
          certifications={trip.certifications || []}
          environmentalImpact={trip.environmental_impact || []}
          communityBenefits={trip.community_benefits || []}
          onBook={() => !isBooked && handleInitiateBooking(trip.slug)}
          isBooked={isBooked}
          onViewDetails={() => handleViewDetails(trip.slug)}
        />

        {/* Payment Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Complete Your Booking</h3>
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-600">Payment Card</label>
                <div className="border rounded p-2 bg-white">
                  <CardElement options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                  disabled={!stripe || paymentProcessing}
                >
                  {paymentProcessing ? 'Processing...' : 'Pay & Book'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showBookingModal && bookingDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-purple-700">Your Booking Details</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Trip:</strong> {bookingDetails.trip_title}</li>
                <li><strong>Participants:</strong> {bookingDetails.participants}</li>
                <li><strong>Booking Date:</strong> {new Date(bookingDetails.booking_date).toLocaleDateString()}</li>
                <li><strong>Meeting Point:</strong> {bookingDetails.meeting_point}</li>
                <li><strong>Duration:</strong> {bookingDetails.duration_days} days</li>
                <li><strong>Price Paid:</strong> €{bookingDetails.price}</li>
              </ul>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => {
          const IconComponent = iconMap[category.icon] || Info;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.slug ? null : category.slug)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeCategory === category.slug
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <IconComponent className={`h-6 w-6 ${
                  activeCategory === category.slug ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <h3 className={`font-medium ${
                  activeCategory === category.slug ? 'text-purple-600' : 'text-gray-700'
                }`}>
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => {
          const isBooked = bookedSlugs.includes(trip.slug);
          return (
            <div key={trip.slug} className="relative">
              {trip.discount_percentage > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {trip.discount_percentage}% OFF
                </div>
              )}
              <TripCard
                title={trip.title}
                description={trip.description}
                durationDays={trip.duration_days}
                price={parseFloat(trip.price)}
                originalPrice={parseFloat(trip.original_price)}
                discountPercentage={trip.discount_percentage}
                image={trip.image_url}
                startTime={"09:00 AM"}
                meetingPoint={"Beachside Entrance"}
                maxParticipants={trip.max_participants || 0}
                highlights={trip.highlights}
                specialOffer={null}
                onClick={() => setSelectedTrip(trip.slug)}
                isBooked={isBooked}
              />
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ShortTripsSection;