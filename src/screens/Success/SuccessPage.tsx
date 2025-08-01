import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Gift } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface SuccessPageProps {
  onNavigate: (screen: string) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onNavigate }) => {
  const { subscription, getProductName } = useSubscription();

  useEffect(() => {
    // Refresh subscription data when component mounts
    window.location.reload();
  }, []);

  return (
    <Layout
      title="Payment Successful"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-white/80 text-lg">Thank you for your purchase</p>
        </div>

        {/* Purchase Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Purchase Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Product:</span>
              <span className="text-white font-medium">
                {getProductName() || 'Care'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Amount:</span>
              <span className="text-white font-medium">C$1.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Status:</span>
              <span className="text-green-400 font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold text-lg mb-4">What's Next?</h3>
          <div className="space-y-3 text-white/80 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 mt-2"></div>
              <span>You now have access to premium therapy features</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 mt-2"></div>
              <span>Connect with professional therapists and counselors</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 mt-2"></div>
              <span>Access exclusive wellness content and resources</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => onNavigate('couple-therapy')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-4 h-4 mr-2" />
            Start Therapy Session
          </Button>
          
          <Button
            onClick={() => onNavigate('discovery')}
            className="w-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            Continue to App
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <p className="text-white/80 text-sm">
            support@dates.care • +1 (613) 861-5799
          </p>
        </div>
      </div>
    </Layout>
  );
};