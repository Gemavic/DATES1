import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Coins,
  Heart,
  Crown
} from 'lucide-react';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useToast } from '@/components/ui/toast';
import { creditManager, CreditPackage, formatPrice } from '@/lib/creditSystem';
import { useAuth } from '@/hooks/useAuth';

interface StripeCheckoutProps {
  package: CreditPackage;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  package: pkg,
  onSuccess,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createCheckoutSession, loading, error } = useStripeCheckout();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to make a purchase.'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create a custom price for the package
      await createCheckoutSession({
        priceId: pkg.id, // Using package ID as price ID for demo
        mode: 'payment',
        successUrl: `${window.location.origin}/success?package=${pkg.id}`,
        cancelUrl: `${window.location.origin}/cancel?package=${pkg.id}`
      });
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: 'Unable to start checkout process. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPackageIcon = () => {
    switch (pkg.type) {
      case 'credits': return Coins;
      case 'kobos': return Heart;
      case 'combo': return Crown;
      default: return CreditCard;
    }
  };

  const PackageIcon = getPackageIcon();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Secure Checkout</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Package Summary */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-4 text-white mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <PackageIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{pkg.name}</h4>
              <p className="text-sm opacity-90">{pkg.type === 'combo' ? 'Credits + Kobos' : pkg.type}</p>
            </div>
            {pkg.popular && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{pkg.credits}</p>
              <p className="text-xs opacity-80">Credits</p>
            </div>
            {pkg.bonus && (
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">+{pkg.bonus}</p>
                <p className="text-xs opacity-80">Bonus</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              {pkg.originalPrice && (
                <span className="text-lg line-through opacity-70">{formatPrice(pkg.originalPrice)}</span>
              )}
              <span className="text-3xl font-bold">{formatPrice(pkg.price)}</span>
            </div>
            {pkg.savings && (
              <p className="text-sm text-yellow-300 font-medium mt-1">{pkg.savings}</p>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
          <div className="space-y-2">
            {pkg.features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Payment by Stripe</span>
          </div>
          <ul className="text-green-600 text-sm space-y-1">
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant</li>
            <li>• Your card details are never stored</li>
            <li>• Industry-leading security standards</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Payment Error</span>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={loading || isProcessing}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading || isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay {formatPrice(pkg.price)} with Stripe
            </>
          )}
        </Button>

        {/* Alternative Payment Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Also accepting crypto payments and mobile wallets
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-gray-400">
          <div className="flex items-center space-x-1">
            <Lock className="w-4 h-4" />
            <span className="text-xs">SSL Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs">PCI Compliant</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};