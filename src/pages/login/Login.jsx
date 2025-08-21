import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../slices/AuthSlice";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/user/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

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
    }
  };

  // Google login button
  const handleGoogleLogin = () => {
    // Redirect user to backend Google OAuth endpoint
    window.location.href = "http://localhost:8080/user/auth/google";
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-80 flex items-center justify-center mt-14 px-3 sm:px-6 md:mt-11 lg:px-8">
      <div className="bg-white border border-gray-300 p-5 md:w-80 md:px-5 sm:px-7 sm:mt-8 rounded-xl shadow-xl w-96 max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
        <p className="text-sm text-gray-500">
          Sign in to access your Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 mt-2 flex items-center text-gray-500">
                <Mail size={14} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="mt-2 w-full px-7 py-1.5 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 mt-3 flex items-center text-gray-500">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="mt-2 w-full pl-7 px-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 cursor-pointer text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
          </div>

          <div
            className="relative bottom-3 text-right text-sm cursor-pointer text-blue-600"
            onClick={handleForgotPassword}
          >
            Forget Password?
          </div>

          <motion.button
            type="submit"
            className="relative bottom-3 w-full font-semibold bg-black text-white py-1.5 rounded-md hover:bg-gray-800 transition duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Login
          </motion.button>
        </form>

        <p className="text-[13px] text-center text-gray-600 ">
          Don't have an account?
          <Link
            to="/signup"
            className="text-black text-sm font-bold ml-1 hover:underline font-sans "
          >
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center mt-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-xs text-gray-500">Or login with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-between mt-4 space-x-2">
          {/* Google */}
          <button
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-full hover:bg-gray-100"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-xs">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
