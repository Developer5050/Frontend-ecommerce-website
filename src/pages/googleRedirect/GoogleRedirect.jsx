import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/AuthSlice";
import { toast } from "react-toastify";

const GoogleRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const avatar = searchParams.get("avatar");

    if (accessToken && refreshToken && userId) {
      // Save tokens and user info in localStorage
      const user = { id: userId, name, email, role: parseInt(role), avatar };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      // Update Redux state
      dispatch(setUser(user));
      toast.success("Google login successful!");

      // Redirect user
      navigate(user.role === 1 ? "/admin-dashboard" : "/");
    } else {
      toast.error("Google login failed!");
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <div>Logging you in via Google...</div>;
};

export default GoogleRedirect;
