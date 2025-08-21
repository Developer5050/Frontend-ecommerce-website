import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
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
        try {
          const res = await axios.get(
            `http://localhost:8080/api/orders/my-orders/${userId}`
          );
          setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setOrders([]);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    console.log("✅ After logout:");
    console.log("Access Token:", localStorage.getItem("accessToken"));
    console.log("Refresh Token:", localStorage.getItem("refreshToken"));

    navigate("/login");
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
            {orders.length === 0 ? (
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
                      <React.Fragment key={order._id}>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 border">
                              {idx === 0 ? `Order ${index + 1}` : ""}
                            </td>
                            <td className="p-2 border">
                              {idx === 0
                                ? order.currentStatus.replaceAll("_", " ")
                                : ""}
                            </td>
                            <td className="p-2 border">
                              {idx === 0
                                ? order.payment?.method?.replaceAll("_", " ") ||
                                  "N/A"
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
