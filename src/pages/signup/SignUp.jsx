import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, FolderPen, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/auth/register", formData);
      console.log("Signup Success ✅:", res.data);

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("Registration Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-22rem)] mt-10 flex items-center justify-center px-6 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-300 py-3 px-3 mt-10 sm:mt-12 md:w-96 md:px-5 sm:px-7 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-1">
          Sign Up
        </h2>
        <h3 className="text-sm text-gray-500">
          Just a few quick things to get started
        </h3>

        <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium font-sans text-gray-800 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
                <FolderPen size={14} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-7 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.name ? "border-red-500" : "border-gray-400"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium font-sans text-gray-800 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
                <Mail size={14} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-7 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.email ? "border-red-500" : "border-gray-400"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium font-sans text-gray-800 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-7 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-3 h-3 text-black focus:ring-black border-gray-300 rounded cursor-pointer mt-1"
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              I agree with the
              <span className="text-blue-600 hover:underline cursor-pointer ml-1">
                Terms and Conditions
              </span>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full font-semibold bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-[14px] font-sans text-center text-gray-600 mt-3">
          Already have an account?
          <Link
            to="/login"
            className="text-black text-[14px] ml-1 font-bold hover:underline font-sans"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
