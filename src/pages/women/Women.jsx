import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Missing import
import { addWishlist, removeWishlist } from "../../slices/WishListSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Women = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const subCategories = ["Dress", "Heels", "Watches", "Handbags", "Tops"];

  const wishlist = useSelector((state) => state.wishlist.products || []);

  // ✅ Token from localStorage
  const token = localStorage.getItem("accessToken");

  // ✅ Wishlist Toggle
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

  // ✅ Subcategory filter from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialSubCategory = queryParams.get("subCategory") || "";
    setSubCategoryFilter(initialSubCategory);
    setCurrentPage(1);
  }, [location.search]);

  // ✅ Fetch products
  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/products/category/Women"
        );
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Women products");
        setLoading(false);
      }
    };
    fetchWomenProducts();
  }, []);

  // ✅ Filtering + Sorting + Pagination
  useEffect(() => {
    let filtered = [...products];

    if (subCategoryFilter) {
      filtered = filtered.filter(
        (p) => p.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
      );
    }

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const paginated = filtered.slice(indexOfFirst, indexOfLast);

    setDisplayed(paginated);
  }, [products, subCategoryFilter, sortOrder, currentPage]);

  const totalPages = Math.ceil(
    products.filter((p) =>
      subCategoryFilter
        ? p.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
        : true
    ).length / productsPerPage
  );

  // ✅ Star Rendering
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

  if (loading)
    return (
      <div className="text-center mt-10 text-xl font-ubuntu">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-ubuntu">{error}</div>
    );

  return (
    <div className="px-2 sm:px-6 lg:px-8 py-8 mt-16 mx-auto max-w-screen-xl">
      <h2 className="text-xl sm:text-2xl font-bold font-ubuntu mb-4 mt-5 px-2 sm:px-0 text-center sm:text-left md:ml-16">
        Women Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 px-2 font-ubuntu sm:px-0 md:ml-16 justify-center sm:justify-start">
        {/* Subcategory Filter */}
        <div className="relative w-full sm:w-60">
          <select
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            value={subCategoryFilter}
            className="w-full appearance-none text-md border border-gray-300 bg-white text-gray-700 py-1 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          >
            <option value="">All Subcategories</option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort Order Filter */}
        <div className="relative w-full sm:w-60">
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="w-full appearance-none border border-gray-300 bg-white text-gray-700 py-1 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          >
            <option value="">Sort By</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {displayed.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:mr-20 md:ml-16 gap-6 justify-items-center">
          {displayed.map((product) => {
            const isInWishlist = wishlist.some(
              (item) =>
                item.productId?.toString() === product._id.toString() ||
                item._id?.toString() === product._id.toString()
            );

            return (
              <div
                key={product._id}
                className="border rounded-lg shadow p-4 w-full max-w-[260px] relative"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={`http://localhost:8080/uploads/${product.image}`}
                  alt={product.title}
                  className="w-full h-[200px] object-cover rounded-lg mb-3 transition-transform hover:scale-105"
                />

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ navigation ko rok lega
                    toggleWishlist(product);
                  }}
                  className="absolute top-2 right-2 text-xl"
                >
                  {isInWishlist ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500" />
                  )}
                </button>

                <h3 className="text-md font-semibold font-ubuntu">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  {renderStars(product.rating || 4)}
                  <span className="text-xs sm:text-sm text-gray-600">
                    ({product.rating || 4})
                  </span>
                </div>

                <div className="mt-1 ml-2 text-sm sm:text-lg">
                  {product.discount ? (
                    <>
                      <span className="font-bold mr-2">
                        ${product.discount}
                      </span>
                      <span className="line-through text-gray-500 font-bold">
                        ${product.price}
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
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === idx + 1
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Women;
