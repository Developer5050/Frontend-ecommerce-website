import React, { useState } from "react";
import api from "../../../../../api/axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    stock: "",
    discount: "",
    rating: "",
    featured: false,
    isNewArrival: false,
    isTopProduct: false,
    category: "",
    subCategory: "",
    color: [],
    size: [],
  });

  const [image, setImage] = useState(null);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.color.includes(colorInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        color: [...prev.color, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (col) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter((c) => c !== col),
    }));
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.size.includes(sizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        size: [...prev.size, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const handleRemoveSize = (sz) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size.filter((s) => s !== sz),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => data.append(key, val));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) {
      data.append("image", image);
    }

    try {
      await api.post(
        "/api/products/add-product",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product added successfully!");

      // Reset
      setFormData({
        title: "",
        desc: "",
        price: "",
        stock: "",
        discount: "",
        rating: "",
        featured: false,
        isNewArrival: false,
        isTopProduct: false,
        category: "",
        subCategory: "",
        color: [],
        size: [],
      });
      setImage(null);
      setColorInput("");
      setSizeInput("");
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert("Failed to Add Product");
    }
  };

  const subCategories = {
    Men: ["T-Shirts", "Shoes", "Jeans", "Jackets"],
    Women: ["Dress", "Heels", "HandBags", "Watches", "Tops"],
    Kids: ["KidShirts", "Shorts", "Pants"],
  };

  return (
    <div className="p-5 md:ml-60 mt-6 sm:mt-10">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-ubuntu mb-3 md:text-left">
        Add Product
      </h2>

      <div className="max-w-3xl sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-2">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm sm:text-md font-medium text-gray-700 mb-1 font-ubuntu">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm sm:text-md font-medium text-gray-700 mb-1 font-ubuntu">
              Description
            </label>
            <textarea
              name="desc"
              placeholder="Description"
              value={formData.desc}
              onChange={handleChange}
              className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                min="0"
                onChange={handleChange}
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                min="0"
                onChange={handleChange}
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
                required
              />
            </div>
          </div>

          {/* Discount & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
                Discount
              </label>
              <input
                type="number"
                name="discount"
                placeholder="Discount (%)"
                value={formData.discount}
                min="0"
                onChange={handleChange}
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                min="0"
                onChange={handleChange}
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 text-sm font-ubuntu">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                onChange={handleChange}
                checked={formData.featured}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                onChange={handleChange}
                checked={formData.isNewArrival}
              />
              New Arrival
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isTopProduct"
                onChange={handleChange}
                checked={formData.isTopProduct}
              />
              Top Product
            </label>
          </div>

          {/* Category & SubCategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-ubuntu">
            <select
              name="category"
              onChange={handleChange}
              value={formData.category}
              className="border p-2 rounded-sm text-sm"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>

            <select
              name="subCategory"
              onChange={handleChange}
              value={formData.subCategory}
              className="border p-2 rounded-sm text-sm"
              required
            >
              <option value="">Select Type</option>
              {subCategories[formData.category]?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Color Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
              Colors
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Enter color and press Add"
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-black text-white px-3 rounded-sm text-sm font-ubuntu"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.color.map((c) => (
                <span
                  key={c}
                  className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Size Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
              Sizes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Enter size and press Add"
                className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-black text-white px-3 rounded-sm text-sm font-ubuntu"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.size.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-ubuntu">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm border p-2 rounded-sm font-ubuntu"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-40 bg-black hover:bg-gray-800 text-white font-semibold text-sm font-ubuntu py-2 px-4 rounded-sm transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
