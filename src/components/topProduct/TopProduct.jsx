import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  addWishlist,
  removeWishlist,
} from "../../slices/WishListSlice";
import api from "../../../api/axios";

// Memoized star rendering component for better performance
const StarRating = React.memo(({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-yellow-500 text-sm">
        &#9733;
      </span>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="relative inline-block w-3 h-3">
        <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-500">
          &#9733;
        </span>
        <span className="text-gray-300">&#9733;</span>
      </span>
    );
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300 text-sm">
        &#9733;
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
});

StarRating.displayName = "StarRating";

const TopProduct = () => {
  const [viewAll, setViewAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.products || []);
  const token =
    useSelector((state) => state.auth?.token) ||
    localStorage.getItem("accessToken");

  // Create a Set for faster wishlist lookups
  const wishlistSet = useMemo(() => {
    return new Set(
      wishlist.map((item) => item.productId?.toString() || item._id?.toString())
    );
  }, [wishlist]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        // Fetch wishlist and products in parallel for better performance
        await Promise.all([
          dispatch(fetchWishlist()),
          api
            .get("/api/products/top-products")
            .then((res) => setProducts(res.data)),
        ]);
      } catch (err) {
        console.error("Failed to fetch top products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [dispatch]);

  const toggleWishlist = useCallback(
    async (product) => {
      if (!token) {
        alert("Please login to use wishlist feature.");
        return;
      }

      const productId = product._id.toString();
      setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

      try {
        const isInWishlist = wishlistSet.has(productId);

        if (isInWishlist) {
          dispatch(removeWishlist(productId));
          await api.delete(`/api/wishlist/delete/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          dispatch(addWishlist({ productId }));
          await api.post(
            "/api/wishlist/add",
            { productId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (err) {
        console.error("Error updating wishlist", err);
        // Revert the UI change on error
        if (wishlistSet.has(productId)) {
          dispatch(addWishlist({ productId }));
        } else {
          dispatch(removeWishlist(productId));
        }
      } finally {
        setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [token, wishlistSet, dispatch]
  );

  const displayProducts = viewAll ? products : products.slice(0, 4);

  if (loading) {
    return (
      <div className="px-4 py-4 max-w-screen-xl mx-auto mt-20">
        <h2 className="text-center text-3xl font-extrabold font-ubuntu mb-10">
          Top Selling
        </h2>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3">Loading top products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      <section className="mt-20">
        <h2 className="text-center text-3xl font-extrabold font-ubuntu mb-10">
          Top Selling
        </h2>
      </section>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No Top Products Found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((item) => {
              const productId = item._id.toString();
              const isInWishlist = wishlistSet.has(productId);
              const isLoading = wishlistLoading[productId];

              return (
                <div
                  key={productId}
                  className="border rounded-lg p-4 shadow-md bg-white flex flex-col relative hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${
                        item.image
                      }`}
                      alt={item.title}
                      onClick={() => navigate(`/product/${productId}`)}
                      className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      loading="lazy"
                    />
                    <button
                      onClick={() => !isLoading && toggleWishlist(item)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
                      aria-label={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-t-2 border-red-500 border-solid rounded-full animate-spin"></div>
                      ) : isInWishlist ? (
                        <FaHeart className="text-red-500 text-lg" />
                      ) : (
                        <FaRegHeart className="text-gray-600 text-lg" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold mt-3 truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-2">
                    <StarRating rating={item.rating || 4} />
                    <span className="text-sm text-gray-600 ml-1">
                      ({item.rating || 4})
                    </span>
                  </div>

                  <div className="mt-2">
                    {item.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          ${item.discount}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${item.price}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {Math.round((1 - item.discount / item.price) * 100)}%
                          off
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-gray-900">
                        ${item.price}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {products.length > 4 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setViewAll(!viewAll)}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                {viewAll ? "View Less" : "View All Products"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(TopProduct);
