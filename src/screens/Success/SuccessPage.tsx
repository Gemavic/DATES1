import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your credits have been added to your account and are ready to use.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">Transaction Complete</span>
          </div>
          <p className="text-green-700 text-sm">
            Your credits are now available for chatting, messaging, and connecting with amazing people.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/app"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/credits"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            View Credit Balance
          </Link>
          
          <Link
            to="/"
            className="w-full text-gray-500 py-2 px-6 rounded-lg hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team anytime.
          </p>
        </div>
      </div>
    </div>
  );
};