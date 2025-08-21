import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  addWishlist,
  removeWishlist,
} from "../../slices/WishListSlice";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux wishlist directly use karenge
  const wishlist = useSelector((state) => state.wishlist.products || []);

  const token =
    useSelector((state) => state.auth?.token) ||
    localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchWishlist()); // redux me wishlist la raha hai
        const res = await axios.get(
          "http://localhost:8080/api/products/new-arrivals"
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const toggleWishlist = async (product) => {
    if (!token) {
      alert("Please login to use wishlist feature.");
      return;
    }

    const productId = product._id.toString();
    const isInWishlist = wishlist.some(
      (item) => item.productId?.toString() === productId || item._id?.toString() === productId
    );

    if (isInWishlist) {
      dispatch(removeWishlist(productId));
      try {
        await axios.delete(
          `http://localhost:8080/api/wishlist/delete/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error removing wishlist", err);
      }
    } else {
      dispatch(addWishlist({ productId }));
      try {
        await axios.post(
          "http://localhost:8080/api/wishlist/add",
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Error adding wishlist", err);
      }
    }
  };

  const displayProducts = viewAll ? products : products.slice(0, 4);

  const renderStars = (rating) => {
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
        <span key="half" className="relative text-sm">
          <span className="text-yellow-500 absolute left-0 w-1/2 overflow-hidden">
            &#9733;
          </span>
          <span className="text-gray-300">&#9733;</span>
        </span>
      );
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} className="text-gray-300 text-sm">
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="px-4 py-5 max-w-screen-xl mx-auto">
      <section id="new-arrivals" className="mt-20">
        <h2 className="text-center text-xl sm:text-3xl md:text-4xl font-extrabold font-ubuntu mt-16 mb-10">
          New Arrivals
        </h2>
      </section>

      {loading ? (
        <div className="text-center font-ubuntu">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 font-ubuntu">
          No New Products Found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((item) => {
              const isInWishlist = wishlist.some(
                (w) =>
                  w.productId?.toString() === item._id.toString() ||
                  w._id?.toString() === item._id.toString()
              );

              return (
                <div
                  key={item._id}
                  className="border rounded-sm p-3 shadow-md bg-white flex flex-col relative"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:8080/uploads/${item.image}`}
                      alt={item.title}
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="w-full h-48 sm:h-52 md:h-56 object-cover rounded-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-2 right-2 text-xl"
                    >
                      {isInWishlist ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>

                  <h2 className="text-md sm:text-base font-bold font-ubuntu mt-3 truncate">
                    {item.title}
                  </h2>

                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(item.rating || 4)}
                    <span className="text-xs sm:text-sm text-gray-600">
                      ({item.rating || 4})
                    </span>
                  </div>

                  <div className="mt-1 ml-2 text-sm sm:text-lg">
                    {item.discount ? (
                      <>
                        <span className="font-bold mr-2">${item.discount}</span>
                        <span className="line-through text-gray-500 font-bold">
                          ${item.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">${item.price}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {products.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setViewAll(!viewAll)}
                className="bg-black text-white px-6 py-2 mt-7 rounded-sm hover:bg-gray-800 transition"
              >
                {viewAll ? "View Less" : "View All"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
