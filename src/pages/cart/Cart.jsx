import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCartFromBackend,
  updateQuantity,
  removeFromCart,
} from "../../slices/CartSlice";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import Footer from "../../components/footer/Footer";
import axios from "../../utils/Axios";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get(`/cart/${userId}`);
      console.log("Cart API response:", res.data);
      if (res.data.success && Array.isArray(res.data.cartItems)) {
        dispatch(setCartFromBackend(res.data.cartItems));
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  // Update quantity of a cart item
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`/cart/update/${userId}/${productId}`, {
        quantity: newQuantity,
      });
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  // Delete cart item by _cartId
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/cart/${userId}/item/${productId}`);
      dispatch(removeFromCart(productId));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  // Calculate total price
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/billing");
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  return (
    <>
      <div className="px-4 py-8 mt-16">
        <h2 className="text-xl sm:text-3xl font-semibold font-ubuntu text-center mb-8">
          Cart
        </h2>

        {!cartItems || cartItems.length === 0 ? (
          <p className="text-center text-gray-500 font-ubuntu">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto px-4 sm:px-8 md:px-12 lg:px-20">
              <table className="min-w-full border border-gray-300 font-ubuntu rounded-md text-sm sm:text-base">
                <thead className="bg-black text-white text-left font-medium">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr
                      key={`${item._cartId}-${index}`}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2 border text-center">{index + 1}</td>
                      <td className="p-2 border text-center">
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `http://localhost:8080/uploads/${item.image}`
                          }
                          alt={item.title}
                          onError={(e) =>
                            (e.target.src = "/images/placeholder.png")
                          }
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td className="p-2 border text-[14px]">{item.title}</td>
                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="px-2 py-1 bg-gray-200 text-black font-bold rounded-l hover:bg-gray-300"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-12 text-center border border-gray-300 rounded"
                            min="1"
                          />

                          <button
                            className="px-2 py-1 bg-gray-200 text-black font-bold rounded-r hover:bg-gray-300"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-2 border text-center">${item.price}</td>
                      <td className="p-2 border text-center">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => handleDelete(item.productId)} // Use _cartId here
                          className="text-red-600 hover:text-red-800 text-lg"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6 px-4 sm:px-8 md:px-12 lg:px-20">
              <div className="text-right space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold font-ubuntu">
                  Total: ${calculateTotal().toFixed(2)}
                </h3>
                <button
                  className="bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 font-ubuntu transition-all duration-200"
                  onClick={handleCheckout}
                >
                  Proceed to Billing
                </button>
              </div>
            </div>
          </>
        )}
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

      {/* Footer */}
      <div className="mt-12 w-full">
        <Footer />
      </div>
    </>
  );
};

export default Cart;
