import React from "react";
import BannerImage from "/images/image.png";
import Product from "../products/Products";
import TopProduct from "../topProduct/TopProduct";
import { MdOutlineEmail } from "react-icons/md";
import Footer from "../footer/Footer";

const Main = () => {

  return (
    <div className="w-full overflow-x-hidden mt-12">
      {/* Banner Section */}
      <div className="relative h-[75vh] sm:h-[80vh] md:h-[90vh] w-full">
        <img
          src={BannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="bg-white/90 p-4 sm:p-6 rounded-lg max-w-xl z-10 w-full">
            <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold font-serif mb-3">
              Welcome to Our Shop
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-serif mb-4">
              Discover exclusive deals on fashion, electronics, and more. Shop
              now and enjoy 20% off your first order!
            </p>
            <a href="#new-arrivals">
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-gray-800 transition">
                Shop Now
              </button>
            </a>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="text-center w-full">
                <p className="text-xl sm:text-2xl font-bold">200+</p>
                <p className="text-xs text-gray-600 mt-1">
                  International Brands
                </p>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-400" />

              <div className="text-center w-full">
                <p className="text-xl sm:text-2xl font-bold">2,000+</p>
                <p className="text-xs text-gray-600 mt-1">
                  High-Quality Products
                </p>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-400" />

              <div className="text-center w-full">
                <p className="text-xl sm:text-2xl font-bold">30,000+</p>
                <p className="text-xs text-gray-600 mt-1">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-12 px-4 sm:px-6 md:px-12 lg:px-20">
        <Product />
      </div>

      {/* Top Products */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-10">
        <TopProduct />
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-black text-white rounded-xl px-4 py-8 mt-10 mx-4 sm:mx-6 md:mx-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left text-lg sm:text-xl font-extrabold font-ubuntu leading-tight w-full md:w-[48%]">
            STAY UP TO DATE <br className="hidden sm:block" />
            ABOUT OUR LATEST OFFERS
          </div>

          <div className="w-full md:w-[48%] flex flex-col gap-2">
            <div className="flex items-center bg-white rounded-full py-2 px-3">
              <MdOutlineEmail className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-black text-sm sm:text-base font-ubuntu outline-none bg-transparent"
              />
            </div>
            <button className="bg-white text-black font-semibold font-ubuntu rounded-full px-6 py-2 text-sm sm:text-base hover:bg-gray-100 transition">
              Subscribe to Email
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Main;
