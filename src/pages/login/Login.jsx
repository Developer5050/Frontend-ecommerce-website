import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../slices/AuthSlice";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      dispatch(setUser(user));
      toast.success("Login successful!");
      navigate(user.role === 1 ? "/admin-dashboard" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google login button - using relative path instead of hardcoded URL
  const handleGoogleLogin = () => {
    // Use relative path or environment variable instead of hardcoded URL
    window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/google`;
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 sm:py-8  mt-5 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-300 p-4 rounded-xl shadow-xl w-96 max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
        <p className="text-sm text-gray-500 mb-1">
          Sign in to access your Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full font-semibold bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?
          <Link
            to="/signup"
            className="text-black font-semibold ml-1 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-3">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-xs text-gray-500">Or login with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 w-full hover:bg-gray-50 transition-colors"
            onClick={handleGoogleLogin}
            type="button"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
