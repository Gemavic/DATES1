import React, { useState } from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernCard } from '@/components/ModernCard';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Coins, 
  Heart as KoboIcon, 
  Star, 
  Crown, 
  Zap, 
  Gift, 
  TrendingUp, 
  Clock,
  MessageCircle,
  Mail,
  Image,
  Video,
  Heart,
  Bitcoin,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { creditManager, formatCredits, formatKobos, formatPrice } from '@/lib/creditSystem';
import { PaymentGateway } from '@/components/PaymentGateway';
import { securityManager, generateSecurityReport } from '@/lib/encryption';
import { DATES_CRYPTO_WALLETS } from '@/lib/cryptoWallets';

interface ModernCreditsProps {
  onNavigate: (screen: string) => void;
}

export const ModernCredits: React.FC<ModernCreditsProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'credits' | 'kobos' | 'combo'>('credits');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [securityReport, setSecurityReport] = useState<any>(null);
  
  const userData = creditManager.getUserData('current-user');
  const creditPackages = creditManager.getCreditPackages();
  const pricing = creditManager.getPricingStructure();
  const spendingOptions = creditManager.getSpendingOptions();
  
  // Generate security report
  React.useEffect(() => {
    const report = generateSecurityReport('current-user');
    setSecurityReport(report);
  }, []);

  const handlePurchase = async (packageId: string) => {
    const pkg = creditPackages.find(p => p.id === packageId);
    if (pkg) {
      console.log('Purchasing package:', pkg.name);
      setSelectedPackage(pkg);
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful');
    setShowPayment(false);
    setSelectedPackage(null);
    
    // Add credits to user account
    if (selectedPackage) {
      const totalCredits = selectedPackage.credits + (selectedPackage.bonus || 0);
      creditManager.addCredits('current-user', totalCredits, `Purchased ${selectedPackage.name}`, true);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = `✅ ${selectedPackage.name} purchased! ${totalCredits} credits added.`;
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 5000);
    }
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    setShowPayment(false);
    setSelectedPackage(null);
  };

  const filteredPackages = creditPackages.filter(pkg => 
    activeTab === 'combo' ? pkg.type === 'combo' : 
    activeTab === 'kobos' ? pkg.type === 'kobos' : pkg.type === activeTab
  );

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'credits': return Coins;
      case 'kobos': return KoboIcon;
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
    <ResponsiveLayout>
      <ModernHeader
        title="Credits & Kobos"
        showBack={true}
        onBack={() => onNavigate('discovery')}
        showNotifications={true}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6">
          {/* Current Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModernCard background="gradient" className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-white/80 text-sm">Complimentary</p>
              <p className="text-2xl font-bold text-white">{userData.complimentaryCredits}</p>
            </ModernCard>

            <ModernCard background="gradient" className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-white/80 text-sm">Purchased</p>
              <p className="text-2xl font-bold text-white">{userData.purchasedCredits}</p>
            </ModernCard>

            <ModernCard background="gradient" className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-white/80 text-sm">Kobos</p>
              <p className="text-2xl font-bold text-white">{userData.kobos}</p>
            </ModernCard>
          </div>

          {/* Package Type Tabs */}
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1">
            {[
              { id: 'credits', label: 'Credits', icon: Coins },
              { id: 'kobos', label: 'Kobos', icon: KoboIcon },
              { id: 'combo', label: 'Combo Packs', icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white text-gray-900 shadow-lg' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Credit Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => {
              const Icon = getPackageIcon(pkg.type);
              const gradient = getPackageGradient(pkg.type);
              
              return (
                <ModernCard 
                  key={pkg.id} 
                  className={`relative ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}`}
                  background="white"
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                      {pkg.savings && (
                        <span className="text-sm text-green-600 font-medium">{pkg.savings}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                     console.log('Purchasing package:', pkg.id);
                      handlePurchase(pkg.id);
                    }}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${gradient} text-white font-semibold hover:scale-105 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95`}
                    type="button"
                  >
                    {isLoading ? 'Processing...' : 'Purchase Now'}
                  </Button>
                </ModernCard>
              );
            })}
          </div>

          {/* Pricing Information */}
          <ModernCard background="white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How Credits Work</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chat Pricing */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Chat Features
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Chat (per minute)</span>
                    <span className="font-medium">2 Credits or 1 💖</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chat Stickers</span>
                    <span className="font-medium">5 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Send Photos</span>
                    <span className="font-medium">10 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Videos</span>
                    <span className="font-medium">50 Credits</span>
                  </div>
                </div>
              </div>

              {/* Mail Pricing */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-500" />
                  Mail Features
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Letter</span>
                    <span className="font-medium text-green-600">10 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Following Letters</span>
                    <span className="font-medium">30 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Photo</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Photos</span>
                    <span className="font-medium">10 Credits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  Media & Communication
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Video Calls (per minute)</span>
                    <span className="font-medium">60 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Audio Calls (per minute)</span>
                    <span className="font-medium">50 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Video Messages</span>
                    <span className="font-medium">50 Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Audio Messages</span>
                    <span className="font-medium">30 Credits</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-pink-500" />
                  Gifts & Presents
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Virtual Gifts</span>
                    <span className="font-medium">See catalog</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Presents</span>
                    <span className="font-medium">See catalog</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <KoboIcon className="w-6 h-6 text-pink-500 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Kobos Priority</h5>
                  <p className="text-sm text-gray-600">
                    Kobos are used first for chat sessions. 1 kobo = 1 minute of chat time. 
                    When kobos run out, credits are used automatically.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <Video className="w-6 h-6 text-purple-500 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Video & Audio Calls</h5>
                  <p className="text-sm text-gray-600">
                    Video calls: 60 credits per minute. Audio calls: 50 credits per minute. 
                    Credits are deducted every minute during active calls.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-red-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">No Free Services</h5>
                  <p className="text-sm text-red-600">
                    All features require credits. Mail reading: 10 credits. Sending mail: 10-30 credits. 
                    Photos: 10 credits each. No free services available.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Pricing Notice</h5>
                  <p className="text-sm text-yellow-700">
                    ⚠️ Credit pricing is subject to change without prior notice or user consent. 
                    All purchases are final and non-refundable.
                  </p>
                </div>
              </div>
            </div>
          </ModernCard>
          
          {/* Security Status for Credit Purchasers */}
          {securityReport && (
            <ModernCard background="white">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-green-500" />
                Security Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Encryption Level</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      securityReport.securityLevel === 'maximum' ? 'bg-green-500' :
                      securityReport.securityLevel === 'high' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-medium capitalize">{securityReport.securityLevel}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{securityReport.encryptionStatus}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Security Activity</h4>
                  <p className="text-2xl font-bold text-blue-600">{securityReport.auditLogCount}</p>
                  <p className="text-sm text-gray-600">Security events logged</p>
                </div>
              </div>
              
              {securityReport.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 mb-2">Security Recommendations</h5>
                  <ul className="space-y-1">
                    {securityReport.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ModernCard>
          )}
          
          {/* Crypto Wallets Information */}
          <ModernCard background="white">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Bitcoin className="w-6 h-6 mr-2 text-orange-500" />
              Accepted Cryptocurrencies
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {Object.values(DATES_CRYPTO_WALLETS).map((wallet) => (
                <div key={wallet.symbol} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl mb-2 ${wallet.color}`}>{wallet.icon}</div>
                  <div className="font-medium text-sm">{wallet.symbol}</div>
                  <div className="text-xs text-gray-600">{wallet.currency}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Official Dates.care Wallets</h5>
              <p className="text-sm text-blue-700 mb-3">
                All cryptocurrency payments are processed through our official wallet addresses for maximum security.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-600">Bitcoin Network:</span>
                  <span className="font-mono">3 confirmations required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Ethereum Network:</span>
                  <span className="font-mono">12 confirmations required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Processing Time:</span>
                  <span className="font-mono">2-30 minutes</span>
                </div>
              </div>
            </div>
          </ModernCard>

          {/* Recent Transactions */}
          <ModernCard background="white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {userData.transactions.slice(-5).reverse().map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${
                    transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>

        {/* Payment Gateway */}
        {showPayment && selectedPackage && (
          <PaymentGateway
            amount={selectedPackage.price}
            packageName={selectedPackage.name}
            credits={selectedPackage.credits}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
};