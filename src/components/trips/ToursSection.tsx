import React, { useEffect, useState } from 'react';
import { Plane, X, Check } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const BASE_URL = 'http://127.0.0.1:8000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

type Tour = {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string; // backend maps duration_days -> string
  price: number;    // backend maps base_price
  image_url: string;
  destinations: string[];
  group_size: { min: number; max: number };
  itinerary: { day: number; title: string; description: string; meals: string[]; accommodation: string }[];
  included: string[];
  not_included: string[];
  category: string;
};

interface Props {
  category: string;
  title?: string;
  listEndpointOverride?: string;
}

/* -------------------------- Helper -------------------------- */
// ✅ Serve public disk uploads from /storage/... (after `php artisan storage:link`)
const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const cleaned = url.replace(/^\/+/, ''); // remove leading slashes
  const path = cleaned.startsWith('storage/') ? cleaned : `storage/${cleaned}`;
  return `${BASE_URL}/${path}`;
};

/* --------------------- Generic Payment Modal (responsive) --------------------- */
const GenericTourPaymentModal: React.FC<{
  clientSecret: string;
  bookingId: number;
  onClose: () => void;
}> = ({ clientSecret, bookingId, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSuccess(true);
      // (Optional) Let backend know too (webhook should also handle it)
      fetch(`${BASE_URL}/api/auth/tour/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id,
          booking_id: bookingId,
        }),
      }).catch(() => {});
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
          relative w-full
          max-h-[90vh] overflow-y-auto
          rounded-2xl bg-white p-4 shadow-xl
          dark:bg-gray-900
          sm:p-6
          md:max-w-md
        "
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-center text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
          Complete Your Payment
        </h2>

        {success ? (
          <div className="text-center">
            <Check className="mx-auto mb-3 h-12 w-12 text-green-500" />
            <p className="font-medium text-green-600">Payment successful!</p>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <PaymentElement />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              disabled={!stripe || loading}
              type="submit"
              className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Secured by Stripe. Press <kbd>Esc</kbd> to close.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

/* --------------------- Generic Booking Details Modal --------------------- */
const GenericTourBookingDetailsModal: React.FC<{
  bookingId: number;
  onClose: () => void;
}> = ({ bookingId, onClose }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/tour/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
          relative w-full
          max-h-[90vh] overflow-y-auto
          rounded-2xl bg-white p-6 shadow-xl
          dark:bg-gray-900
          md:max-w-md
        "
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <p className="text-center text-gray-600">Loading booking details...</p>
        ) : details?.error ? (
          <p className="text-center text-red-500">Could not fetch booking details.</p>
        ) : (
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              {details.trip_title}
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <strong>User:</strong> {details.user_name}
            </p>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              <strong>Status:</strong>{' '}
              {details.paid ? (
                <span className="font-semibold text-green-600">Paid</span>
              ) : (
                <span className="font-semibold text-red-600">Pending</span>
              )}
            </p>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              <strong>Booking ID:</strong> {details.id}
            </p>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              <strong>Meeting Point:</strong> {details.meeting_point}
            </p>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> {details.note}
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --------------------------- Main Section --------------------------- */
const ToursSection: React.FC<Props> = ({ category, title, listEndpointOverride }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookedTourIds, setBookedTourIds] = useState<number[]>([]);
  const [viewBookingId, setViewBookingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/tour/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setBookedTourIds(data);
    } catch {
      // unauthenticated, ignore
    }
  };

  useEffect(() => {
    const endpoint = listEndpointOverride
      ? listEndpointOverride
      : `${BASE_URL}/api/tours?category=${encodeURIComponent(category)}`;

    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        setTours(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch tours', err);
        setLoading(false);
      });

    fetchBookings();
  }, [category, listEndpointOverride]);

  const handleBook = async () => {
    if (!selectedTour) return;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/tour/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tour_id: selectedTour.id }),
      });

      const data = await res.json();
      if (data?.client_secret && data?.booking_id) {
        setClientSecret(data.client_secret);
        setBookingId(data.booking_id);
        setShowPaymentModal(true);
      } else if (data?.already_booked) {
        alert('You have already booked this tour.');
      } else {
        alert('Failed to create booking.');
      }
    } catch (e) {
      console.error('Booking error:', e);
      alert('Something went wrong.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading {category} tours...</div>;

  if (selectedTour) {
    const isBooked = bookedTourIds.includes(selectedTour.id);

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTour(null)}
          className="mb-6 flex items-center gap-2 font-medium text-purple-600 hover:text-purple-700"
        >
          ← Back to All {title || category} Tours
        </button>

        <TripDetails
          title={selectedTour.title}
          description={selectedTour.description}
          duration={parseInt(selectedTour.duration)}
          price={selectedTour.price}
          image={getFullImageUrl(selectedTour.image_url)}
          maxParticipants={selectedTour.group_size.max}
          highlights={selectedTour.itinerary.map((item) => ({
            day: item.day,
            activities: [
              {
                time: '',
                activity: item.title,
                description: `${item.description}\nMeals: ${item.meals.join(', ')}\nStay: ${item.accommodation}`,
              },
            ],
          }))}
          included={selectedTour.included}
          onBook={handleBook}
          isBooked={isBooked}
          onViewDetails={() => setViewBookingId(selectedTour.id)}
        />

        {showPaymentModal && clientSecret && bookingId && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret }}
            key={clientSecret} // force remount for new PI
          >
            <GenericTourPaymentModal
              clientSecret={clientSecret}
              bookingId={bookingId}
              onClose={() => {
                setShowPaymentModal(false);
                setClientSecret(null);
                setBookingId(null);
                fetchBookings();
              }}
            />
          </Elements>
        )}

        {viewBookingId && (
          <GenericTourBookingDetailsModal
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
        <div className="mb-2 flex items-center gap-2">
          <Plane className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold dark:text-white">
            {title || `${category.charAt(0).toUpperCase()}${category.slice(1)} Adventures`}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Discover our curated collection of {category} tours
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((t) => {
          const isBooked = bookedTourIds.includes(t.id);
          return (
            <TripCard
              key={t.slug}
              title={t.title}
              description={t.description}
              durationDays={parseInt(t.duration)}
              price={t.price}
              image={getFullImageUrl(t.image_url)}
              maxParticipants={t.group_size.max}
              highlights={t.itinerary.slice(0, 2).map((i) => ({
                time: '',
                activity: i.title,
                description: i.description,
              }))}
              onClick={() => setSelectedTour(t)}
              isBooked={isBooked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToursSection;
