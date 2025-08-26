import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products/get-all-products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/products/delete-product/${id}`);
      setProducts(products.filter((item) => item._id !== id));
      toast.success(res.data.message || "Product deleted");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  // Edit Product: Open Modal
  const handleEditClick = (prod) => {
    setSelectedProduct(prod);
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await api.put(
        `/api/products/edit-product/${selectedProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Product updated!");
      handleCloseModal();

      // Optional: Refetch product list
      const res = await api.get("/api/products/get-all-products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Edit failed");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-14 lg:ml-56">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold font-ubuntu">Product List</h2>
        <button
          className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-sm font-ubuntu hover:bg-gray-800 transition text-sm"
          onClick={() => navigate("/admin-dashboard/product/add")}
        >
          <FiPlus className="text-lg" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full text-sm text-left border font-ubuntu mt-2">
          <thead className="bg-black">
            <tr className="text-center">
              <th className="px-4 py-2 border text-white text-[16px]">Image</th>
              <th className="px-4 py-2 border text-white text-[16px]">Title</th>
              <th className="px-4 py-2 border text-white text-[16px]">Price</th>
              <th className="px-4 py-2 border text-white text-[16px]">Stock</th>
              <th className="px-4 py-2 border text-white text-[16px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${
                      prod.image
                    }`}
                    alt={prod.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 border ">{prod.title}</td>
                <td className="px-4 py-2 border text-center">${prod.price}</td>
                <td className="px-4 py-2 border text-center">{prod.stock}</td>
                <td className="px-4 py-2 border space-x-2 text-center">
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleEditClick(prod)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(prod._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✏️ Edit Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 mt-10">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-md w-full max-w-lg space-y-4 relative"
          >
            <h2 className="text-2xl font-semibold font-ubuntu mb-2">
              Edit Product
            </h2>

            <div>
              <label
                className="block mb-1 font-ubuntu font-semibold"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                defaultValue={selectedProduct.title}
                placeholder="Title"
                className="border p-1.5 w-full rounded font-ubuntu"
              />
            </div>

            <div>
              <label
                className="block mb-1 font-ubuntu font-semibold"
                htmlFor="price"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                defaultValue={selectedProduct.price}
                placeholder="Price"
                type="number"
                className="border p-1.5 w-full rounded font-ubuntu"
              />
            </div>

            <div>
              <label
                className="block mb-1 font-ubuntu font-semibold"
                htmlFor="stock"
              >
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                defaultValue={selectedProduct.stock}
                placeholder="Stock"
                type="number"
                className="border p-1.5 w-full rounded font-ubuntu"
              />
            </div>

            <div>
              <label
                className="block mb-1 font-ubuntu font-semibold"
                htmlFor="image"
              >
                Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="border p-1.5 w-full rounded font-ubuntu"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-1 rounded font-ubuntu"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 font-ubuntu"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
