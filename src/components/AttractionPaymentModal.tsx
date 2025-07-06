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
    <div className="fixed inset-0 z-[1000] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/40 transition-opacity" 
          onClick={onClose}
        />
        
        {/* Modal container */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Complete Your Payment
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="min-h-[300px]">
                  <PaymentElement options={{
                    layout: {
                      type: 'tabs',
                      defaultCollapsed: false,
                    }
                  }} />
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    disabled={!stripe}
                  >
                    Pay Now
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionPaymentModal;