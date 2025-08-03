import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface WelcomeProps {
  onGetStarted: () => void;
  onNavigate?: (screen: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, onNavigate }) => {
  const { user, getFirstName } = useAuth();
  
  // Show personalized welcome for returning users
  const welcomeText = user ? `Welcome back, ${getFirstName()}!` : 'Find your perfect match';
  const ctaText = user ? 'Continue Your Journey' : 'Get Started';
  return (
    <div className="min-h-screen bg-pink-500 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-20 animate-bounce">
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Romantic couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-32 right-16 w-24 h-24 opacity-30 animate-pulse">
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-32 left-16 w-28 h-28 opacity-25 animate-bounce delay-1000">
          <img 
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Couple in love" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-16 right-10 w-20 h-20 opacity-20 animate-pulse delay-500">
          <img 
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Romance" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        {/* Floating Hearts */}
        <div className="absolute top-20 left-1/2 text-white/20 animate-bounce">
          <Heart className="w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute top-40 left-1/4 text-white/15 animate-pulse delay-700">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-40 right-1/4 text-white/20 animate-bounce delay-300">
          <Heart className="w-10 h-10" fill="currentColor" />
        </div>
      </div>
      
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center pt-16 pb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 shadow-2xl">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 font-alegreya drop-shadow-2xl">
            Dates
          </h1>
          <p className="text-white/90 text-lg drop-shadow-lg">
            Find your perfect match
          </p>
        </div>

        {/* Features */}
        <div className="flex-1 px-6 py-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white/20 rounded-2xl p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Smart Matching" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg drop-shadow-sm">Smart Matching</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">AI-powered compatibility matching</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/20 rounded-2xl p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Safe Messaging" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg drop-shadow-sm">Safe Messaging</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">Secure and private conversations</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/20 rounded-2xl p-4 shadow-xl hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Premium Experience" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg drop-shadow-sm">Premium Experience</h3>
                <p className="text-white/80 text-sm drop-shadow-sm">Enhanced features for better connections</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8 relative z-10">
          <Button
            onClick={onGetStarted}
            className="w-full h-14 bg-white text-pink-600 hover:scale-105 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300"
          >
            Get Started
          </Button>
          <p className="text-center text-white/70 text-sm mt-4 drop-shadow-sm">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => onNavigate('terms')}
              className="underline hover:text-white"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};