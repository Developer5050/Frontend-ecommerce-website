import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import api from "../../../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete order. Please try again.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/update-status/${orderId}`, {
        currentStatus: newStatus,
      });

      // Update order in local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, currentStatus: newStatus } : order
        )
      );

      setSelectedOrder((prev) =>
        prev?._id === orderId ? { ...prev, currentStatus: newStatus } : prev
      );
    } catch (err) {
      console.error("Error updating order status", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatStatus = (status) => {
    return status
      ? status
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : "N/A";
  };

  const formatPaymentMethod = (method) => {
    return method
      ? method
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : "N/A";
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:ml-56 flex justify-center items-center min-h-64">
        <p className="text-gray-600 font-ubuntu">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:ml-56 flex justify-center items-center min-h-64">
        <p className="text-red-600 font-ubuntu">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:ml-56">
      <h2 className="text-xl font-bold font-ubuntu mb-6">All Orders</h2>

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full text-sm text-left border font-ubuntu mt-1">
          <thead className="bg-black">
            <tr className="text-center">
              <th className="px-4 py-2 border text-white text-[16px]">Image</th>
              <th className="px-4 py-2 border text-white text-[16px]">Title</th>
              <th className="px-4 py-2 border text-white text-[16px]">Price</th>
              <th className="px-4 py-2 border text-white text-[16px]">
                Quantity
              </th>
              <th className="px-4 py-2 border text-white text-[16px]">
                Status
              </th>
              <th className="px-4 py-2 border text-white text-[16px]">
                Payment
              </th>
              <th className="px-4 py-2 border text-white text-[16px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) =>
                order.items?.map((item, index) => (
                  <tr
                    key={`${order._id}-${item.productId || index}`}
                    className="text-center hover:bg-gray-50"
                  >
                    <td className="p-2 border">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_API_URL}/uploads/${
                                item.image
                              }`
                        }
                        alt={item.name}
                        onError={(e) =>
                          (e.target.src = "/images/placeholder.png")
                        }
                        className="w-16 h-16 object-cover mx-auto rounded"
                      />
                    </td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">${item.price}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">
                      <select
                        value={order.currentStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      >
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PAID">Paid</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      {formatPaymentMethod(order.payment?.method)}
                    </td>
                    <td className="p-4 border">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-black hover:text-gray-800 text-xl"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-red-600 hover:text-red-700 text-xl"
                          title="Delete Order"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-md p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative font-ubuntu">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Customer Information</h3>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {formatStatus(selectedOrder.currentStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.customerInfo?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.customerInfo?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.customerInfo?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {formatPaymentMethod(selectedOrder.payment?.method)}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedOrder.shipping?.address?.street || "N/A"}
                  </p>
                  <p>
                    <strong>City:</strong>{" "}
                    {selectedOrder.shipping?.address?.city || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Ordered Items</h3>
              <ul className="divide-y">
                {selectedOrder.items?.map((item, i) => (
                  <li key={i} className="py-3 flex items-center gap-4">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${import.meta.env.VITE_API_URL}/uploads/${
                              item.image
                            }`
                      }
                      alt={item.name}
                      onError={(e) =>
                        (e.target.src = "/images/placeholder.png")
                      }
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
