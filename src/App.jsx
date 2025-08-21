import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import TermAndConditions from "./pages/term&conditions/TermAndConditions";
import ShippingPolicy from "./pages/shippingPolicy/ShippingPolicy";
import RefundPolicy from "./pages/refund&returnPolicy/RefundPolicy";
import Contact from "./pages/contact/Contact";
import ProductDetail from "./pages/productDetail/ProductDetail";
import Main from "./components/main/Main";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Proflie";
import WishListPage from "./pages/wishListPage/WishListPage";
import ProtectedAdminRoute from "./components/protectedAdminRoute/adminRoute";
import Layout from "./pages/adminDashboard/Layout"; // This is your admin layout
const Dashboard = React.lazy(() =>
  import("./pages/adminDashboard/pages/Dashboard")
);
import AllProduct from "./pages/allProduct/AllProduct";
import AddProduct from "./pages/adminDashboard/pages/products/AddProduct";
import ProductList from "./pages/adminDashboard/pages/products/ProductList";
import Orders from "./pages/adminDashboard/pages/Orders";
import Users from "./pages/adminDashboard/pages/Users";
import Settings from "./pages/adminDashboard/pages/Settings";
import Cart from "./pages/cart/Cart";
import Billing from "./pages/billing/Billing";
import Men from "./pages/men/Men";
import Women from "./pages/women/Women";
import Kid from "./pages/kid/Kid";
import OrderConfirmed from "./pages/orderConfirmed/OrderConfirmed";
import NotFound from "./pages/notFound/NotFound";
import { ToastContainer } from "react-toastify";
import SuccessPage from "./pages/successPage/SuccessPage";
import GoogleAuthRedirect from "./pages/googleRedirect/GoogleRedirect";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import { setUser } from "./slices/AuthSlice";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("cartItems");
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kid" element={<Kid />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermAndConditions />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/google-redirect" element={<GoogleAuthRedirect />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={<AllProduct searchQuery={searchQuery} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="/404" element={<NotFound />} />

          {/* Admin Dashboard with nested routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <Layout />
              </ProtectedAdminRoute>
            }
          >
            {/* Redirect /admin-dashboard to /admin-dashboard/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route path="product/add" element={<AddProduct />} />
            <Route path="product/product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  );
};

export default App;
