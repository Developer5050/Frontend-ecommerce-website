import React ,{ useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontSize: "16px",
      fontFamily: "Helvetica, Arial, sans-serif",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#e53e3e",
    },
  },
};

const CardPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Later you’ll call your backend to create PaymentIntent and confirm payment here

    console.log("Card Element: ", cardElement);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mt-20 border rounded-lg shadow-lg max-w-md mx-auto bg-white">
      <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
      <div className="p-3 border border-gray-300 rounded mb-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CardPaymentForm;
