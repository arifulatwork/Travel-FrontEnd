import React, { useEffect, useState } from 'react';
import { X, CreditCard, Calendar, MapPin, User, Check } from 'lucide-react';

interface PetraTripBookingDetailsModalProps {
  bookingId: number;
  onClose: () => void;
}

interface BookingDetails {
  id: number;
  trip_title: string;
  user_name: string;
  stripe_payment_intent_id: string;
  paid: boolean;
  created_at: string;
  meeting_point?: string;
  note?: string;
}

const PetraTripBookingDetailsModal: React.FC<PetraTripBookingDetailsModalProps> = ({
  bookingId,
  onClose
}) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/auth/petra-trip/booking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading || !booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
          <p className="text-center">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 dark:text-white">Booking Information</h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            <span><strong>User:</strong> {booking.user_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span><strong>Date:</strong> {new Date(booking.created_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span><strong>Stripe Payment:</strong> {booking.stripe_payment_intent_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span><strong>Status:</strong> {booking.paid ? 'Paid' : 'Pending'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <span><strong>Meeting Point:</strong> {booking.meeting_point || 'N/A'}</span>
          </div>
          {booking.note && (
            <div className="mt-2">
              <strong className="text-purple-600">Note:</strong> {booking.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetraTripBookingDetailsModal;
