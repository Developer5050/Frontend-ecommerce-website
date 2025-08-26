import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // Your custom axios instance
import { useLocation, useNavigate } from "react-router-dom";
import { addWishlist, removeWishlist } from "../../slices/WishListSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Kid = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.products || []);

  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const subCategories = ["KidShirts", "Shorts", "Pants"];

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
      console.error("Error updating wishlist", err);
    }
  };

  // Step 1: Get subCategory from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const subCat = queryParams.get("subCategory") || "";
    setSubCategoryFilter(subCat);
    setCurrentPage(1);
  }, [location.search]);

  // Step 2: Fetch Kid products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products/category/Kids");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Kid products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Step 3: Filter + Sort + Paginate
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

  // ⭐ Render Ratings
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 mt-16 mx-auto max-w-screen-xl">
      <h2 className="text-xl sm:text-2xl font-bold font-ubuntu text-md text-center sm:text-left mb-4 mt-5 px-2 sm:px-0 md:ml-14">
        Kids Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 px-2 sm:px-0 md:ml-14 justify-center sm:justify-start">
        {/* Subcategory Filter */}
        <div className="relative w-full sm:w-60">
          <select
            onChange={(e) => {
              setSubCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            value={subCategoryFilter}
            className="w-full appearance-none border border-gray-300 bg-white text-gray-700 py-1 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          >
            <option value="">All Subcategories</option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
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
        </div>
      </div>

      {/* Product Grid */}
      {displayed.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ml-14 mr-16 gap-6 justify-items-center">
          {displayed.map((product) => {
            const isInWishlist = wishlist.some(
              (item) =>
                item.productId?.toString() === product._id.toString() ||
                item._id?.toString() === product._id.toString()
            );

            return (
              <div
                key={product._id}
                className="border rounded-lg shadow p-4 w-full max-w-[260px] relative cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* ✅ Fixed Aspect Ratio for Image */}
                <div className="relative overflow-hidden rounded-lg mb-3 w-full apsect-[4/3]">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${import.meta.env.VITE_API_URL}/uploads/${
                            product.image
                          }`
                    }
                    alt={product.title}
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 text-xl bg-white p-1 rounded-full shadow-md hover:scale-110 transition"
                >
                  {isInWishlist ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500 hover:text-red-400" />
                  )}
                </button>

                <h3 className="text-md font-semibold font-ubuntu line-clamp-1">
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
      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded-sm border transition ${
              currentPage === idx + 1
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-100"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Kid;
