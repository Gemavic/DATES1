import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Lock, Coins, Heart, Crown, Star } from 'lucide-react';
import { creditManager, formatPrice } from '@/lib/creditSystem';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useToast } from '@/components/ui/toast';

interface CheckoutPageProps {
  onNavigate?: (screen: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate = () => {} }) => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();
  
  const creditPackages = creditManager.getCreditPackages();

  const handlePurchase = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
    onNavigate?.('discovery');
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'credits': return Coins;
      case 'kobos': return Heart; 
      case 'combo': return Crown;
      default: return CreditCard;
    }
  };

  const getPackageGradient = (type: string) => {
    switch (type) {
      case 'credits': return 'from-blue-500 to-cyan-500';
      case 'kobos': return 'from-pink-500 to-rose-500';
      case 'combo': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600">
      <div className="max-w-4xl mx-auto min-h-screen relative p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-white/80 text-lg">Select a credit package that works for you</p>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Payment by Stripe</span>
          </div>
          <p className="text-green-600 text-sm">
            Your payment is processed securely with 256-bit SSL encryption and PCI DSS compliance.
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {creditPackages.map((pkg) => {
            const Icon = getPackageIcon(pkg.type);
            const gradient = getPackageGradient(pkg.type);
            
            return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300 ${
                pkg.popular ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    🔥 MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {pkg.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(pkg.originalPrice)}</span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                  </div>
                  {pkg.savings && (
                    <span className="text-sm text-green-600 font-medium">{pkg.savings}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePurchase(pkg)}
                className={`w-full bg-gradient-to-r ${gradient} text-white font-semibold hover:scale-105 transition-all duration-300`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Purchase Now
              </Button>
            </div>
            );
          })}
        </div>

        {/* Payment Security Footer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-white font-semibold text-lg mb-4 text-center">Payment Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <div>
                <p className="text-white font-medium">256-bit SSL</p>
                <p className="text-white/70 text-xs">Bank-level encryption</p>
              </div>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <div>
                <p className="text-white font-medium">PCI Compliant</p>
                <p className="text-white/70 text-xs">Industry standards</p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              <div>
                <p className="text-white font-medium">Stripe Secure</p>
                <p className="text-white/70 text-xs">Trusted by millions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Button
            onClick={() => onNavigate?.('discovery') || (window.location.href = '/app')}
            className="bg-white/20 text-white hover:bg-white/30 transition-colors px-8 py-3"
          >
            ← Back to App
          </Button>
        </div>

        {/* Stripe Checkout Modal */}
        {showCheckout && selectedPackage && (
          <StripeCheckout
            package={selectedPackage}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </div>
    </div>
  );
};