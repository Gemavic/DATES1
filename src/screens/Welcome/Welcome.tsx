import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, MessageCircle, Sparkles } from 'lucide-react';

interface WelcomeProps {
  onGetStarted?: () => void;
  onNavigate?: (screen: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, onNavigate = () => {} }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started button clicked'); // Debug log
    
    // Try multiple navigation methods
    try {
      console.log('Attempting navigation to signin');
      
      // Method 1: Use onNavigate prop
      if (onNavigate) {
        console.log('Using onNavigate prop');
        onNavigate('auth-signin');
        return;
      }
      
      // Method 2: Use React Router navigate
      if (navigate) {
        console.log('Using React Router navigate');
        navigate('/signin');
        return;
      }
      
      // Method 3: Fallback to window.location
      console.log('Using window.location fallback');
      window.location.href = '/signin';
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Final fallback
      window.location.href = '/signin';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-5 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 opacity-20 animate-bounce">
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Romantic couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-32 right-8 sm:right-16 w-16 h-16 sm:w-24 sm:h-24 opacity-30 animate-pulse">
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-32 left-8 sm:left-16 w-20 h-20 sm:w-28 sm:h-28 opacity-25 animate-bounce delay-1000">
          <img 
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Couple in love" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-16 right-5 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 opacity-20 animate-pulse delay-500">
          <img 
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Romance" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        {/* Floating Hearts */}
        <div className="absolute top-20 left-1/2 text-white/20 animate-bounce">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
        </div>
        <div className="absolute top-40 left-1/4 text-white/15 animate-pulse delay-700">
          <Heart className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-40 right-1/4 text-white/20 animate-bounce delay-300">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 sm:px-0">
        {/* Header */}
        <div className="text-center pt-12 sm:pt-16 pb-6 sm:pb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-4 sm:mb-6 shadow-2xl">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-alegreya drop-shadow-2xl">
            Dates
          </h1>
          <p className="text-white/90 text-base sm:text-lg drop-shadow-lg">
            Find your perfect match
          </p>
        </div>

        {/* Features */}
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 sm:space-x-4 bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Smart Matching" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg drop-shadow-sm">Smart Matching</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">AI-powered compatibility matching</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Safe Messaging" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg drop-shadow-sm">Safe Messaging</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">Secure and private conversations</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Premium Experience" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg drop-shadow-sm">Premium Experience</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">Enhanced features for better connections</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 sm:px-6 pb-6 sm:pb-8 relative z-10">
          <Button
            onClick={handleGetStarted}
            className="w-full h-12 sm:h-14 bg-white text-pink-600 hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation select-none"
            type="button"
          >
            Get Started
          </Button>
          <p className="text-center text-white/70 text-xs sm:text-sm mt-3 sm:mt-4 drop-shadow-sm px-2">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => onNavigate?.('terms')}
              className="underline hover:text-white cursor-pointer touch-manipulation"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};