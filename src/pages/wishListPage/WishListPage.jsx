import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import { fetchWishlist } from "../../slices/WishListSlice";
import { addToCart } from "../../slices/CartSlice";
import Footer from "../../components/footer/Footer";
import api from "../../../api/axios";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const wishlist = useSelector((state) => state.wishlist.products || []);
  const token = useSelector(
    (state) => state.auth?.token || localStorage.getItem("accessToken")
  );
  const userId =
    useSelector((state) => state.auth?.user?._id) ||
    localStorage.getItem("userId");

  // Memoized API calls
  const fetchWishlistData = useCallback(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/api/wishlist/delete/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlistData(); // Refresh wishlist after removal
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = async (product) => {
    if (!userId) return navigate("/login");

    const quantity = 1;

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items in stock`);
      return;
    }

    const cartItem = {
      userId,
      productId: product._id,
      title: product.title,
      quantity,
      price: product.discountPrice || product.price,
      image: product.image,
    };

    try {
      // Add to cart
      const res = await api.post("/api/cart/add", cartItem);

      if (res.data.cartItem) {
        dispatch(addToCart(res.data.cartItem));

        // Remove from wishlist
        await api.delete(`/api/wishlist/delete/${userId}/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchWishlistData();
        navigate("/cart");
      } else {
        throw new Error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error: Unable to add to cart. Please try again.");
    }
  };

  const handleDeleteWishlist = async () => {
    if (
      !window.confirm("Are you sure you want to delete your entire wishlist?")
    ) {
      return;
    }

    try {
      await api.delete(`/api/wishlist/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlistData(); // Refresh wishlist after deletion
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      alert("Failed to delete wishlist");
    }
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <>
      <div className="px-4 py-8 mt-16">
        <h2 className="text-xl sm:text-3xl font-semibold font-ubuntu text-center mb-8">
          My Wishlist
        </h2>

        {/* Delete Entire Wishlist Button */}
        {wishlist.length > 0 && (
          <div className="flex justify-end mb-4 px-4 sm:px-8 md:px-12 lg:px-20">
            <button
              onClick={handleDeleteWishlist}
              className="bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 font-ubuntu transition-all duration-200"
            >
              Delete Entire Wishlist
            </button>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-ubuntu text-lg mb-4">
              Your wishlist is empty.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 font-ubuntu transition-all duration-200"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto px-4 sm:px-8 md:px-12 lg:px-20">
            <table className="min-w-full border border-gray-300 font-ubuntu rounded-md text-sm sm:text-base">
              <thead className="bg-black text-white text-left font-medium">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border text-center">Image</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border text-center">Price</th>
                  <th className="p-2 border text-center">Action</th>
                  <th className="p-2 border text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item, index) => {
                  const product = item.productId || item;
                  return (
                    <tr
                      key={`wishlist-${product._id}-${index}`}
                      className="border-t hover:bg-gray-50 text-center"
                    >
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/${
                            product.image
                          }`}
                          alt={product.title}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md mx-auto"
                          onError={(e) => {
                            e.target.src = "/images/placeholder-product.png";
                          }}
                        />
                      </td>
                      <td className="p-2 border text-left text-[14px]">
                        {product.title}
                      </td>
                      <td className="p-2 border">${product.price}</td>

                      {/* Add to Cart Button Column */}
                      <td className="p-2 border">
                        <button
                          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                      </td>

                      {/* Remove Button Column */}
                      <td className="p-2 border">
                        <button
                          className="text-red-600 hover:text-red-800 text-lg"
                          onClick={() => handleRemove(product._id)}
                          aria-label="Remove from wishlist"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-black text-white rounded-xl px-4 py-8 mt-32 mx-4 sm:mx-6 md:mx-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left text-lg sm:text-xl font-extrabold font-ubuntu leading-tight w-full md:w-[48%]">
            STAY UP TO DATE <br className="hidden sm:block" />
            ABOUT OUR LATEST OFFERS
          </div>
          <div className="w-full md:w-[48%]">
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center bg-white rounded-full py-2 px-3">
                <MdOutlineEmail className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 text-black text-base font-ubuntu sm:text-base outline-none bg-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black font-semibold font-ubuntu rounded-full px-6 py-2 text-sm sm:text-base hover:bg-gray-100 transition"
              >
                Subscribe to Email
              </button>
            </form>
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

export default WishListPage;
