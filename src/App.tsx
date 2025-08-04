import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Welcome } from './screens/Welcome/Welcome';
import { AuthSignIn } from './screens/Auth/AuthSignIn';
import { AuthSignUp } from './screens/Auth/AuthSignUp';
import { Discovery } from './screens/Discovery/Discovery';
import { ModernDiscovery } from './screens/Discovery/ModernDiscovery';
import { Matches } from './screens/Matches/Matches';
import { Likes } from './screens/Likes/Likes';
import { Profile } from './screens/Profile/Profile';
import { Settings } from './screens/Settings/Settings';
import { ModernCredits } from './screens/Credits/ModernCredits';
import { GiftShop } from './screens/GiftShop/GiftShop';
import { Mail } from './screens/Mail/Mail';
import { AudioChat } from './screens/AudioChat/AudioChat';
import { VideoChat } from './screens/VideoChat/VideoChat';
import { Counselling } from './screens/Counselling/Counselling';
import { CoupleTherapy } from './screens/CoupleTherapy/CoupleTherapy';
import { Verification } from './screens/Verification/Verification';
import { Onboarding } from './screens/Onboarding/Onboarding';
import { MatchSuitor } from './screens/MatchSuitor/MatchSuitor';
import { Newsfeed } from './screens/Newsfeed/Newsfeed';
import { MenuShowcase } from './screens/MenuShowcase/MenuShowcase';
import { StaffPanel } from './screens/StaffPanel/StaffPanel';
import { CheckoutPage } from './screens/Checkout/CheckoutPage';
import { SuccessPage } from './screens/Success/SuccessPage';
import { CancelPage } from './screens/Cancel/CancelPage';
import { Feedback } from './screens/Feedback/Feedback';
import { useAuth } from './hooks/useAuth';

// Main App Component with Navigation
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('discovery');

  const handleNavigation = (screen: string) => {
    console.log('Navigating to:', screen);
    setCurrentScreen(screen);
    
    // Handle navigation based on screen
    switch (screen) {
      case 'welcome':
        navigate('/');
        break;
      case 'signin':
      case 'auth-signin':
        navigate('/signin');
        break;
      case 'signup':
      case 'auth-signup':
        navigate('/signup');
        break;
      case 'discovery':
        navigate('/app');
        break;
      case 'matches':
        navigate('/matches');
        break;
      case 'likes':
        navigate('/likes');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'credits':
        navigate('/credits');
        break;
      case 'gift-shop':
        navigate('/gifts');
        break;
      case 'mail':
        navigate('/mail');
        break;
      case 'audio-chat':
        navigate('/audio-chat');
        break;
      case 'video-chat':
        navigate('/video-chat');
        break;
      case 'counselling':
        navigate('/counselling');
        break;
      case 'couple-therapy':
        navigate('/couple-therapy');
        break;
      case 'verification':
        navigate('/verification');
        break;
      case 'onboarding':
        navigate('/onboarding');
        break;
      case 'match-suitor':
        navigate('/match-suitor');
        break;
      case 'newsfeed':
        navigate('/newsfeed');
        break;
      case 'menu-showcase':
        navigate('/menu');
        break;
      case 'staff-panel':
        navigate('/staff');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      default:
        console.log('Unknown screen:', screen);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome onNavigate={handleNavigation} />} />
      <Route path="/welcome" element={<Welcome onNavigate={handleNavigation} />} />
      <Route path="/signin" element={<AuthSignIn onNavigate={handleNavigation} />} />
      <Route path="/auth-signin" element={<AuthSignIn onNavigate={handleNavigation} />} />
      <Route path="/signup" element={<AuthSignUp onNavigate={handleNavigation} />} />
      <Route path="/auth-signup" element={<AuthSignUp onNavigate={handleNavigation} />} />
      <Route path="/checkout" element={<CheckoutPage onNavigate={handleNavigation} />} />
      <Route path="/success" element={<SuccessPage onNavigate={handleNavigation} />} />
      <Route path="/cancel" element={<CancelPage onNavigate={handleNavigation} />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <ModernDiscovery onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/discovery" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Discovery onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/matches" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Matches onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/likes" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Likes onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/profile" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Profile onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/settings" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Settings onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/credits" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <ModernCredits onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/gifts" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <GiftShop onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/mail" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Mail onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/audio-chat" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <AudioChat onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/video-chat" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <VideoChat onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/counselling" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Counselling onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/couple-therapy" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <CoupleTherapy onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/verification" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Verification />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/onboarding" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Onboarding onComplete={() => handleNavigation('discovery')} onBack={() => handleNavigation('welcome')} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/match-suitor" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <MatchSuitor onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/newsfeed" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Newsfeed onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/menu" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <MenuShowcase onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/staff" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <StaffPanel />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      <Route path="/feedback" element={
        user ? (
          <ResponsiveLayout currentScreen={currentScreen} onNavigate={handleNavigation}>
            <Feedback onNavigate={handleNavigation} />
          </ResponsiveLayout>
        ) : (
          <Navigate to="/signin" replace />
        )
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;