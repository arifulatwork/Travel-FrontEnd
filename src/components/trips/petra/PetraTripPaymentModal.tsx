import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface PetraTripPaymentModalProps {
  clientSecret: string;
  bookingId: number;
  onClose: () => void;
}

const PetraTripPaymentModal: React.FC<PetraTripPaymentModalProps> = ({ 
  clientSecret, 
  bookingId, 
  onClose 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href
        },
        redirect: 'if_required'
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/petra-trip/payment/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            payment_intent_id: result.paymentIntent.id,
            booking_id: bookingId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to confirm payment');
        }

        alert('✅ Payment successful! Your booking is confirmed.');
        onClose();
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      alert('Payment confirmation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Complete Your Payment</h3>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetraTripPaymentModal;