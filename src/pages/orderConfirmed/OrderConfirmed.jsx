import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { clearCart } from "../../slices/CartSlice";
import api from "../../../api/axios";

const OrderConfirmed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContinueShopping = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("cartItems");
      
      // Clear Redux state
      dispatch(clearCart());
      
      // Clear cart from database
      const userId = localStorage.getItem("userId");
      if (userId) {
        await api.delete(`/api/cart/${userId}`);
      }
      
      navigate("/");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      // Even if API call fails, still navigate to home page
      navigate("/");
    }
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

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleContinueShopping}
          className="bg-black text-white px-5 py-2 text-sm sm:text-base rounded-sm font-ubuntu hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
        
      </div>
    </div>
  );
};

export default OrderConfirmed;