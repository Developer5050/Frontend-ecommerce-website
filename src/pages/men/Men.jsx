import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { addWishlist, removeWishlist } from "../../slices/WishListSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Men = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken"); // ✅ token fix
  const wishlist = useSelector((state) => state.wishlist.products || []);

  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const subCategories = ["T-Shirts", "Shoes", "Jeans", "Jackets"];

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
        const res = await axios.get(
          "http://localhost:8080/api/products/category/Men"
        );
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Men products");
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

  const totalPages = Math.ceil(
    products.filter((p) =>
      subCategoryFilter
        ? p.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
        : true
    ).length / productsPerPage
  );

  const renderStars = (rating) => {
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
        <span key="half" className="relative text-sm">
          <span className="text-yellow-500 absolute left-0 w-1/2 overflow-hidden">
            ★
          </span>
          <span className="text-gray-300">★</span>
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
  };

  if (loading)
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

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
          className="border py-1 px-4 rounded-md shadow-sm"
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
          className="border py-1 px-4 rounded-md shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {displayed.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No products found.
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
                className="border rounded-xl shadow-md p-4 w-[260px] cursor-pointer relative hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={`http://localhost:8080/uploads/${product.image}`}
                  alt={product.title}
                  className="w-full h-[200px] object-cover rounded-md mb-3 transition-transform hover:scale-105"
                />

                {/* Wishlist Button */}
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
                <h3 className="text-md font-semibold line-clamp-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(product.rating || 4)}
                  <span className="text-xs text-gray-600">
                    ({product.rating || 4})
                  </span>
                </div>
                <div className="mt-1 text-sm sm:text-lg">
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
      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded-sm border ${
              currentPage === idx + 1
                ? "bg-black text-white"
                : "bg-white text-black border-gray-400"
            } transition`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Men;
