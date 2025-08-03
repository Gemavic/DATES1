import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModernLayout from './components/ModernLayout';
import Welcome from './screens/Welcome/Welcome';
import AuthSignIn from './screens/Auth/AuthSignIn';
import AuthSignUp from './screens/Auth/AuthSignUp';
import Discovery from './screens/Discovery/Discovery';
import ModernDiscovery from './screens/Discovery/ModernDiscovery';
import Matches from './screens/Matches/Matches';
import Likes from './screens/Likes/Likes';
import Profile from './screens/Profile/Profile';
import Settings from './screens/Settings/Settings';
import ModernCredits from './screens/Credits/ModernCredits';
import GiftShop from './screens/GiftShop/GiftShop';
import Mail from './screens/Mail/Mail';
import AudioChat from './screens/AudioChat/AudioChat';
import VideoChat from './screens/VideoChat/VideoChat';
import Counselling from './screens/Counselling/Counselling';
import CoupleTherapy from './screens/CoupleTherapy/CoupleTherapy';
import Verification from './screens/Verification/Verification';
import Onboarding from './screens/Onboarding/Onboarding';
import MatchSuitor from './screens/MatchSuitor/MatchSuitor';
import Newsfeed from './screens/Newsfeed/Newsfeed';
import MenuShowcase from './screens/MenuShowcase/MenuShowcase';
import StaffPanel from './screens/StaffPanel/StaffPanel';
import CheckoutPage from './screens/Checkout/CheckoutPage';
import SuccessPage from './screens/Success/SuccessPage';
import CancelPage from './screens/Cancel/CancelPage';
import Feedback from './screens/Feedback/Feedback';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<AuthSignIn />} />
          <Route path="/signup" element={<AuthSignUp />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={
            user ? (
              <ModernLayout>
                <ModernDiscovery />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/discovery" element={
            user ? (
              <ModernLayout>
                <Discovery />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/matches" element={
            user ? (
              <ModernLayout>
                <Matches />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/likes" element={
            user ? (
              <ModernLayout>
                <Likes />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/profile" element={
            user ? (
              <ModernLayout>
                <Profile />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/settings" element={
            user ? (
              <ModernLayout>
                <Settings />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/credits" element={
            user ? (
              <ModernLayout>
                <ModernCredits />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/gifts" element={
            user ? (
              <ModernLayout>
                <GiftShop />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/mail" element={
            user ? (
              <ModernLayout>
                <Mail />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/audio-chat" element={
            user ? (
              <ModernLayout>
                <AudioChat />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/video-chat" element={
            user ? (
              <ModernLayout>
                <VideoChat />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/counselling" element={
            user ? (
              <ModernLayout>
                <Counselling />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/couple-therapy" element={
            user ? (
              <ModernLayout>
                <CoupleTherapy />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/verification" element={
            user ? (
              <ModernLayout>
                <Verification />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/onboarding" element={
            user ? (
              <ModernLayout>
                <Onboarding />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/match-suitor" element={
            user ? (
              <ModernLayout>
                <MatchSuitor />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/newsfeed" element={
            user ? (
              <ModernLayout>
                <Newsfeed />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/menu" element={
            user ? (
              <ModernLayout>
                <MenuShowcase />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/staff" element={
            user ? (
              <ModernLayout>
                <StaffPanel />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/feedback" element={
            user ? (
              <ModernLayout>
                <Feedback />
              </ModernLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;