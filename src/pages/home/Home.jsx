import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [activeTab]);

  // ✅ Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;

      if (activeTab === "orders" && userId) {
        setLoading(true);
        setError("");
        try {
          const res = await api.get(`/api/orders/my-orders/${userId}`);
          setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders. Please try again.");
          setOrders([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    // Clear user-related data but keep tokens for potential reuse
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    navigate("/login");
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-10 flex flex-col items-center">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 w-full max-w-6xl mt-8 sm:mt-16">
        <button
          className={`px-5 py-2 rounded font-ubuntu text-sm sm:text-base ${
            activeTab === "dashboard" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-5 py-2 rounded font-ubuntu text-sm sm:text-base ${
            activeTab === "orders" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className="px-5 py-2 rounded font-ubuntu text-sm sm:text-base bg-black hover:bg-gray-700 text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-7xl space-y-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="bg-white p-4 sm:p-6 border border-gray-500 rounded shadow-lg space-y-4">
            <h2 className="text-xl font-bold font-ubuntu">Dashboard</h2>
            {user ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border font-ubuntu">
                  <thead className="bg-black text-white text-xs sm:text-sm">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border">{user.name}</td>
                      <td className="p-2 border">{user.email}</td>
                      <td className="p-2 border">
                        {user.role === 1 ? "Admin" : "User"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 font-ubuntu">
                No user data found. Please login.
              </p>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white p-4 sm:p-6 border border-gray-500 rounded shadow-lg space-y-4">
            <h2 className="text-xl font-bold font-ubuntu">Your Orders</h2>

            {loading ? (
              <p className="text-gray-600 font-ubuntu">Loading orders...</p>
            ) : error ? (
              <p className="text-red-600 font-ubuntu">{error}</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600 font-ubuntu">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border font-poppins">
                  <thead className="bg-gray-100 text-xs sm:text-sm">
                    <tr>
                      <th className="p-2 border">Order ID</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Payment</th>
                      <th className="p-2 border">Item</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <React.Fragment key={order._id || index}>
                        {order.items?.map((item, idx) => (
                          <tr key={`${order._id}-${idx}`}>
                            <td className="p-2 border">
                              {idx === 0 ? `Order ${index + 1}` : ""}
                            </td>
                            <td className="p-2 border">
                              {idx === 0
                                ? formatStatus(order.currentStatus)
                                : ""}
                            </td>
                            <td className="p-2 border">
                              {idx === 0
                                ? formatPaymentMethod(order.payment?.method)
                                : ""}
                            </td>
                            <td className="p-2 border">{item.name}</td>
                            <td className="p-2 border">{item.quantity}</td>
                            <td className="p-2 border">$ {item.price}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
