import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [openProduct, setOpenProduct] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-[97px] left-0 h-screen w-64 bg-gray-300 shadow-2xl overflow-y-auto z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:block`}
      >
        {/* Hamburger inside sidebar (Top Right) */}
        <div className="flex justify-end items-center p-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-black md:hidden"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Links with spacing */}
        <nav className="space-y-1.5">
          <Link
            to="dashboard"
            className="flex items-center gap-2 text-[14px] font-ubuntu text-black hover:bg-gray-400 rounded px-3 py-2 mx-2"
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </Link>

          {/* Product Dropdown */}
          <div>
            <div
              onClick={() => setOpenProduct(!openProduct)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-400 rounded px-3 py-2 mx-2"
            >
              <div className="flex items-center gap-2">
                <CubeIcon className="h-5 w-5 text-black" />
                <span className="text-black font-ubuntu text-[14px]">Product</span>
              </div>
              {openProduct ? (
                <ChevronUpIcon className="h-5 w-5 text-black" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-black" />
              )}
            </div>
            {openProduct && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="product/add"
                  className="block text-black font-ubuntu text-[14px] hover:bg-gray-400 rounded px-3 py-2 mx-2"
                >
                  Add Product
                </Link>
                <Link
                  to="product/product-list"
                  className="block text-black font-ubuntu text-[14px] hover:bg-gray-400 rounded px-3 py-2 mx-2"
                >
                  Product List
                </Link>
              </div>
            )}
          </div>

          <Link
            to="orders"
            className="flex items-center gap-2 font-ubuntu text-[14px] text-black hover:bg-gray-400 rounded px-3 py-2 mx-2"
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Orders
          </Link>

          <Link
            to="users"
            className="flex items-center gap-2 font-ubuntu text-[14px] text-black hover:bg-gray-400 rounded px-3 py-2 mx-2"
          >
            <UsersIcon className="h-5 w-5" />
            Users
          </Link>

          <Link
            to="settings"
            className="flex items-center gap-2 font-ubuntu text-[14px] text-black hover:bg-gray-400 rounded px-3 py-2 mx-2"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Floating button (only visible when sidebar is closed on mobile) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-[107px] left-2 rounded-md text-black z-40"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
