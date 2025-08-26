import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saveStripeOrder = async () => {
      try {
        // Get session data
        const session = await api.get("/api/stripe/session", {
          withCredentials: true,
        });

        const { customerInfo, cartItems, pricing } = session.data;

        // Prepare order payload
        const orderPayload = {
          customerInfo,
          items: cartItems,
          pricing,
          payment: {
            method: "STRIPE",
            status: "PAID",
          },
          status: "CONFIRMED",
        };

        // Save order to database
        await api.post("/api/orders", orderPayload);
        
        setLoading(false);
        
        // Optionally redirect to orders page after a delay
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
        
      } catch (err) {
        console.error("Error processing order:", err);
        setError(
          err.response?.data?.message || 
          "Failed to process your order. Please contact support."
        );
        setLoading(false);
      }
    };

    saveStripeOrder();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-ubuntu text-gray-600 mb-2">
            Processing your order...
          </h2>
          <p className="text-lg font-ubuntu">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-ubuntu text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-lg font-ubuntu mb-4">{error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 font-ubuntu transition-all duration-200"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-ubuntu text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-lg font-ubuntu mb-4">Your order has been placed.</p>
        <p className="text-gray-600 font-ubuntu">
          Redirecting to orders page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;