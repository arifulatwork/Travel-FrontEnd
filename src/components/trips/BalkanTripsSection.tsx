import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BalkanTripPaymentModal from './BalkanTripPaymentModal';
import BalkanTripBookingDetailsModal from './BalkanTripBookingDetailsModal';

const BASE_URL = 'http://127.0.0.1:8000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface BalkanTrip {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  destinations: string[];
  group_size: { min: number; max: number };
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation: string;
  }[];
  included: string[];
  not_included: string[];
}

// Helper to get full image URL including storage path if missing
const getFullImageUrl = (url: string) => {
  if (!url) return '';
  // If url already contains http or https, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Otherwise, prefix with BASE_URL + /storage/
  return `${BASE_URL}/storage/${url.replace(/^\/?storage\/?/, '')}`;
};

const BalkanTripsSection: React.FC = () => {
  const [trips, setTrips] = useState<BalkanTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<BalkanTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookedTripIds, setBookedTripIds] = useState<number[]>([]);
  const [viewBookingId, setViewBookingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/balkan-trip/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookedTripIds(data);
      }
    } catch (error) {
      console.warn('Could not fetch booked trip IDs (unauthenticated?)');
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/balkan-trips`)
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch balkan trips', err);
        setLoading(false);
      });

    // Fetch user bookings
    fetchBookings();
  }, []);

  const handleBook = async () => {
    if (!selectedTrip) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/balkan-trip/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ balkan_trip_id: selectedTrip.id })
      });

      const data = await res.json();

      if (data.client_secret) {
        setClientSecret(data.client_secret);
        setBookingId(data.booking_id);
        setShowPaymentModal(true);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading Balkan trips...</div>;
  }

  if (selectedTrip) {
    const isBooked = bookedTripIds.includes(selectedTrip.id);
    
    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails
          title={selectedTrip.title}
          description={selectedTrip.description}
          duration={parseInt(selectedTrip.duration)}
          price={selectedTrip.price}
          image={getFullImageUrl(selectedTrip.image_url)}
          maxParticipants={selectedTrip.group_size.max}
          highlights={selectedTrip.itinerary.map((item) => ({
            day: item.day,
            activities: [
              {
                time: '',
                activity: item.title,
                description: `${item.description}\nMeals: ${item.meals.join(', ')}\nStay: ${item.accommodation}`
              }
            ]
          }))}
          included={selectedTrip.included}
          onBook={handleBook}
          isBooked={isBooked}
          onViewDetails={() => setViewBookingId(selectedTrip.id)}
        />

        {showPaymentModal && clientSecret && bookingId && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <BalkanTripPaymentModal
              clientSecret={clientSecret}
              bookingId={bookingId}
              onClose={() => {
                setShowPaymentModal(false);
                setClientSecret(null);
                setBookingId(null);
                // Refresh bookings after payment
                fetchBookings();
              }}
            />
          </Elements>
        )}

        {viewBookingId && (
          <BalkanTripBookingDetailsModal
            bookingId={viewBookingId}
            onClose={() => setViewBookingId(null)}
          />
        )}
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
          Discover our curated collection of multi-country Balkan tours
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => {
          const isBooked = bookedTripIds.includes(trip.id);

          return (
            <TripCard
              key={trip.slug}
              title={trip.title}
              description={trip.description}
              durationDays={parseInt(trip.duration)}
              price={trip.price}
              image={getFullImageUrl(trip.image_url)}
              maxParticipants={trip.group_size.max}
              highlights={trip.itinerary.slice(0, 2).map((i) => ({
                time: '',
                activity: i.title,
                description: i.description
              }))}
              onClick={() => setSelectedTrip(trip)}
              isBooked={isBooked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BalkanTripsSection;