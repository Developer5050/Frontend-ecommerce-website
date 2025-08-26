import React, { useEffect, useState } from "react";
import api from "../../../../api/axios"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const filters = ["today", "weekly", "monthly"];

const Dashboard = () => {
  const [graphFilter, setGraphFilter] = useState("monthly");
  const [revenueData, setRevenueData] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get(
        "/api/dashboard/dashboard-stats"
      );
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await api.get("/api/orders");
        const usersRes = await api.get(
          "/api/users/customers"
        );

        const orders = res.data || [];
        const customers = usersRes.data.customers || [];

        const paidOrders = orders.filter(
          (order) => order.currentStatus?.toUpperCase() === "PAID"
        );

        const totalRevenue = paidOrders.reduce(
          (acc, order) => acc + Number(order.totalAmount || 0),
          0
        );

        const totalSales = paidOrders.length;
        const totalCustomers = customers.filter(
          (u) => u.role === "customer"
        ).length;

        let groupedData = {};
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

        paidOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const amount = Number(order.totalAmount || 0);

          if (graphFilter === "today") {
            if (orderDate.toDateString() === today.toDateString()) {
              const hour = orderDate.getHours();
              const key = `${hour}:00`;
              groupedData[key] = (groupedData[key] || 0) + amount;
            }
          } else if (graphFilter === "weekly") {
            if (orderDate >= startOfWeek) {
              const day = orderDate.toLocaleString("default", {
                weekday: "short",
              });
              groupedData[day] = (groupedData[day] || 0) + amount;
            }
          } else {
            const monthKey = `${orderDate.toLocaleString("default", {
              month: "short",
            })} ${orderDate.getFullYear()}`;
            groupedData[monthKey] = (groupedData[monthKey] || 0) + amount;
          }
        });

        const formattedData = Object.entries(groupedData).map(([key, val]) => ({
          period: key,
          current: val,
        }));

        setRevenueData(formattedData);
        setStats((prev) => ({
          ...prev,
          totalRevenue,
          totalSales,
          totalCustomers,
        }));
      } catch (err) {
        console.error("Failed to fetch revenue data", err);
      }
    };

    fetchRevenueData();
  }, [graphFilter]);

  return (
    <div className="p-3 md:p-4 space-y-6 md:ml-60 max-w-screen-xl mx-auto mt-8 md:mt-10">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-ubuntu text-gray-800 text-center md:text-left">
        Welcome Admin Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {[
          { title: "Completed Orders", value: stats.completedOrders, change: "14%" },
          { title: "Total Orders", value: stats.totalOrders, change: "17%" },
          { title: "Total Sales", value: `$${stats.totalSales}`, change: "14%" },
          { title: "Total Revenue", value: `$${stats.totalRevenue}`, change: "5%" },
          { title: "Total Customers", value: stats.totalCustomers, change: "5%" },
          { title: "Total Products", value: stats.totalProducts, change: "5%" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-center sm:text-left"
          >
            <p className="text-gray-500 text-xs sm:text-sm font-ubuntu">{item.title}</p>
            <h3 className="text-lg sm:text-xl font-semibold font-ubuntu">{item.value}</h3>
            <p className="text-xs sm:text-sm text-green-600 font-ubuntu">
              {item.change} in the last month
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Graph */}
      <div className="bg-white p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-gray-800 font-ubuntu">
              Revenue Overview
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 capitalize font-ubuntu">
              View performance for {graphFilter}
            </p>
          </div>
          <div className="text-xs sm:text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md font-medium font-ubuntu text-center">
            Total Revenue: ${Number(stats?.totalRevenue || 0)}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setGraphFilter(filter)}
              className={`px-3 sm:px-4 py-1 rounded-sm border text-xs sm:text-sm font-ubuntu font-medium capitalize transition-all duration-200 ${
                graphFilter === filter
                  ? "bg-green-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="w-full h-64 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="strokeColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="period" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0px 2px 12px rgba(0,0,0,0.05)",
                }}
                itemStyle={{ color: "#10B981" }}
                labelStyle={{ color: "#6B7280" }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="current"
                stroke="url(#strokeColor)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#fff", stroke: "#10B981", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
                name={`Revenue (${graphFilter})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
