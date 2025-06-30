import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface AttractionPaymentModalProps {
  clientSecret: string;
  bookingId: number | null;
  onClose: () => void;
}

const AttractionPaymentModal: React.FC<AttractionPaymentModalProps> = ({ 
  clientSecret, 
  onClose, 
  bookingId 
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      console.error('❌ Payment failed:', result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      // Optional: Confirm payment in backend
      await fetch(`http://127.0.0.1:8000/api/auth/attraction/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          payment_intent_id: result.paymentIntent.id,
          payment_method: result.paymentIntent.payment_method,
          amount: result.paymentIntent.amount / 100,
        }),
      });

      alert('✅ Payment Successful!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button 
            type="submit" 
            className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={!stripe}
          >
            Pay
          </button>
        </form>
        <button 
          onClick={onClose} 
          className="text-sm text-gray-500 mt-2 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AttractionPaymentModal;