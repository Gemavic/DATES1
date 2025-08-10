import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { useAuth } from '@/hooks/useAuth';

interface SuccessPageProps {
  onNavigate?: (screen: string) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onNavigate = () => {} }) => {
  const { user } = useAuth();
  const [creditsAdded, setCreditsAdded] = React.useState<number>(0);
  const [packageName, setPackageName] = React.useState<string>('');

  useEffect(() => {
    // Parse URL parameters to determine purchased package
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    
    if (packageId && user) {
      // Get package details and add credits
      const packages = creditManager.getCreditPackages();
      const purchasedPackage = packages.find(p => p.id === packageId);
      
      if (purchasedPackage) {
        const totalCredits = purchasedPackage.credits + (purchasedPackage.bonus || 0);
        creditManager.addCredits(
          user.id || 'current-user',
          totalCredits,
          `Purchased ${purchasedPackage.name}`,
          true
        );
        
        setCreditsAdded(totalCredits);
        setPackageName(purchasedPackage.name);
      }
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            {creditsAdded > 0 
              ? `${formatCredits(creditsAdded)} have been added to your account!`
              : 'Your credits have been added to your account and are ready to use.'
            }
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">
              {packageName || 'Purchase'} Complete
            </span>
          </div>
          {creditsAdded > 0 && (
            <div className="text-center mb-2">
              <span className="text-2xl font-bold text-green-700">{formatCredits(creditsAdded)}</span>
              <p className="text-green-600 text-sm">Added to your account</p>
            </div>
          )}
          <p className="text-green-700 text-sm">
            Your credits are now available for chatting, messaging, and connecting with amazing people.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate?.('discovery') || (window.location.href = '/app')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onNavigate?.('credits') || (window.location.href = '/credits')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            View Credit Balance
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full text-gray-500 py-2 px-6 rounded-lg hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
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