import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, X, Check, Star } from 'lucide-react';
import LocationMap from './maps/LocationMap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AttractionPaymentModal from './AttractionPaymentModal';
import StudentIntakeForm from './StudentIntake/StudentIntakeForm';
import StudentIntakePaymentModal from './StudentIntake/StudentIntakePaymentModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_yourKeyHere');

interface Coordinates { lat: number; lng: number; }
interface PointOfInterest { name: string; coordinates: Coordinates; type: string; }

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    isClosed?: boolean;
  };
}

interface Guide {
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
  openingHours?: OpeningHours;
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

/** API row from /api/attractions/{id}/opening-hours */
interface ApiOpeningHour {
  day_of_week: number;      // 0=Sun ... 6=Sat
  open_time: string | null; // "09:00:00" or "09:00"
  close_time: string | null;
  is_closed: boolean;
  timezone?: string | null;
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

  // Student Intake payment state
  const [intakeClientSecret, setIntakeClientSecret] = useState<string | null>(null);
  const [intakeSubmissionId, setIntakeSubmissionId] = useState<number | null>(null);
  const [showIntakePayment, setShowIntakePayment] = useState(false);

  // --- Default opening hours (final fallback) ---
  const defaultOpeningHours: OpeningHours = {
    monday: { open: '9:00 AM', close: '6:00 PM' },
    tuesday: { open: '9:00 AM', close: '6:00 PM' },
    wednesday: { open: '9:00 AM', close: '6:00 PM' },
    thursday: { open: '9:00 AM', close: '6:00 PM' },
    friday: { open: '9:00 AM', close: '6:00 PM' },
    saturday: { open: '10:00 AM', close: '4:00 PM' },
    sunday: { open: '', close: '', isClosed: true },
  };

  // --- Opening hours fetched per attraction ---
  const [openingHoursByAttraction, setOpeningHoursByAttraction] = useState<Record<number, ApiOpeningHour[]>>({});

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const getDayNameByIndex = (i: number) => dayNames[i] ?? `Day ${i}`;

  const formatTime24to12 = (time: string | null | undefined) => {
    if (!time) return '';
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
    // If you prefer 24h, just return `${hStr}:${mStr}`
  };

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const token = localStorage.getItem('token');

        // Optional: user (unused here)
        const userRes = await fetch('http://127.0.0.1:8000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        await userRes.json();

        // Bookings (ensure /api/auth/attraction/bookings exists or alias it)
        const bookingsRes = await fetch('http://127.0.0.1:8000/api/auth/attraction/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingsData = await bookingsRes.json();
        const ids = bookingsData.map((b: any) => b.attraction.id);
        setBookedAttractionIds(ids);
      } catch (err) {
        console.error('Error fetching user or booked attractions:', err);
      }
    };

