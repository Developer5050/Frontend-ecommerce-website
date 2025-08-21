import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 mr-4 font-ubuntu">404</h1>
        <h2 className="text-2xl sm:text-2xl font-semibold text-gray-800 mb-2 font-ubuntu">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6 font-ubuntu">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-2 font-ubuntu rounded-sm text-sm sm:text-base hover:bg-gray-800 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
