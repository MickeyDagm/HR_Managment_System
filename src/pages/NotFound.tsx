import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | HR Management System</title>
      </Helmet>
      <div className=" flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-lg w-full bg-white shadow-2xl rounded-3xl px-8 py-12">
          <div className="flex justify-center mb-6">
            <div className="bg-[#72c02c]/10 p-4 rounded-full">
              <AlertTriangle className="h-10 w-10 text-[#72c02c]" />
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <NavLink
            to="/"
            className="inline-block bg-[#72c02c] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#5ea024] transition duration-300"
          >
            Back to Home
          </NavLink>
        <NavLink
        to="/help">
            <p className="text-md text-gray-400 mt-6 font-semibold hover:text-blue-500 hover:underline">
                Need help?
            </p>
        </NavLink>
        </div>
      </div>
    </>
  );
};

export default NotFound;
