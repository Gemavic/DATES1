import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Menu } from '@/components/Menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Heart, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { emailNotificationManager } from '@/lib/emailNotifications';

interface AuthSignInProps {
  onNavigate?: (screen: string) => void;
}

export const AuthSignIn: React.FC<AuthSignInProps> = ({ onNavigate = () => {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { signIn, getFirstName } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        let errorMessage = error.message;
        let errorTitle = 'Sign In Failed';
        
        // Handle specific error cases
        if (error.message === 'Invalid login credentials') {
          errorTitle = 'Invalid Credentials';
          errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
        } else if (error.message === 'Email not confirmed') {
          errorTitle = 'Email Not Confirmed';
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message === 'Too many requests') {
          errorTitle = 'Too Many Attempts';
          errorMessage = 'Too many sign-in attempts. Please wait a few minutes before trying again.';
        }
        
        toast({
          variant: 'destructive',
          title: errorTitle,
          description: errorMessage
        });
      } else {
        // Initialize email notifications
        emailNotificationManager.initializeEmailSettings('current-user', formData.email);
        
        // Show personalized welcome back message after navigation
        setTimeout(() => {
          const firstName = getFirstName();
          const welcomeMessage = document.createElement('div');
          welcomeMessage.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-slide-up';
          welcomeMessage.innerHTML = `
            <div class="flex items-center space-x-3">
              <span class="text-3xl">👋</span>
              <div>
                <div class="font-bold text-lg">Welcome back, ${firstName}!</div>
                <div class="text-sm opacity-90">Great to see you again. Ready to find your perfect match?</div>
              </div>
            </div>
          `;
          document.body.appendChild(welcomeMessage);
          
          // Auto-remove after 5 seconds
          setTimeout(() => {
            if (document.body.contains(welcomeMessage)) {
              welcomeMessage.style.animation = 'fadeOut 0.5s ease-out forwards';
              setTimeout(() => document.body.removeChild(welcomeMessage), 500);
            }
          }, 5000);
        }, 1000);
        
        onNavigate('discovery');
        window.location.href = '/app';
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Menu onNavigate={onNavigate} currentScreen="auth-signin" />
      <Layout
        title="Sign In"
        onBack={() => onNavigate?.('welcome') || (window.location.href = '/')}
        showClose={true}
        onClose={() => onNavigate?.('welcome') || (window.location.href = '/')}
      >
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/80">Sign in to continue your dating journey</p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">256-bit SSL Encryption</span>
          </div>
          <p className="text-xs text-blue-600">
            Your data is protected with end-to-end encryption.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="pl-9 sm:pl-10 bg-white/90 h-11 sm:h-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                className="pl-9 sm:pl-10 pr-9 sm:pr-10 bg-white/90 h-11 sm:h-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Additional Options */}
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <button 
            onClick={() => onNavigate?.('forgot-password') || (window.location.href = '/forgot-password')}
            className="w-full text-center text-white/80 hover:text-white transition-colors duration-200"
          >
            Forgot your password?
          </button>
          

          <div className="text-center">
            <span className="text-white/80">Don't have an account? </span>
            <button
              onClick={() => onNavigate?.('auth-signup') || (window.location.href = '/auth-signup')}
              className="text-white font-semibold hover:underline transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
};