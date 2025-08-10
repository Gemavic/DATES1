import React from 'react';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

interface CancelPageProps {
  onNavigate?: (screen: string) => void;
}

export const CancelPage: React.FC<CancelPageProps> = ({ onNavigate = () => {} }) => {
  const [packageName, setPackageName] = React.useState<string>('');

  useEffect(() => {
    // Parse URL parameters to show which package was cancelled
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    
    if (packageId) {
      // Get package name for display
      const packages = [
        { id: 'starter', name: 'Starter Pack' },
        { id: 'popular', name: 'Popular Pack' },
        { id: 'premium', name: 'Premium Pack' },
        { id: 'ultimate', name: 'Ultimate Combo' }
      ];
      
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setPackageName(pkg.name);
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Cancel Animation */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            {packageName 
              ? `Your ${packageName} purchase was cancelled.`
              : 'No charges were made to your account.'
            }
          </p>
        </div>

        {/* Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-3">What Happened?</h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You cancelled the payment process</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>No payment was processed</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Your account remains unchanged</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => onNavigate?.('credits') || (window.location.href = '/credits')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={() => onNavigate?.('discovery') || (window.location.href = '/app')}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Having trouble with payment?
          </p>
          <p className="text-gray-600 text-sm">
            Contact support: <a href="mailto:support@dates.care" className="text-blue-600 hover:underline">support@dates.care</a>
          </p>
        </div>
      </div>
    </div>
  );
};