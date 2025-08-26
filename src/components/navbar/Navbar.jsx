import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LuShoppingCart } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist } from "../../slices/WishListSlice";
import { FaRegUser } from "react-icons/fa";
import { Heart } from "lucide-react";
import api from "../../../api/axios";

const Dropdown = ({ title, items, mobile }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const routeMap = {
    Product: "/products",
    Cart: "/cart",
    Checkout: "/billing",
    "Contact Us": "/contact",
    "404 Not Found": "/not-found",

    "T-Shirts": "/men",
    Jeans: "/men",
    Jackets: "/men",
    Shoes: "/men",
    Watch: "/men",

    Tops: "/women",
    Dress: "/women",
    Heels: "/women",
    Handbags: "/women",
    Watches: "/women",

    Shorts: "/kid",
    Pants: "/kid",
    KidShirts: "/kid",
  };

  const handleItemClick = (item) => {
    if (item === "Product") {
      navigate("/products");
    }
    setOpen(false);
  };

  return (
    <div
      className={`relative ${mobile ? "w-full" : ""}`}
      onMouseEnter={!mobile ? () => setOpen(true) : undefined}
      onMouseLeave={!mobile ? () => setOpen(false) : undefined}
    >
      <button
        className="flex items-center justify-between w-full hover:text-gray-700"
        onClick={mobile ? () => setOpen(!open) : undefined}
      >
        <Link
          to={title === "Pages" ? "/products" : `/${title.toLowerCase()}`}
          className="hover:text-gray-700 w-full text-left"
        >
          {title}
        </Link>
        <ChevronDownIcon className="w-4 h-4 mt-[3px]" />
      </button>

      {open && (
        <div
          className={`${
            mobile
              ? "mt-1 space-y-1 pl-4"
              : "absolute top-full left-0 w-40 bg-white shadow-xl rounded-md p-2 z-50"
          }`}
        >
          {items.map((item, index) => {
            const path = routeMap[item] || "#";
            const isStaticPage = [
              "Product",
              "Cart",
              "Checkout",
              "Contact Us",
              "notFound",
            ].includes(item);

            return (
              <Link
                key={index}
                to={
                  item === "Product"
                    ? "/products"
                    : isStaticPage
                    ? path
                    : `${path}?subCategory=${item}`
                }
                className={`block text-sm hover:bg-gray-300 hover:text-black transition duration-150 rounded-sm ${
                  mobile ? "py-1" : "px-4 py-2"
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const wishlist = useSelector((state) => state.wishlist.products || []);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) dispatch(fetchWishlist(userInfo.id));
  }, [userInfo, dispatch]);

  const cartCount = cartItems.length;
  const isAdmin = location.pathname.startsWith("/admin-dashboard");
  const hideMenu =
    location.pathname === "/login" || location.pathname === "/signup";

  // ✅ Update username when location changes (login/logout)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
      setUserRole(storedUser.role);
    } else {
      setUserName(null);
      setUserRole(null);
    }
  }, [location.pathname]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Call logout API endpoint
      await api.post("/user/auth/logout");

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      // Close profile dropdown
      setProfileOpen(false);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav
      className="bg-gray-300 shadow-md px-3 sm:px-6 py-3 fixed top-13 left-0 w-full z-50"
      style={{ height: "62px" }}
    >
      <div className="flex items-center justify-between">
        {/* Mobile Toggle */}
        {!isAdmin && (
          <div className="md:hidden ml-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative right-4"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        <Link
          to="/"
          className="text-[17px] mb-1.5 md:-mb-0.5 mr-3 sm:text-xl sm:ml-3 font-bold font-ubuntu"
        >
          SHOP.CO
        </Link>

        {/* Desktop Menu */}
        {!isAdmin && !hideMenu && (
          <div className="hidden md:flex gap-8 text-sm font-medium items-center font-ubuntu">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <Dropdown
              title="Pages"
              items={[
                "Product",
                "Cart",
                "Checkout",
                "Contact Us",
                "404 Not Found",
              ]}
            />
            <Dropdown
              title="Men"
              items={["T-Shirts", "Jeans", "Jackets", "Shoes"]}
            />
            <Dropdown
              title="Women"
              items={["Dress", "Heels", "Handbags", "Watches", "Tops"]}
            />
            <Dropdown title="Kid" items={["Shorts", "Pants", "KidShirts"]} />
          </div>
        )}

        {/* Search & Icons */}
        <div className="flex items-center gap-3 mr-5">
          <div className="relative hidden md:block w-full md:w-72">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.5a7.5 7.5 0 010 14.15z"
                />
              </svg>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="pl-8 pr-2 py-1 border border-gray-500 rounded-2xl text-sm w-full font-ubuntu"
            />
          </div>

          <div
            className="relative left-1 bottom-0.5 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <LuShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount || 0}
              </span>
            )}
          </div>

          <Link to="/wishlist" className="relative bottom-0.5">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length || 0}
              </span>
            )}
          </Link>

          {/* Profile Section */}
          <div
            className="relative left-1 bottom-1 mt-2 right-4"
            ref={profileRef}
          >
            <div className="flex items-center gap-3">
              {userName ? (
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FaRegUser className="w-3.5 h-3.5 mb-1 sm:w-4 sm:h-4 " />
                  <h3 className="font-ubuntu mb-1 text-black text-[11px] sm:text-[15px]">
                    {userName}
                  </h3>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <FaRegUser className="w-3.5 h-3.5 mb-1" />
                      <h3 className="font-ubuntu mb-1 text-black text-[14px]">
                        Login
                      </h3>
                    </div>
                  </Link>
                  <Link to="/signup">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <FaRegUser className="w-3.5 h-3.5 mb-1" />
                      <h3 className="font-ubuntu mb-1 text-black text-[14px]">
                        SignUp
                      </h3>
                    </div>
                  </Link>
                </>
              )}
            </div>

            {profileOpen && userName && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {userRole === 1 ? (
                  <Link
                    to="/admin-dashboard"
                    className="w-full block py-2 font-ubuntu text-sm text-gray-700 hover:bg-gray-300 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    <div className="px-4">Dashboard</div>
                  </Link>
                ) : (
                  <Link
                    to="/home"
                    className="w-full block py-2 font-ubuntu text-sm text-gray-700 hover:bg-gray-300 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    <div className="px-4">Home</div>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="w-full block py-2 font-ubuntu text-sm text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="px-4">Profile</div>
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left py-2 font-ubuntu text-sm text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <div className="px-4">
                    {loggingOut ? "Logging out..." : "Logout"}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {!isAdmin && mobileMenuOpen && (
        <div className="mt-3 flex flex-col gap-3 bg-gray-300 shadow-md md:hidden text-sm font-medium font-ubuntu rounded-lg p-4">
          <Link to="/">Home</Link>
          <Dropdown
            title="Pages"
            items={[
              "Product",
              "Cart",
              "Checkout",
              "Contact Us",
              "404 Not Found",
            ]}
            mobile
          />
          <Dropdown
            title="Men"
            items={["T-Shirts", "Jackets", "Jeans", "Shoes"]}
            mobile
          />
          <Dropdown
            title="Women"
            items={["Dress", "Heels", "Handbags", "Watches", "Tops"]}
            mobile
          />
          <Dropdown
            title="Kid"
            items={["KidShirts", "Shorts", "Pants"]}
            mobile
          />

          {/* Search Input with Icon */}
          <div className="relative w-full mt-2">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.5a7.5 7.5 0 010 14.15z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="pl-8 pr-2 py-2 border border-gray-300 rounded-lg font-ubuntu text-sm w-full"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
