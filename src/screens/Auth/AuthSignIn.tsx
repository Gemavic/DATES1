import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Heart, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { emailNotificationManager } from '@/lib/emailNotifications';

interface AuthSignInProps {
  onNavigate: (screen: string) => void;
}

export const AuthSignIn: React.FC<AuthSignInProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { signIn } = useAuth();
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
        toast({
          variant: 'success',
          title: 'Welcome back!',
          description: 'You have successfully signed in.'
        });
        
        // Initialize email notifications
        emailNotificationManager.initializeEmailSettings('current-user', formData.email);
        
        onNavigate('discovery');
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
    <Layout
      title="Sign In"
      onBack={() => onNavigate('welcome')}
      showClose={true}
      onClose={() => onNavigate('welcome')}
    >
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/80">Sign in to continue your dating journey</p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">256-bit SSL Encryption</span>
          </div>
          <p className="text-xs text-blue-600">
            Your data is protected with end-to-end encryption.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="pl-10 bg-white/90"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                className="pl-10 pr-10 bg-white/90"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Additional Options */}
        <div className="mt-6 space-y-4">
          <button className="w-full text-center text-white/80 hover:text-white">
            Forgot your password?
          </button>
          
          <div className="text-center">
            <span className="text-white/80">Don't have an account? </span>
            <button
              onClick={() => onNavigate('auth-signup')}
              className="text-white font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};