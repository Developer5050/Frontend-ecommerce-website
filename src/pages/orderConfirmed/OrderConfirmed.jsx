import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { clearCart } from "../../slices/CartSlice";

const OrderConfirmed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContinueShopping = async () => {
    localStorage.removeItem("cartItems");
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        await fetch(`http://localhost:8080/api/cart/${userId}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error("Failed to clear cart in database", err);
    }
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 text-center">
      <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mb-4" />
      <h1 className="text-xl sm:text-2xl font-semibold font-ubuntu text-gray-800 mb-2">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 mb-6 max-w-md text-sm sm:text-base font-ubuntu">
        Your order has been confirmed. You will receive a confirmation email
        shortly.
      </p>

      <button
        onClick={handleContinueShopping}
        className="bg-black text-white px-5 py-2 text-sm sm:text-base rounded-sm font-ubuntu hover:bg-gray-800 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmed;
