import React, { useEffect } from "react";
import axios from "axios";

const SuccessPage = () => {
  useEffect(() => {
    const saveStripeOrder = async () => {
      const session = await axios.get(
        "http://localhost:8080/api/stripe/session",
        {
          withCredentials: true,
        }
      );

      const { customerInfo, cartItems, pricing } = session.data;

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

      await axios.post("http://localhost:8080/api/orders", orderPayload);
    };

    saveStripeOrder();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-ubuntu text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-lg font-ubuntu">Your order has been placed.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
