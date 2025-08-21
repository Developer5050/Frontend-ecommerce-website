import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../slices/WishListSlice";
import { FaTrash } from "react-icons/fa";
import { addToCart } from "../../slices/CartSlice";
import { MdOutlineEmail } from "react-icons/md";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.products || []);
  const token = useSelector(
    (state) => state.auth?.token || localStorage.getItem("accessToken")
  );
  const userId =
    useSelector((state) => state.auth?.user?._id) ||
    localStorage.getItem("userId");

  console.log("userId", userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/wishlist/delete/${userId}/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchWishlist(userId)); // Refresh wishlist after removal
    } catch (error) {
      console.error("Error removing from wishlist:", error);
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
      const res = await axios.post(
        "http://localhost:8080/api/cart/add",
        cartItem
      );

      if (res.data.cartItem) {
        dispatch(addToCart(res.data.cartItem));

        // Remove from wishlist
        await axios.delete(
          `http://localhost:8080/api/wishlist/delete/${userId}/${product._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(fetchWishlist(userId));
        navigate("/cart");
      } else {
        throw new Error("Failed to add item to cart.");
      }
    } catch (err) {
      alert("Error: Unable to add to cart.");
    }
  };

  // New handler to delete entire wishlist
  const handleDeleteWishlist = async () => {
    if (
      !window.confirm("Are you sure you want to delete your entire wishlist?")
    )
      return;

    try {
      await axios.delete(
        `http://localhost:8080/api/wishlist/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(fetchWishlist(userId)); // Refresh wishlist after deletion
    } catch (error) {
      console.error("Error deleting wishlist:", error);
    }
  };

  return (
    <>
      <div className="px-4 py-8 mt-16">
        <h2 className="text-xl sm:text-3xl font-semibold font-ubuntu text-center mb-8">
          My Wishlist
        </h2>

        {/* Delete Entire Wishlist Button */}
        <div className="flex justify-end mb-4 px-4 sm:px-8 md:px-12 lg:px-20">
          <button
            onClick={handleDeleteWishlist}
            className="bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 font-ubuntu transition-all duration-200"
          >
            Delete Entire Wishlist
          </button>
        </div>

        {!wishlist || wishlist.length === 0 ? (
          <p className="text-center text-gray-500 font-ubuntu">
            Your wishlist is empty.
          </p>
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
                {wishlist?.map((item, index) => {
                  const product = item.productId || item;
                  return (
                    <tr
                      key={`${product?._id || "wishlist"}-${index}`}
                      className="border-t hover:bg-gray-50 text-center"
                    >
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        <img
                          src={`http://localhost:8080/uploads/${product.image}`}
                          alt={product.title}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td className="p-2 border text-left text-[14px]">
                        {product.title}
                      </td>
                      <td className="p-2 border">${product.price}</td>

                      {/* Add to Cart Button Column */}
                      <td className="p-2 border">
                        <button
                          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-all duration-200"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </td>

                      {/* Remove Button Column */}
                      <td className="p-2 border">
                        <button
                          className="text-red-600 hover:text-red-800 text-lg"
                          onClick={() => handleRemove(product._id)}
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

export default WishListPage;
