import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 w-full font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-600 mb-8" />

        {/* Grid layout for responsiveness */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
          {/* Left Side */}
          <div className="lg:w-1/3">
            <h1 className="text-2xl font-extrabold font-ubuntu mb-4">
              SHOP.CO
            </h1>
            <p className="text-white font-ubuntu mb-4">
              We have clothes that suit your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="flex gap-4 text-lg">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter className="hover:text-blue-400" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook className="hover:text-blue-500" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram className="hover:text-pink-500" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <FaGithub className="hover:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
            {/* PAGE */}
            <div>
              <h3 className="font-semibold text-white font-ubuntu mb-3">
                PAGE
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Home", path: "/" },
                  { label: "Product", path: "/products" },
                  { label: "Cart", path: "/cart" },
                  { label: "Checkout", path: "/billing" },
                  { label: "Contact Us", path: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (item.label === "Home") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="text-white hover:underline font-ubuntu hover:text-gray-400 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* HELP */}
            <div>
              <h3 className="font-semibold text-white font-ubuntu mb-3">
                HELP
              </h3>
              <ul className="space-y-2">
                {[
                  {
                    label: "Terms & Conditions",
                    path: "/terms-and-conditions",
                  },
                  { label: "Privacy Policy", path: "/privacy-policy" },
                  { label: "Shipping Policy", path: "/shipping-policy" },
                  { label: "Refund & Return Policy", path: "/refund-policy" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-white hover:underline font-ubuntu hover:text-gray-400 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-semibold font-ubuntu text-white mb-3">FAQ</h3>
              <ul className="space-y-2">
                {["Account", "Manage Deliveries", "Orders", "Payments"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-white  font-ubuntu hover:underline hover:text-gray-400 transition"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h3 className="font-semibold font-ubuntu text-white mb-3">
                RESOURCES
              </h3>
              <ul className="space-y-2">
                {[
                  "Free eBooks",
                  "Development Tutorial",
                  "How to - Blog",
                  "Youtube Playlist",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white font-ubuntu hover:underline hover:text-gray-400 transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
