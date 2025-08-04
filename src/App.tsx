import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Welcome } from './screens/Welcome/Welcome';
import { SignIn } from './screens/Auth/SignIn';
import { SignUp } from './screens/Auth/SignUp';
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

function App() {
  const { user, loading } = useAuth();

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
          <Route path="/" element={<Welcome onNavigate={(screen) => {
            console.log('Welcome onNavigate called with:', screen);
            if (screen === 'signin' || screen === 'auth-signin') {
              window.location.href = '/signin';
            } else if (screen === 'signup' || screen === 'auth-signup') {
              window.location.href = '/signup';
            } else {
              window.location.href = `/${screen}`;
            }
          }} />} />
          <Route path="/welcome" element={<Welcome onNavigate={(screen) => {
            console.log('Welcome onNavigate called with:', screen);
            if (screen === 'signin' || screen === 'auth-signin') {
              window.location.href = '/signin';
            } else if (screen === 'signup' || screen === 'auth-signup') {
              window.location.href = '/signup';
            } else {
              window.location.href = `/${screen}`;
            }
          }} />} />
          <Route path="/signin" element={<SignIn onNavigate={(screen) => {
            console.log('SignIn onNavigate called with:', screen);
            window.location.href = `/${screen}`;
          }} />} />
          <Route path="/auth-signin" element={<SignIn onNavigate={(screen) => {
            console.log('SignIn onNavigate called with:', screen);
            window.location.href = `/${screen}`;
          }} />} />
          <Route path="/signup" element={<SignUp onNavigate={(screen) => {
            console.log('SignUp onNavigate called with:', screen);
            window.location.href = `/${screen}`;
          }} />} />
          <Route path="/auth-signup" element={<SignUp onNavigate={(screen) => {
            console.log('SignUp onNavigate called with:', screen);
            window.location.href = `/${screen}`;
          }} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={
            user ? (
              <ResponsiveLayout>
                <ModernDiscovery />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/discovery" element={
            user ? (
              <ResponsiveLayout>
                <Discovery />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/matches" element={
            user ? (
              <ResponsiveLayout>
                <Matches />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/likes" element={
            user ? (
              <ResponsiveLayout>
                <Likes />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/profile" element={
            user ? (
              <ResponsiveLayout>
                <Profile />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/settings" element={
            user ? (
              <ResponsiveLayout>
                <Settings />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/credits" element={
            user ? (
              <ResponsiveLayout>
                <ModernCredits />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/gifts" element={
            user ? (
              <ResponsiveLayout>
                <GiftShop />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/mail" element={
            user ? (
              <ResponsiveLayout>
                <Mail />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/audio-chat" element={
            user ? (
              <ResponsiveLayout>
                <AudioChat />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/video-chat" element={
            user ? (
              <ResponsiveLayout>
                <VideoChat />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/counselling" element={
            user ? (
              <ResponsiveLayout>
                <Counselling />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/couple-therapy" element={
            user ? (
              <ResponsiveLayout>
                <CoupleTherapy />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/verification" element={
            user ? (
              <ResponsiveLayout>
                <Verification />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/onboarding" element={
            user ? (
              <ResponsiveLayout>
                <Onboarding />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/match-suitor" element={
            user ? (
              <ResponsiveLayout>
                <MatchSuitor />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/newsfeed" element={
            user ? (
              <ResponsiveLayout>
                <Newsfeed />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/menu" element={
            user ? (
              <ResponsiveLayout>
                <MenuShowcase />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/staff" element={
            user ? (
              <ResponsiveLayout>
                <StaffPanel />
              </ResponsiveLayout>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          
          <Route path="/feedback" element={
            user ? (
              <ResponsiveLayout>
                <Feedback />
              </ResponsiveLayout>
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