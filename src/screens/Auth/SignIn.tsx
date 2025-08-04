import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Heart, Mail, Lock, Shield, AlertTriangle } from 'lucide-react';
import { SecurityManager, TwoFactorAuth } from '@/lib/security';
import { useAuth } from '@/hooks/useAuth';

interface SignInProps {
  onNavigate: (screen: string) => void;
}

export const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    // Validate email
    if (!SecurityManager.validateEmail(formData.email)) {
      setErrors(['Please enter a valid email address']);
      setIsLoading(false);
      return;
    }

    // Check rate limiting
    if (!SecurityManager.checkRateLimit(formData.email, 5, 300000)) {
      setErrors(['Too many login attempts. Please try again in 5 minutes.']);
      setIsLoading(false);
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setShowTwoFactor(true);
    }, 1000);
  };

  const handleTwoFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = '123456'; // In real app, this would be sent via SMS/email
    
    if (TwoFactorAuth.verifyCode(twoFactorCode, generatedCode)) {
      onNavigate('discovery');
    } else {
      setErrors(['Invalid verification code. Please try again.']);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors([error.message]);
      }
    } catch (error) {
      setErrors(['Failed to sign in with Google. Please try again.']);
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsSocialLoading(true);
    try {
      const { error } = await signInWithFacebook();
      if (error) {
        setErrors([error.message]);
      }
    } catch (error) {
      setErrors(['Failed to sign in with Facebook. Please try again.']);
    } finally {
      setIsSocialLoading(false);
    }
  };
  if (showTwoFactor) {
    return (
      <Layout
        title="Two-Factor Authentication"
        onBack={() => setShowTwoFactor(false)}
        showClose={true}
        onClose={() => onNavigate('welcome')}
      >
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Identity</h2>
            <p className="text-gray-600">Enter the 6-digit code sent to your device</p>
          </div>

          <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600"
              disabled={twoFactorCode.length !== 6}
            >
              Verify & Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-blue-500 hover:underline text-sm">
              Didn't receive code? Resend
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
          <div className="flex items-center text-blue-600 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Your data is protected with end-to-end encryption
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </div>
            ))}
          </div>
        )}

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
              onClick={() => onNavigate('signup')}
              className="text-white font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Social Sign In */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white/80">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isSocialLoading}
              className="bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              onClick={handleFacebookSignIn}
              disabled={isSocialLoading}
              className="bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};