    fetchUserAndBookings();
  }, []);

  // --- Fetch opening hours for each attraction (public route) ---
  useEffect(() => {
    if (!attractions?.length) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        const entries = await Promise.all(
          attractions.map(async (a) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/api/attractions/${a.id}/opening-hours`, {
                signal: controller.signal,
              });
              if (!res.ok) throw new Error(`Failed to load opening hours for attraction ${a.id}`);
              const data: ApiOpeningHour[] = await res.json();
              return [a.id, data] as const;
            } catch (e) {
              console.warn(e);
              return [a.id, []] as const;
            }
          })
        );

        const map: Record<number, ApiOpeningHour[]> = {};
        for (const [id, rows] of entries) map[id] = rows;
        setOpeningHoursByAttraction(map);
      } catch (e) {
        console.error('Opening hours load error:', e);
      }
    };

    load();
    return () => controller.abort();
  }, [attractions]);

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
        "Gaudi's innovative architectural techniques",
        'UNESCO World Heritage site exploration',
        'Fascinating construction history since 1882',
      ];
    }
    if (attractionName.toLowerCase().includes('gothic quarter')) {
      return [
        'Roman and Medieval architectural heritage',
        'Historic Jewish quarter exploration',
        'Ancient Roman wall remains',
        'Gothic cathedral and churches',
        'Medieval palaces and hidden squares',
      ];
    }
    if (type.toLowerCase().includes('museum')) {
      return [
        'Curated historical collections',
        'Interactive cultural exhibits',
        'Artistic masterpieces showcase',
        'Historical artifact displays',
        'Cultural context and interpretation',
      ];
    }
    if (type.toLowerCase().includes('monument') || type.toLowerCase().includes('historic')) {
      return [
        'Architectural significance exploration',
        'Historical context and stories',
        'Cultural heritage preservation',
        'Period-specific design elements',
        'Local historical importance',
      ];
    }
    return [
      'Cultural heritage interpretation',
      'Historical significance exploration',
      'Architectural details and context',
      'Local traditions and customs',
      'Authentic cultural experience',
    ];
  };

  const filteredAttractions = attractions.filter(attraction =>
    (visitType === 'group' && attraction.groupPrice ? attraction.groupPrice : attraction.price) <= maxPrice
  );

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

      if (bookingData.already_paid) {
        setBookingDetails({
          attraction,
          status: 'paid',
          participants: bookingData.participants || participants,
          booking_date: bookingData.booking_date || new Date().toISOString(),
        });
        setShowBookingModal(true);
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

  // Prefer API opening hours; fallback to guide.openingHours; then defaults
  const renderOpeningHours = (attraction: Attraction) => {
    const apiRows = openingHoursByAttraction[attraction.id];
    const guideHours = attraction.guide?.openingHours;

    if (apiRows && apiRows.length > 0) {
      return (
        <div className="space-y-1">
          {[...apiRows].sort((a, b) => a.day_of_week - b.day_of_week).map((row) => (
            <div key={row.day_of_week} className="flex justify-between">
              <span className="capitalize">{getDayNameByIndex(row.day_of_week)}:</span>
              <span>
                {row.is_closed ? (
                  <span className="text-red-500">Closed</span>
                ) : (
                  `${formatTime24to12(row.open_time)} - ${formatTime24to12(row.close_time)}`
                )}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (guideHours) {
      return (
        <div className="space-y-1">
          {Object.entries(guideHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between">
              <span className="capitalize">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
              <span>
                {hours.isClosed ? (
                  <span className="text-red-500">Closed</span>
                ) : (
                  `${hours.open} - ${hours.close}`
                )}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {Object.entries(defaultOpeningHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between">
            <span className="capitalize">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
            <span>
              {hours.isClosed ? (
                <span className="text-red-500">Closed</span>
              ) : (
                `${hours.open} - ${hours.close}`
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{city}, {country}</h1>
            {coordinates && (
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Coordinates: {coordinates.lat}, {coordinates.lng}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
              <Users className="h-5 w-5" />
              <span className="font-medium capitalize">{visitType} Visit</span>
            </div>
          </div>
        </div>

        {description && <p className="text-gray-600 mb-6">{description}</p>}

        {visitType === 'group' && (
          <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Group Size & Pricing Calculator
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={minGroupSize}
                  max={maxGroupSize}
                  value={groupSize || ''}
                  onChange={(e) => handleGroupSizeChange(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter size"
                />
                <span className="text-sm text-gray-600">
                  {minGroupSize}-{maxGroupSize} people
                </span>
              </div>
              {showGroupSizeError && (
                <p className="text-red-500 text-sm mt-2">
                  Please enter a group size between {minGroupSize} and {maxGroupSize} people
                </p>
              )}
            </div>
          </div>
        )}

        <LocationMap center={coordinates} zoom={13} pointsOfInterest={pointsOfInterest} />
      </div>

      {/* Student Intake Form Component */}
      <StudentIntakeForm
        onPaymentReady={({ clientSecret, submissionId }) => {
          setIntakeClientSecret(clientSecret);
          setIntakeSubmissionId(submissionId);
          setShowIntakePayment(true);
        }}
      />

      {filteredAttractions.length > 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Attractions & Activities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAttractions.map((attraction, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <img
                  src={getImageUrl(attraction.image)}
                  alt={attraction.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{attraction.name}</h3>
                <p className="text-gray-600">{attraction.type}</p>
                <div className="flex items-center text-gray-500 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{attraction.duration}</span>
                </div>

                {visitType === 'group' && attraction.minGroupSize && attraction.maxGroupSize && (
                  <div className="flex items-center text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{attraction.minGroupSize}-{attraction.maxGroupSize} people</span>
                  </div>
                )}

                {/* Opening Hours Card */}
                <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">Opening Hours:</p>
                    {renderOpeningHours(attraction)}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Cultural & Historical Highlights</h4>
                  </div>
                  <ul className="space-y-1">
                    {(attraction.highlights || getDefaultHighlights(attraction.name, attraction.type)).map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-purple-700">
                        <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-purple-600 font-semibold">
                    {visitType === 'group' && attraction.groupPrice && groupSize >= minGroupSize
                      ? `€${(attraction.groupPrice * groupSize).toFixed(2)} `
                      : `€${attraction.price.toFixed(2)}`}
                    {visitType === 'group' && attraction.groupPrice && groupSize >= minGroupSize && (
                      <span className="text-sm text-gray-500"> (€{attraction.groupPrice} per person)</span>
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      View Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookNow(attraction)}
                      className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${
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
        <div className="bg-yellow-50 p-6 rounded-xl text-center">
          <p className="text-yellow-700">No activities found within the selected price range.</p>
        </div>
      )}

      {showPayment && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <AttractionPaymentModal
            clientSecret={clientSecret}
            bookingId={bookingId}
            onClose={() => setShowPayment(false)}
          />
        </Elements>
      )}

      {/* Student Intake Payment Modal */}
      {showIntakePayment && intakeClientSecret && intakeSubmissionId && (
        <Elements stripe={stripePromise} options={{ clientSecret: intakeClientSecret }}>
          <StudentIntakePaymentModal
            submissionId={intakeSubmissionId}
            onClose={() => setShowIntakePayment(false)}
            onPaid={async () => {
              try {
                const token = localStorage.getItem('token');
                const r = await fetch(`http://127.0.0.1:8000/api/auth/student-intake/status/${intakeSubmissionId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const j = await r.json();
                if (j.status === 'paid') {
                  alert('Student intake form submitted successfully!');
                } else {
                  alert('Payment received. Finalizing your submission, please refresh in a moment.');
                }
              } catch (e) {
                console.error(e);
              } finally {
                setShowIntakePayment(false);
                setIntakeClientSecret(null);
                setIntakeSubmissionId(null);
              }
            }}
          />
        </Elements>
      )}

      {showBookingModal && bookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <p><strong>Attraction:</strong> {bookingDetails.attraction.name}</p>
              <p><strong>Type:</strong> {bookingDetails.attraction.type}</p>
              <p><strong>Duration:</strong> {bookingDetails.attraction.duration}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Paid</span></p>
              <p><strong>Participants:</strong> {bookingDetails.participants}</p>
              <p><strong>Booking Date:</strong> {new Date(bookingDetails.booking_date).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;
