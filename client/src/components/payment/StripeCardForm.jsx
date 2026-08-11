import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

/**
 * StripeCardForm
 * Props:
 *   clientSecret  - from server createPaymentIntent
 *   amount        - total in PKR (for display)
 *   onSuccess     - callback(paymentIntentId) when payment succeeds
 *   onError       - callback(message) on failure
 *   loading       - bool to show external loading state
 */
const StripeCardForm = ({ clientSecret, amount, onSuccess, onError, loading: externalLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMsg(error.message || 'Payment failed. Please try again.');
        onError && onError(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess && onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      onError && onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const isLoading = processing || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Payment Element */}
      <div className="p-4 bg-gray-50 dark:bg-navy-700 rounded-xl border border-gray-200 dark:border-gray-600">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { name: 'auto', email: 'auto' } },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <span className="text-red-500 text-lg">⚠️</span>
          <p className="text-red-600 dark:text-red-400 text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Test card hint */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
        <p className="text-blue-700 dark:text-blue-400 text-xs font-semibold mb-1">🧪 Test Mode — Use test card:</p>
        <p className="text-blue-600 dark:text-blue-300 text-xs font-mono">4242 4242 4242 4242 | Exp: 12/34 | CVV: 123</p>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>🔒 Pay {amount ? `PKR ${amount.toLocaleString()}` : ''}</>
        )}
      </button>
    </form>
  );
};

export default StripeCardForm;
