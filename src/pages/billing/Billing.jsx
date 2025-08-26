import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import Footer from "../../components/footer/Footer";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../../api/axios";
import { clearCart } from "../../slices/CartSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Billing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "STRIPE",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.auth?.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const isStripe = formData.paymentMethod === "STRIPE";
  const shipping = isStripe ? 20 : 0;
  const tax = isStripe ? 100 : 0;
  const discount = 0;
  const grandTotal = subtotal + shipping + tax - discount;

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    console.log("🧪 Token in Checkout:", token);

    if (!user) return alert("Please log in first.");
    if (cartItems.length === 0) return alert("Your cart is empty.");

    setLoading(true);

    const sanitizedItems = cartItems.map((item) => ({
      productId: item._id || item.productId,
      sku: item.sku || "",
      name: item.title,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderPayload = {
      customerId: user?._id || user?.id,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      items: sanitizedItems,
      pricing: {
        currency: "PKR",
        subtotal,
        discounts: [],
        taxes: tax,
        shipping: shipping,
        grandTotal: grandTotal,
      },
      payment: {
        method: formData.paymentMethod,
        status: "PENDING",
      },
      currentStatus: "PENDING_PAYMENT",
      shipping: {
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: "Pakistan",
        },
        method:
          formData.paymentMethod === "CASH_ON_DELIVERY" ? "Standard" : "Stripe",
      },
    };

    try {
      if (formData.paymentMethod === "CASH_ON_DELIVERY") {
        const res = await api.post("/api/orders", orderPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("COD Order Success:", res.data);
        dispatch(clearCart());
        navigate("/order-confirmed");
      } else {
        const stripe = await stripePromise;
        const res = await api.post(
          "/api/stripe/create-checkout-session",
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { id } = res.data;
        const result = await stripe.redirectToCheckout({ sessionId: id });

        if (result.error) {
          console.error("Stripe redirect error:", result.error);
          alert("Payment failed: " + result.error.message);
        }
      }
    } catch (error) {
      console.error("Checkout Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to process order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  return (
    <>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12">
        <h2 className="text-xl sm:text-3xl font-semibold text-center mb-8 font-ubuntu">
          Billing
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Customer Form */}
          <div className="bg-white p-6 rounded-lg shadow-md font-ubuntu">
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
            <form className="space-y-4">
              {["name", "email", "address", "phone"].map((field) => (
                <div key={field}>
                  <label className="block font-semibold text-gray-700 text-sm">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full border ${
                      formErrors[field] ? "border-red-500" : "border-gray-300"
                    } p-2 rounded-sm text-sm mt-1`}
                    placeholder={`Enter ${field}`}
                  />
                  {formErrors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["city", "state", "zip"].map((field) => (
                  <div key={field}>
                    <label className="block font-semibold text-gray-700 text-sm">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {field === "city" && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full border ${
                        formErrors[field] ? "border-red-500" : "border-gray-300"
                      } p-2 rounded-sm text-sm mt-1`}
                      placeholder={`Enter ${field}`}
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md font-ubuntu">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${import.meta.env.VITE_API_URL}/uploads/${
                            item.image
                          }`
                    }
                    alt={item.title}
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold">
                      $ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4 space-y-2 text-right text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>$ {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span>$ {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>$ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-sm">
                Select Payment Method
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={formData.paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={handleChange}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={formData.paymentMethod === "STRIPE"}
                    onChange={handleChange}
                  />
                  Stripe
                </label>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="mt-6 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-black text-white rounded-xl px-4 py-8 mt-32 mx-4 sm:mx-6 md:mx-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left text-lg sm:text-xl font-extrabold font-ubuntu leading-tight w-full md:w-[48%]">
            STAY UP TO DATE <br className="hidden sm:block" />
            ABOUT OUR LATEST OFFERS
          </div>
          <div className="w-full md:w-[48%] flex flex-col gap-2">
            <div className="flex items-center bg-white rounded-full py-2 px-3">
              <MdOutlineEmail className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-black text-base font-ubuntu sm:text-base outline-none bg-transparent"
              />
            </div>
            <button className="bg-white text-black font-semibold font-ubuntu rounded-full px-6 py-2 text-sm sm:text-base hover:bg-gray-100 transition">
              Subscribe to Email
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default Billing;
