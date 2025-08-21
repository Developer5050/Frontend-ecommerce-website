import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  return role === "1" ? children : <Navigate to="/home" />;
};

export default ProtectedAdminRoute;
