import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, FolderPen, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";


const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 0, //
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/user/auth/register",
        formData
      );

      // ✅ Console full response data
      console.log("Signup Success ✅:", res.data);

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("Registration Successffully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-22rem)] mt-6 flex items-center justify-center px-6 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-300 py-3 px-3 mt-10 sm:mt-12 md:w-80  md:px-5 sm:px-7 rounded-xl shadow-xl w-full max-w-md">
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
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
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
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
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
                className="w-full pl-7 pr-10 py-2 text-sm border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-3 h-3 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              I agree with the
              <span className="text-blue-600 hover:underline cursor-pointer ml-1">
                Terms and Conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full font-semibold bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 text-sm"
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9}}
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-[13px] font-sans text-center text-gray-600 mt-3">
          Already have an account?
          <Link
            to="/login"
            className="text-black text-xs ml-1 font-bold hover:underline font-sans"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
