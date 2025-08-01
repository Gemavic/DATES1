import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Heart, Mail, Lock, Shield, AlertTriangle } from 'lucide-react';
import { SecurityManager, TwoFactorAuth } from '@/lib/security';

interface SignInProps {
  onNavigate: (screen: string) => void;
}

export const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
            <Button className="bg-white/20 text-white hover:bg-white/30">
              Google
            </Button>
            <Button className="bg-white/20 text-white hover:bg-white/30">
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};