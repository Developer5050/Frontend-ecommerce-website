import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist, removeWishlist } from "../../slices/WishListSlice";
import api from "../../../api/axios";

const AllProduct = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.products || []);

  const token =
    useSelector((state) => state.auth?.token) ||
    localStorage.getItem("accessToken");

  const toggleWishlist = async (product) => {
    if (!token) {
      alert("Please login to use wishlist feature.");
      return;
    }

    const productId = product._id.toString();
    const isInWishlist = wishlist.some(
      (item) =>
        item.productId?.toString() === productId ||
        item._id?.toString() === productId
    );

    if (isInWishlist) {
      dispatch(removeWishlist(productId));
      try {
        await api.delete(`/api/wishlist/delete/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error removing wishlist", err);
      }
    } else {
      dispatch(addWishlist({ productId }));
      try {
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
      } catch (err) {
        console.error("Error adding wishlist", err);
      }
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `/api/products/search?query=${searchQuery}`
          : `/api/products/get-all-products`;

        const res = await api.get(url);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load products", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetch();
  }, [searchQuery]);

  // Sort products
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => b.price - a.price);
    }

    setSortedProducts(filtered);
    setCurrentPage(1);
  }, [products, sortOrder, selectedCategory]);

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

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <div className="mt-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4 mt-5 font-ubuntu">
        Home &gt; <span className="text-black font-normal">Products</span>
      </div>

      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold font-ubuntu">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            className="border rounded px-3 py-2 text-sm font-ubuntu"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          <select
            className="border rounded px-3 py-2 text-sm font-ubuntu"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading/Error */}
      <div>
        {loading && (
          <p className="text-gray-600 font-ubuntu">Loading products...</p>
        )}
        {error && <p className="text-red-500 font-ubuntu">{error}</p>}
      </div>

      {/* Product Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentProducts.map((product) => {
              const isInWishlist = wishlist.some(
                (item) =>
                  item.productId?.toString() === product._id.toString() ||
                  item._id?.toString() === product._id.toString()
              );

              return (
                <div
                  key={product._id}
                  className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-300 relative"
                >
                  <div
                    className="w-full h-[200px] flex justify-center items-center overflow-hidden rounded-md mb-3 cursor-pointer group"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${import.meta.env.VITE_API_URL}/uploads/${
                              product.image
                            }`
                      }
                      alt={product.title}
                      onError={(e) =>
                        (e.target.src = "/images/placeholder.png")
                      }
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 text-xl"
                  >
                    {isInWishlist ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500" />
                    )}
                  </button>

                  <h2 className="text-md font-semibold font-ubuntu mb-1 line-clamp-1 text-gray-800">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating || 4)}
                    <span className="text-xs sm:text-sm text-gray-600">
                      ({product.rating || 4})
                    </span>
                  </div>

                  <div className="mt-1 text-sm sm:text-lg">
                    {product.discount ? (
                      <>
                        <span className="font-bold mr-2">
                          ${product.discount}
                        </span>
                        <span className=" line-through text-gray-500 font-bold">
                          ${product.price}
                        </span>
                        <span className="text-sm text-green-600 font-medium ml-2">
                          {Math.round(
                            (1 - product.discount / product.price) * 100
                          )}
                          % off
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">${product.price}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-1 py-4 flex-wrap">
            <button
              className="px-3 py-2 border border-gray-400 rounded-sm font-ubuntu text-xs sm:text-sm transition 
      hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 
      disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-sm text-xs sm:text-sm transition 
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
        ${
          currentPage === i + 1
            ? "bg-black text-white border-black"
            : "bg-white text-gray-800 border-gray-400 hover:border-black hover:bg-gray-100"
        }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-2 border border-gray-400 rounded-sm font-ubuntu text-xs sm:text-sm transition 
      hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 
      disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProduct;
