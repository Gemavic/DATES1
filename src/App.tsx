import React, { useState } from 'react';
import { Menu } from './components/Menu';
import { ToastProvider } from './components/ui/toast';
import { Welcome } from './screens/Welcome/Welcome';
import { Onboarding } from './screens/Onboarding/Onboarding';
import { ModernDiscovery } from './screens/Discovery/ModernDiscovery';
import { Matches } from './screens/Matches/Matches';
import { Profile } from './screens/Profile/Profile';
import { Settings } from './screens/Settings/Settings';
import { Likes } from './screens/Likes/Likes';
import { AuthSignIn } from './screens/Auth/AuthSignIn';
import { AuthSignUp } from './screens/Auth/AuthSignUp';
import { ModernCredits } from './screens/Credits/ModernCredits';
import { VideoChat } from './screens/VideoChat/VideoChat';
import { AudioChat } from './screens/AudioChat/AudioChat';
import { GiftShop } from './screens/GiftShop/GiftShop';
import { MatchSuitor } from './screens/MatchSuitor/MatchSuitor';
import { CoupleTherapy } from './screens/CoupleTherapy/CoupleTherapy';
import { Counselling } from './screens/Counselling/Counselling';
import { MenuShowcase } from './screens/MenuShowcase/MenuShowcase';
import { Newsfeed } from './screens/Newsfeed/Newsfeed';
import { Mail } from './screens/Mail/Mail';
import { StaffPanel } from './screens/StaffPanel/StaffPanel';
import { CheckoutPage } from './screens/Checkout/CheckoutPage';
import { SuccessPage } from './screens/Success/SuccessPage';
import { CancelPage } from './screens/Cancel/CancelPage';
import { Verification } from './screens/Verification/Verification';
import { useAuth } from './hooks/useAuth';
import { SubscriptionStatus } from './components/SubscriptionStatus';
import { ChatBot } from './components/ChatBot';
import { SupportWidget } from './components/SupportWidget';
import { creditManager } from './lib/creditSystem';
import { emailNotificationManager } from './lib/emailNotifications';
import { Shield, AlertTriangle } from 'lucide-react';

