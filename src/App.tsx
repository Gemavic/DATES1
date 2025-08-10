import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Terms } from './screens/Legal/Terms';
import { Privacy } from './screens/Legal/Privacy';
import { Disclaimer } from './screens/Legal/Disclaimer';
import { Dispute } from './screens/Legal/Dispute';
import { useAuth } from './hooks/useAuth';

// Main App Component with Navigation
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(() => {
    const path = location.pathname;
    if (path === '/app' || path === '/discovery') return 'discovery';
    if (path === '/matches') return 'matches';
    if (path === '/likes') return 'likes';
    if (path === '/profile') return 'profile';
    if (path === '/settings') return 'settings';
    if (path === '/credits') return 'credits';
    if (path === '/gifts') return 'gift-shop';
    if (path === '/mail') return 'mail';
    if (path === '/newsfeed') return 'newsfeed';
    if (path === '/feedback') return 'feedback';
    return 'discovery';
  });

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
      case 'search':
      case 'people':
        navigate('/app');
        break;
      case 'matches':
      case 'chat':
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
      case 'gifts':
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
      case 'terms':
        navigate('/terms');
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'disclaimer':
        navigate('/disclaimer');
        break;
      case 'dispute':
        navigate('/dispute');
        break;
      default:
        console.log('Unknown screen:', screen);
        break;
    }
  };

  // Update current screen when location changes
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/app' || path === '/discovery') setCurrentScreen('discovery');
    else if (path === '/matches') setCurrentScreen('matches');
    else if (path === '/likes') setCurrentScreen('likes');
    else if (path === '/profile') setCurrentScreen('profile');
    else if (path === '/settings') setCurrentScreen('settings');
    else if (path === '/credits') setCurrentScreen('credits');
    else if (path === '/gifts') setCurrentScreen('gift-shop');
    else if (path === '/mail') setCurrentScreen('mail');
    else if (path === '/newsfeed') setCurrentScreen('newsfeed');
    else if (path === '/feedback') setCurrentScreen('feedback');
  }, [location.pathname]);

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
            <ModernDiscovery onNavigate={handleNavigation} />
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
      
      {/* Legal Routes - Public Access */}
      <Route path="/terms" element={<Terms onNavigate={handleNavigation} />} />
      <Route path="/privacy" element={<Privacy onNavigate={handleNavigation} />} />
      <Route path="/disclaimer" element={<Disclaimer onNavigate={handleNavigation} />} />
      <Route path="/dispute" element={<Dispute onNavigate={handleNavigation} />} />
      
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