import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, Info, Sun, Moon, Coffee, Music, Utensils, Palette, Search, X, Check, Star } from 'lucide-react';
import LocationMap from './maps/LocationMap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AttractionPaymentModal from './AttractionPaymentModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_yourKeyHere');

interface Coordinates {
  lat: number;
  lng: number;
}

interface PointOfInterest {
  name: string;
  coordinates: Coordinates;
  type: string;
}

interface Guide {
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
}

interface Attraction {
  id: number;
  name: string;
  type: string;
  duration: string;
  price: number;
  groupPrice?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  image: string;
  guide?: Guide;
  highlights?: string[];
}

interface AttractionBooking {
  attraction: Attraction;
  status: string;
  participants: number;
  booking_date: string;
}

interface DestinationDetailsProps {
  country: string;
  city: string;
  description?: string;
  coordinates: Coordinates;
  image: string;
  pointsOfInterest: PointOfInterest[];
  attractions: Attraction[];
  visitType: 'individual' | 'group';
  maxPrice?: number;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  country,
  city,
  description,
  coordinates,
  image,
  pointsOfInterest,
  attractions,
  visitType,
  maxPrice = Infinity
}) => {
  const [groupSize, setGroupSize] = useState<number>(0);
  const [showGroupSizeError, setShowGroupSizeError] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookedAttractionIds, setBookedAttractionIds] = useState<number[]>([]);
  const [bookingDetails, setBookingDetails] = useState<AttractionBooking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Authentication check and fetch bookings
  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user
        const userRes = await fetch('http://127.0.0.1:8000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userRes.json();
        console.log('✅ Authenticated user (DestinationDetails):', userData);

        // Fetch bookings
        const bookingsRes = await fetch('http://127.0.0.1:8000/api/auth/attraction/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const bookingsData = await bookingsRes.json();
        const ids = bookingsData.map((b: any) => b.attraction.id);
        setBookedAttractionIds(ids);
      } catch (err) {
        console.error('❌ Error fetching user or booked attractions:', err);
      }
    };

    fetchUserAndBookings();
  }, []);

  const minGroupSize = Math.min(...attractions.map(a => a.minGroupSize || 0));
  const maxGroupSize = Math.max(...attractions.map(a => a.maxGroupSize || 0));

  const handleGroupSizeChange = (size: number) => {
    if (size >= minGroupSize && size <= maxGroupSize) {
      setGroupSize(size);
      setShowGroupSizeError(false);
    } else {
      setShowGroupSizeError(true);
    }
  };

  const getImageUrl = (imagePath: string) => {
    const baseUrl = 'http://127.0.0.1:8000/storage/';
    const cleanedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return baseUrl + cleanedPath;
  };

  const getDefaultHighlights = (attractionName: string, type: string) => {
    if (attractionName.toLowerCase().includes('sagrada familia')) {
      return [
        'Masterpiece of Modernist architecture',
        'Religious symbolism and artistic details',
        'Gaudi\'s innovative architectural techniques',
        'UNESCO World Heritage site exploration',
        'Fascinating construction history since 1882'
      ];
    }
    if (attractionName.toLowerCase().includes('gothic quarter')) {
      return [
        'Roman and Medieval architectural heritage',
        'Historic Jewish quarter exploration',
        'Ancient Roman wall remains',
        'Gothic cathedral and churches',
        'Medieval palaces and hidden squares'
      ];
    }
    if (type.toLowerCase().includes('museum')) {
      return [
        'Curated historical collections',
        'Interactive cultural exhibits',
        'Artistic masterpieces showcase',
        'Historical artifact displays',
        'Cultural context and interpretation'
      ];
    }
    if (type.toLowerCase().includes('monument') || type.toLowerCase().includes('historic')) {
      return [
        'Architectural significance exploration',
        'Historical context and stories',
        'Cultural heritage preservation',
        'Period-specific design elements',
        'Local historical importance'
      ];
    }
    return [
      'Cultural heritage interpretation',
      'Historical significance exploration',
      'Architectural details and context',
      'Local traditions and customs',
      'Authentic cultural experience'
    ];
  };

  const handleBookNow = async (attraction: Attraction) => {
  try {
    const token = localStorage.getItem('token');
    const participants = groupSize || 1;

    const res = await fetch(`http://127.0.0.1:8000/api/auth/attraction/book/${attraction.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participants }),
    });

    const bookingData = await res.json();

    // 🛑 Booking already exists and paid
    if (bookingData.already_paid) {
      alert('You have already booked and paid for this attraction.');
      return;
    }

    setBookingId(bookingData.booking_id);

    const paymentRes = await fetch(`http://127.0.0.1:8000/api/auth/attraction/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ booking_id: bookingData.booking_id }),
    });

    const paymentData = await paymentRes.json();
    setClientSecret(paymentData.clientSecret);

    setSelectedAttraction(attraction);
    setShowPayment(true);
  } catch (error) {
    console.error('Booking or payment error:', error);
  }
};

  const filteredAttractions = attractions.filter(attraction => 
    (visitType === 'group' && attraction.groupPrice ? attraction.groupPrice : attraction.price) <= maxPrice
  );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-6 py-4">
      <div className="bg-white rounded-xl p-2 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{city}, {country}</h1>
            {coordinates && (
              <div className="flex items-center text-gray-600 mt-1 text-sm sm:text-base">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Coordinates: {coordinates.lat}, {coordinates.lng}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 rounded-lg">
              <Users className="h-5 w-5" />
              <span className="font-medium capitalize text-sm sm:text-base">{visitType} Visit</span>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{description}</p>
        )}

        {visitType === 'group' && (
          <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-2 sm:p-4 border-b">
              <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Users className="h-5 w-5 text-purple-600" />
                Group Size & Pricing Calculator
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <input
                  type="number"
                  min={minGroupSize}
                  max={maxGroupSize}
                  value={groupSize || ''}
                  onChange={(e) => handleGroupSizeChange(Number(e.target.value))}
                  className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  placeholder="Enter size"
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  {minGroupSize}-{maxGroupSize} people
                </span>
              </div>
              {showGroupSizeError && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">
                  Please enter a group size between {minGroupSize} and {maxGroupSize} people
                </p>
              )}
            </div>
          </div>
        )}

        <LocationMap 
          center={coordinates} 
          zoom={13} 
          pointsOfInterest={pointsOfInterest}
        />
      </div>

      {filteredAttractions.length > 0 ? (
        <div className="bg-white rounded-xl p-2 sm:p-6 shadow-sm mt-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-semibold">Attractions & Activities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {filteredAttractions.map((attraction, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-4 flex flex-col">
                <img
                  src={getImageUrl(attraction.image)}
                  alt={attraction.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-2 sm:mb-4"
                />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{attraction.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{attraction.type}</p>
                <div className="flex items-center text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{attraction.duration}</span>
                </div>
                {visitType === 'group' && attraction.minGroupSize && attraction.maxGroupSize && (
                  <div className="flex items-center text-gray-500 mt-1 text-xs sm:text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{attraction.minGroupSize}-{attraction.maxGroupSize} people</span>
                  </div>
                )}
                {attraction.guide && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {attraction.guide.avatar ? (
                        <img 
                          src={getImageUrl(attraction.guide.avatar)} 
                          alt={attraction.guide.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {attraction.guide.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-xs sm:text-sm font-medium">{attraction.guide.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="text-yellow-500 mr-1">★</span>
                          {attraction.guide.rating} ({attraction.guide.reviews} reviews)
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Experience: {attraction.guide.experience}</p>
                      <p>Languages: {attraction.guide.languages.join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Key Highlights Section */}
                <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900 text-xs sm:text-base">Cultural & Historical Highlights</h4>
                  </div>
                  <ul className="space-y-1">
                    {(attraction.highlights || getDefaultHighlights(attraction.name, attraction.type)).map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-purple-700">
                        <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-2 sm:mt-4 gap-2 sm:gap-0">
                  <span className="text-purple-600 font-semibold text-base sm:text-lg">
                  {visitType === 'group' && attraction.groupPrice && groupSize >= minGroupSize
                    ? `€${(attraction.groupPrice * groupSize).toFixed(2)} `
                    : `€${attraction.price.toFixed(2)}`}
                  {visitType === 'group' && attraction.groupPrice && groupSize >= minGroupSize && (
                    <span className="text-xs sm:text-sm text-gray-500"> (€{attraction.groupPrice} per person)</span>
                  )}
                </span>
                  {bookedAttractionIds.includes(attraction.id) ? (
                    <button
                      onClick={() => {
                        const booked = attractions.find(a => a.id === attraction.id);
                        setBookingDetails({
                          attraction: booked!,
                          status: 'paid',
                          participants: groupSize || 1,
                          booking_date: new Date().toISOString(),
                        });
                        setShowBookingModal(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-base"
                    >
                      View Booking
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleBookNow(attraction)}
                      className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs sm:text-base ${
                        visitType === 'group' && (!groupSize || groupSize < minGroupSize || groupSize > maxGroupSize)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={visitType === 'group' && (!groupSize || groupSize < minGroupSize || groupSize > maxGroupSize)}
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl text-center mt-4">
          <p className="text-yellow-700 text-sm sm:text-base">No activities found within the selected price range.</p>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPayment && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <AttractionPaymentModal
            clientSecret={clientSecret}
            bookingId={bookingId}
            onClose={() => setShowPayment(false)}
          />
        </Elements>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && bookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0">
          <div className="bg-white p-2 sm:p-6 rounded-xl w-full max-w-xs sm:max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Booking Details</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-base">
              <p><strong>Attraction:</strong> {bookingDetails.attraction.name}</p>
              <p><strong>Type:</strong> {bookingDetails.attraction.type}</p>
              <p><strong>Duration:</strong> {bookingDetails.attraction.duration}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Paid</span></p>
              <p><strong>Participants:</strong> {bookingDetails.participants}</p>
              <p><strong>Booking Date:</strong> {new Date(bookingDetails.booking_date).toLocaleString()}</p>
              {bookingDetails.attraction.guide && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                  <p className="font-medium">Your Guide:</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {bookingDetails.attraction.guide.avatar ? (
                      <img 
                        src={getImageUrl(bookingDetails.attraction.guide.avatar)} 
                        alt={bookingDetails.attraction.guide.name}
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {bookingDetails.attraction.guide.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p>{bookingDetails.attraction.guide.name}</p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <span className="text-yellow-500 mr-1">★</span>
                        {bookingDetails.attraction.guide.rating} ({bookingDetails.attraction.guide.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;