import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const JourneyCheckoutForm = ({ journeyId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const return_url = `${window.location.origin}/journey-success?journey_id=${journeyId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-slate-500">
        <span>{isLoading ? "Processing..." : "Pay and Enroll"}</span>
      </button>
      {message && <div className="text-red-500 mt-2 text-center">{message}</div>}
    </form>
  );
};

export default JourneyCheckoutForm;
