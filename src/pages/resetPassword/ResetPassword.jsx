import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock } from "lucide-react";
import api from "../../../api/axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleReset = async (e) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const res = await api.post(
        `/user/auth/reset-password/${token}`,
        { newPassword }
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold font-ubuntu text-center mb-6 text-gray-800">
          Reset Your Password
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-ubuntu text-gray-700 mb-2 ml-0.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-1.5 pl-7 border border-gray-300 rounded-md font-ubuntu focus:outline-none focus:ring-2 focus:ring-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={6}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium font-ubuntu text-gray-700 mb-2 ml-0.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
                <Lock size={14} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-1.5 pl-7 border border-gray-300 rounded-md font-ubuntu focus:outline-none focus:ring-2 focus:ring-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={6}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md font-ubuntu hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;