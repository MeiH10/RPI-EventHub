import React from 'react';
import { Link } from 'react-router-dom';

// This is the custom 404 page displayed for unmatched routes
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg text-center">
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
        >
          ⬅️ Return to EventHub Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
