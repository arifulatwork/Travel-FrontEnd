import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface Props {
  submissionId: number;
  onClose: () => void;
  onPaid: () => void; // parent handles reset + status check
}

const StudentIntakePaymentModal: React.FC<Props> = ({ submissionId, onClose, onPaid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await stripe.confirmPayment({
      elements,
      // No redirect; stay in modal
      confirmParams: {},
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message || 'Payment failed. Please try again.');
      setSubmitting(false);
      return;
    }

    // Success — webhook will mark submission as "paid"
    setSubmitting(false);
    onPaid();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 md:p-6">
      {/* Backdrop click handler */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="relative bg-white rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Pay to Submit Application
          </h3>
          <button 
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Payment Element */}
        <div className="p-4 sm:p-5 md:p-6 max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] overflow-y-auto">
          <div className="mb-4 sm:mb-5 md:mb-6">
            <PaymentElement 
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: true
                }
              }}
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm sm:text-base text-red-600 text-center">
                {errorMsg}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="order-2 sm:order-1 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={!stripe || !elements || submitting}
            className="order-1 sm:order-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing…
              </span>
            ) : (
              'Pay & Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentIntakePaymentModal;