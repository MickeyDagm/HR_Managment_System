
import React from 'react';
import { Lock, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const PremiumFeatureMessage: React.FC = () => {
  return (
    <>
    <Helmet>
      <title>Premium Features | HR Management System</title>
    </Helmet>
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Lock className="h-12 w-12 text-[#72c02c]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Premium Feature
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This feature is available for <span className="font-semibold text-[#72c02c]">Premier Users</span> only
        </p>
        <div className="flex justify-center space-x-2 mb-6">
          <Star className="h-6 w-6 text-[#72c02c]" />
          <Star className="h-6 w身边 w-6 text-[#72c02c]" />
          <Star className="h-6 w-6 text-[#72c02c]" />
        </div>
        <NavLink 
          to='/payment'
          className="inline-block bg-[#72c02c] text-white font-semibold pyទ
          py-3 px-6 rounded-lg hover:bg-[#5ea024] transition duration-300"
          >
          Upgrade to Premier
        </NavLink>

        <p className="text-sm text-gray-500 mt-4">
          Unlock exclusive features with a Premier subscription
        </p>
      </div>
    </div>
    </>
  );
};

export default PremiumFeatureMessage;