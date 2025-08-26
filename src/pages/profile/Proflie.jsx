import React, { useEffect, useState } from "react";
import { setUser } from "../../slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axios";

const Profile = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = token || localStorage.getItem("accessToken");
        const storedUser = user || JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          setFormData({
            name: storedUser.name || "",
            email: storedUser.email || "",
          });
          setLoading(false);
          return;
        }

        if (!storedToken) {
          console.warn("⚠ No token found");
          setMessage("Please log in to view your profile");
          setLoading(false);
          return;
        }

        const res = await api.get("/user/auth/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        dispatch(setUser({ ...res.data, token: storedToken }));
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch profile", err);
        setMessage(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, token, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setUpdating(true);

    try {
      const storedToken = token || localStorage.getItem("accessToken");

      const res = await api.put(
        "/user/auth/update-profile",
        { name: formData.name, email: formData.email },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      setMessage(res.data.message || "✅ Profile updated successfully");

      dispatch(setUser({ ...res.data.user, token: storedToken }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data.user, token: storedToken })
      );
    } catch (err) {
      console.error("❌ Update failed", err);
      setMessage(
        err.response?.data?.message || "❌ Update failed. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 mt-24 border border-gray-300 rounded-lg shadow-md bg-white">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-20 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update Profile
      </h2>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={updating}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={updating}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={updating}
        >
          {updating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${
            message.includes("✅") || message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Profile;
