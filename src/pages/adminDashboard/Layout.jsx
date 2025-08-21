import React from "react";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1  flex flex-col min-h-screen bg-gray-100">
        {/* Navbar hamesha top pe */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
