import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addWishlist, removeWishlist } from "../../slices/WishListSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../../api/axios";

const Men = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const wishlist = useSelector((state) => state.wishlist.products || []);

  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const subCategories = ["T-Shirts", "Shoes", "Jeans", "Jackets"];

  // ✅ Wishlist Toggle - memoized with useCallback
  const toggleWishlist = useCallback(
    async (product) => {
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

      try {
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
        console.error("Wishlist error:", err);
        alert("Failed to update wishlist. Please try again.");
      }
    },
    [token, wishlist, dispatch]
  );

  // ✅ Set subcategory from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialSubCategory = queryParams.get("subCategory") || "";
    setSubCategoryFilter(initialSubCategory);
    setCurrentPage(1);
  }, [location.search]);

  // ✅ Fetch products
  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products/category/Men");
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch Men products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenProducts();
  }, []);

  // ✅ Filter + Sort + Pagination
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
    setDisplayed(filtered.slice(indexOfFirst, indexOfLast));
  }, [products, subCategoryFilter, sortOrder, currentPage]);

  // Calculate total pages
  const filteredProducts = products.filter((p) =>
    subCategoryFilter
      ? p.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
      : true
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const renderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500 text-sm">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500 text-sm">
          ★
        </span>
      );
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} className="text-gray-300 text-sm">
          ★
        </span>
      );
    }
    return stars;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
        <div className="text-center text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mt-20 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left sm:ml-20">
        Men Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 ml-0 sm:ml-20 justify-center sm:justify-start">
        {/* Subcategory */}
        <select
          onChange={(e) => {
            setSubCategoryFilter(e.target.value);
            setCurrentPage(1);
            navigate(
              `/men${e.target.value ? `?subCategory=${e.target.value}` : ""}`
            );
          }}
          value={subCategoryFilter}
          className="border py-2 px-4 rounded-md shadow-sm"
        >
          <option value="">All Subcategories</option>
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="border py-2 px-4 rounded-md shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {displayed.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          {products.length === 0
            ? "No products available."
            : "No products found matching your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:ml-20 md:mr-20 place-items-center">
          {displayed.map((product) => {
            const isInWishlist = wishlist.some(
              (item) =>
                item.productId?.toString() === product._id.toString() ||
                item._id?.toString() === product._id.toString()
            );

            return (
              <div
                key={product._id}
                className="border rounded-xl shadow-md p-4 w-[260px] cursor-pointer relative hover:shadow-lg transition group"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Fixed Aspect Ratio for Image */}
                <div className="relative overflow-hidden rounded-md mb-3 w-full aspect-[3/4]">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${import.meta.env.VITE_API_URL}/uploads/${
                            product.image
                          }`
                    }
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 text-xl bg-white p-1 rounded-full shadow-md hover:scale-110 transition"
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {isInWishlist ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500 hover:text-red-400" />
                  )}
                </button>

                {/* Product Info */}
                <h3 className="text-md font-semibold line-clamp-1">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(product.rating || 4)}
                  <span className="text-xs text-gray-600">
                    ({product.rating || 4})
                  </span>
                </div>

                {/* Price */}
                <div className="mt-1 text-sm sm:text-lg">
                  {product.discount ? (
                    <>
                      <span className="font-bold mr-2">
                        ${product.discount}
                      </span>
                      <span className="line-through text-gray-500 font-bold">
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-2 rounded-sm border ${
                currentPage === idx + 1
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-400 hover:bg-gray-100"
              } transition`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Men;
