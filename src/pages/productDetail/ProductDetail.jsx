import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { MdOutlineEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/CartSlice";
import api from "../../../api/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/product/${id}`);
        setProduct(res.data);

        // Handle image URL correctly
        let imageUrl = "/images/placeholder.png";
        if (res.data.image) {
          if (res.data.image.startsWith("http")) {
            imageUrl = res.data.image;
          } else {
            // Remove any duplicate uploads/ path if present
            const cleanPath = res.data.image.replace(/^uploads\//, "");
            imageUrl = `https://backend-ecommerce-website-1-1dac.onrender.com/uploads/${cleanPath}`;
          }
        }
        setMainImage(imageUrl);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart handler
  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return navigate("/login");

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items in stock`);
      return;
    }

    setAddingToCart(true);

    const cartItem = {
      userId: user.id,
      productId: product._id,
      title: product.title,
      quantity,
      price: product.discountPrice || product.price,
      image: mainImage,
      color: selectedColor,
      size: selectedSize,
    };

    try {
      const res = await api.post("/api/cart/add", cartItem);
      if (res.data.cartItem) {
        dispatch(addToCart(res.data.cartItem));
        navigate("/cart");
      } else {
        throw new Error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error: Unable to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Helper functions for product options
  const colors = product
    ? Array.isArray(product.color)
      ? product.color.filter((c) => typeof c === "string" && c.trim())
      : typeof product.color === "string"
      ? product.color.split(",").filter((c) => c.trim())
      : []
    : [];

  const sizes = product
    ? Array.isArray(product.size)
      ? product.size.filter((s) => s)
      : [product.size].filter((s) => s)
    : [];

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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center font-ubuntu">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="text-red-500 text-center mt-10 font-ubuntu">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="block mx-auto mt-4 bg-black text-white px-4 py-2 rounded-sm font-ubuntu text-sm hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="text-center mt-10 font-ubuntu">Product not found.</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <nav className="flex text-sm text-gray-600 mb-4 font-ubuntu">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2">{">"}</span>
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/products")}
          >
            Products
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mb-10 px-4">
        <div className="flex justify-center bg-white shadow-sm rounded-lg p-6">
          <img
            src={mainImage}
            alt={product.title}
            onError={(e) => (e.target.src = "/images/placeholder.png")}
            className="w-full max-w-xs sm:max-w-sm md:max-w-sm h-auto object-contain rounded-lg mx-auto"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4 mt-2">
          <h2 className="text-2xl font-bold font-ubuntu">{product.title}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mt-1">
              {renderStars(product.rating || 4)}
              <span className="text-xs text-gray-600">
                ({product.rating || 4})
              </span>
            </div>
          </div>

          <div className="flex gap-4 text-xl font-semibold">
            <span>${product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span className="line-through text-gray-500">
                ${product.price}
              </span>
            )}
          </div>

          <p className="text-gray-700 text-sm font-ubuntu">{product.desc}</p>

          {/* Color Options */}
          {colors.length > 0 && (
            <div>
              <label className="font-medium font-ubuntu">Color:</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color.trim())}
                    className={`px-4 py-1 rounded-full text-sm border ${
                      selectedColor === color.trim()
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {color.trim()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {sizes.length > 0 && (
            <div>
              <label className="font-medium font-ubuntu">Size:</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1 rounded-full text-sm border ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Stock */}
          <div>
            <label className="font-medium font-ubuntu">Quantity:</label>
            <div className="flex items-center mt-1">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(product.stock, Number(e.target.value))
                  );
                  setQuantity(value);
                }}
                className="border rounded px-3 py-1 w-24"
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className={`px-6 py-3 rounded-sm font-ubuntu text-sm w-full md:w-auto ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {addingToCart
              ? "Adding to Cart..."
              : product.stock === 0
              ? "Out of Stock"
              : "Add To Cart"}
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-6xl mx-auto px-6 mt-12 mb-20">
        <h3 className="text-xl font-bold font-ubuntu mb-4 text-center">
          Product Details
        </h3>
        <p className="text-gray-700 leading-relaxed font-ubuntu">
          {product.longDesc ||
            "This product is crafted with high-quality materials and offers both comfort and durability."}
        </p>
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-6xl mx-auto mb-14">
        <div className="bg-black text-white rounded-xl px-4 py-8 mt-10 mx-4 sm:mx-6 md:mx-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-lg md:text-left sm:text-xl font-extrabold leading-tight font-ubuntu">
            STAY UP TO DATE
            <br />
            ABOUT OUR LATEST OFFERS
          </div>
          <div className="w-full md:w-[48%] flex flex-col gap-2">
            <div className="flex items-center bg-white rounded-full py-2 px-3">
              <MdOutlineEmail className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-black text-base font-ubuntu outline-none bg-transparent"
              />
            </div>
            <button className="bg-white text-black font-semibold font-ubuntu rounded-full px-6 py-2 hover:bg-gray-100">
              Subscribe to Email
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
