import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import MontenegroTripPaymentModal from './montenegro/MontenegroTripPaymentModal';
import MontenegroTripBookingDetailsModal from './montenegro/MontenegroTripBookingDetailsModal';

const BASE_URL = 'http://127.0.0.1:8000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface Tour {
  id: number;
  slug: string;
  title: string;
  description: string;
  /** backend returns string duration (mapped from duration_days) */
  duration: string;
  /** backend returns price as number (mapped from base_price) */
  price: number;
  image_url: string;
  destinations: string[];
  group_size: { min: number; max: number };
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals?: string[];
    accommodation?: string;
  }[];
  included: string[];
  not_included: string[];
}

// Helper to get full image URL including storage path if missing
const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}/storage/${url.replace(/^\/?storage\/?/, '')}`;
};

const MontenegroTripsSection: React.FC = () => {
  const [trips, setTrips] = useState<Tour[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookedTripIds, setBookedTripIds] = useState<number[]>([]);
  const [viewBookingId, setViewBookingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/tour/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookedTripIds(data);
      }
    } catch {
      console.warn('Could not fetch booked tour IDs (unauthenticated?)');
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/tours?category=montenegro`)
      .then((res) => res.json())
      .then((data: Tour[]) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch tours (montenegro)', err);
        setLoading(false);
      });

    fetchBookings();
  }, []);

  const handleBook = async () => {
    if (!selectedTrip) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/tour/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tour_id: selectedTrip.id }),
      });

      const data = await res.json();

      if (data?.client_secret) {
        setClientSecret(data.client_secret);
        setBookingId(data.booking_id);
        setShowPaymentModal(true);
      } else if (data?.already_booked) {
        alert('You have already booked this tour.');
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading Montenegro trips...</div>;
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
                description: `${item.description}${
                  item.meals?.length ? `\nMeals: ${item.meals.join(', ')}` : ''
                }${item.accommodation ? `\nStay: ${item.accommodation}` : ''}`,
              },
            ],
          }))}
          included={selectedTrip.included}
          onBook={handleBook}
          isBooked={isBooked}
          // NOTE: This still passes trip.id to your modal.
          // If your modal expects a *booking id*, adapt the modal or fetch the booking id first.
          onViewDetails={() => setViewBookingId(selectedTrip.id)}
        />

        {showPaymentModal && clientSecret && bookingId && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <MontenegroTripPaymentModal
              clientSecret={clientSecret}
              bookingId={bookingId}
              onClose={() => {
                setShowPaymentModal(false);
                setClientSecret(null);
                setBookingId(null);
                fetchBookings(); // refresh after payment
              }}
            />
          </Elements>
        )}

        {viewBookingId && (
          <MontenegroTripBookingDetailsModal
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
          <h2 className="text-2xl font-bold dark:text-white">Montenegro Adventures</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Discover our curated collection of multi-country Montenegro tours
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
                description: i.description,
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

export default MontenegroTripsSection;
