import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { products } from '@/stripe-config';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useToast } from '@/components/ui/toast';

interface CheckoutPageProps {
  onNavigate?: (screen: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate = () => {} }) => {
  const { createCheckoutSession, loading, error } = useStripeCheckout();
  const { toast } = useToast();

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    try {
      await createCheckoutSession({
        priceId,
        mode,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: 'Failed to start checkout process. Please try again.'
      });
    }
  };

  return (
    <Layout
      title="Checkout"
      onBack={() => onNavigate?.('discovery') || (window.location.href = '/app')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-white/80">Select a plan that works for you</p>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-green-600 text-sm">
            Your payment is processed securely through Stripe with 256-bit SSL encryption.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Products */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-white/80 text-sm">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">C$1.00</p>
                  <p className="text-white/60 text-sm">
                    {product.mode === 'subscription' ? 'per month' : 'one-time'}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(product.priceId, product.mode)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    {product.mode === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Security */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-3">Payment Security</h3>
          <div className="space-y-2 text-white/80 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Secure payment processing by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};