// Simple legal components
const TermsOfService = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 mt-8">
        <button 
          onClick={() => onNavigate('welcome')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back
        </button>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Terms of Service</h1>
        <div className="space-y-4 text-gray-700">
          <p>Welcome to Dates. By using our service, you agree to these terms.</p>
          <h2 className="text-lg font-semibold">1. New User Bonus</h2>
          <p>New users receive 10 complimentary credits and 10 kobos upon first signup.</p>
          <h2 className="text-lg font-semibold">2. Acceptance of Terms</h2>
          <p>By accessing Dates, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-lg font-semibold">3. User Eligibility</h2>
          <p>You must be at least 18 years old to use this service.</p>
          <h2 className="text-lg font-semibold">4. Credit & Kobo System</h2>
          <p>Our platform uses a dual currency system: Credits for general features and Kobos for chat time. All purchases are non-refundable.</p>
          <h2 className="text-lg font-semibold">5. Governing Law</h2>
          <p>These terms are governed by the laws of Ontario, Canada.</p>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> 5515 Eglinton Ave, Etobicoke, ON, Canada<br/>
              <strong>Phone:</strong> +1 (613) 861-5799<br/>
              <strong>Contact:</strong> info@dates.care<br/>
              <strong>Support:</strong> supports@dates.care
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPolicy = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 mt-8">
        <button 
          onClick={() => onNavigate('welcome')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back
        </button>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Privacy Policy</h1>
        <div className="space-y-4 text-gray-700">
          <p>Your privacy is important to us. This policy explains how we handle your data.</p>
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p>We collect information you provide when creating your profile and using our credit system.</p>
          <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
          <p>We use your information to provide dating services, process payments, and improve our platform.</p>
          <h2 className="text-lg font-semibold">3. Data Protection</h2>
          <p>We comply with Canadian privacy laws including PIPEDA and use encryption to protect your data.</p>
          <h2 className="text-lg font-semibold">4. Payment Information</h2>
          <p>Credit card information is processed securely through encrypted payment processors.</p>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> 5515 Eglinton Ave, Etobicoke, ON, Canada<br/>
              <strong>Phone:</strong> +1 (613) 861-5799<br/>
              <strong>Contact:</strong> info@dates.care<br/>
              <strong>Privacy:</strong> admin@dates.care
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DisputeResolution = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 mt-8">
        <button 
          onClick={() => onNavigate('welcome')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back
        </button>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Dispute Resolution</h1>
        <div className="space-y-4 text-gray-700">
          <p>We are committed to resolving disputes fairly and efficiently.</p>
          <h2 className="text-lg font-semibold">1. Direct Communication</h2>
          <p>First, try to resolve issues directly with the other party through our platform.</p>
          <h2 className="text-lg font-semibold">2. Customer Support</h2>
          <p>Contact our support team at support@dates.com for assistance with any issues.</p>
          <h2 className="text-lg font-semibold">3. Credit Disputes</h2>
          <p>For payment or credit-related disputes, we offer a 48-hour resolution process.</p>
          <h2 className="text-lg font-semibold">4. Mediation</h2>
          <p>We offer mediation services through Canadian mediation providers for complex disputes.</p>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> +1 (613) 861-5799<br/>
              <strong>Address:</strong> 5515 Eglinton Ave, Etobicoke, ON, Canada<br/>
              <strong>Support:</strong> supports@dates.care<br/>
              <strong>Hours:</strong> 24/7 Support Available
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Disclaimer = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 mt-8">
        <button 
          onClick={() => onNavigate('welcome')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back
        </button>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Legal Disclaimer</h1>
        <div className="space-y-4 text-gray-700">
          <p>Important legal notices and disclaimers for using Dates.</p>
          <h2 className="text-lg font-semibold">1. Service Limitations</h2>
          <p>We provide a platform for connections but cannot guarantee specific outcomes or relationships.</p>
          <h2 className="text-lg font-semibold">2. User Safety</h2>
          <p>Users are responsible for their personal safety when meeting others. Always meet in public places.</p>
          <h2 className="text-lg font-semibold">3. Payment Terms</h2>
          <p>All credit purchases are final. Credits do not expire but cannot be refunded or transferred.</p>
          <h2 className="text-lg font-semibold">4. Limitation of Liability</h2>
          <p>Our liability is limited as permitted by Ontario and Canadian law.</p>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> 5515 Eglinton Ave, Etobicoke, ON, Canada<br/>
              <strong>Phone:</strong> +1 (613) 861-5799<br/>
              <strong>Legal:</strong> admin@dates.care<br/>
              <strong>Jurisdiction:</strong> Ontario, Canada<br/>
              <strong>Last Updated:</strong> January 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

type Screen = 
  | 'welcome' 
  | 'onboarding' 
  | 'discovery' 
  | 'matches' 
  | 'profile' 
  | 'settings' 
  | 'likes' 
  | 'auth-signin' 
  | 'auth-signup' 
  | 'credits' 
  | 'video-chat' 
  | 'audio-chat' 
  | 'gift-shop' 
  | 'match-suitor' 
  | 'couple-therapy' 
  | 'counselling' 
  | 'help'
  | 'menu-showcase'
  | 'newsfeed'
  | 'mail'
  | 'staff-panel'
  | 'checkout'
  | 'success'
  | 'cancel'
  | 'terms'
  | 'privacy'
  | 'dispute'
  | 'disclaimer'
  | 'verification';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const { user, loading } = useAuth();
  
  // Initialize credit system on app start
  React.useEffect(() => {
    if (user) {
      creditManager.initializeUser(user.id);
      emailNotificationManager.initializeEmailSettings(user.id, user.email || '');
    }
  }, [user]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full animate-pulse"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    // Handle URL-based routing for success/cancel pages
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/success') {
        return <SuccessPage onNavigate={navigate} />;
      }
      if (path === '/cancel') {
        return <CancelPage onNavigate={navigate} />;
      }
    }

    switch (currentScreen) {
      case 'welcome':
        return <Welcome onGetStarted={() => navigate('auth-signup')} onNavigate={navigate} />;
      
      case 'onboarding':
        return (
          <Onboarding
            onComplete={() => navigate('discovery')}
            onBack={() => navigate('welcome')}
          />
        );
      
      case 'discovery':
        return <ModernDiscovery onNavigate={navigate} />;
      
      case 'matches':
        return <Matches onNavigate={navigate} />;
      
      case 'likes':
        return <Likes onNavigate={navigate} />;
      
      case 'profile':
        return <Profile onNavigate={navigate} />;
      
      case 'settings':
        return <Settings onNavigate={navigate} />;
      
      case 'auth-signin':
        return <AuthSignIn onNavigate={navigate} />;
      
      case 'auth-signup':
        return <AuthSignUp onNavigate={navigate} />;
      
      case 'credits':
        return <ModernCredits onNavigate={navigate} />;
      
      case 'video-chat':
        return <VideoChat onNavigate={navigate} />;
      
      case 'audio-chat':
        return <AudioChat onNavigate={navigate} />;
      
      case 'gift-shop':
        return <GiftShop onNavigate={navigate} />;
      
      case 'match-suitor':
        return <MatchSuitor onNavigate={navigate} />;
      
      case 'couple-therapy':
        return <CoupleTherapy onNavigate={navigate} />;
      
      case 'counselling':
        return <Counselling onNavigate={navigate} />;
      
      case 'help':
        return <Settings onNavigate={navigate} />;
      
      case 'menu-showcase':
        return <MenuShowcase onNavigate={navigate} />;
      
      case 'newsfeed':
        return <Newsfeed onNavigate={navigate} />;
      
      case 'mail':
        return <Mail onNavigate={navigate} />;
      
      case 'staff-panel':
        return <StaffPanel onNavigate={navigate} />;
      
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      
      case 'success':
        return <SuccessPage onNavigate={navigate} />;
      
      case 'cancel':
        return <CancelPage onNavigate={navigate} />;
      
      case 'terms':
        return <TermsOfService onNavigate={navigate} />;
      
      case 'privacy':
        return <PrivacyPolicy onNavigate={navigate} />;
      
      case 'dispute':
        return <DisputeResolution onNavigate={navigate} />;
      
      case 'disclaimer':
        return <Disclaimer onNavigate={navigate} />;
      
      case 'verification':
        return <Verification onNavigate={navigate} />;
      
      default:
        return <Welcome onGetStarted={() => navigate('auth-signup')} onNavigate={navigate} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {currentScreen !== 'welcome' && (
          <Menu onNavigate={navigate} currentScreen={currentScreen} />
        )}
        
        {/* Show subscription status for authenticated users */}
        {user && currentScreen !== 'welcome' && currentScreen !== 'auth-signin' && currentScreen !== 'auth-signup' && (
          <div className="fixed top-20 right-4 z-40">
            <SubscriptionStatus />
          </div>
        )}
        
        {renderScreen()}
        
        {/* 24/7 AI Support */}
        <ChatBot />
        <SupportWidget />
      </div>
    </ToastProvider>
  );
}

export default App;