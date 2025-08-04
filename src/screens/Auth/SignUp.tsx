import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Heart, Mail, Lock, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { SecurityManager } from '@/lib/security';
import { creditManager } from '@/lib/creditSystem';
import { useAuth } from '@/hooks/useAuth';

interface SignUpProps {
  onNavigate: (screen: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] as string[] });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(SecurityManager.validatePassword(password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    // Validate all fields
    const validationErrors: string[] = [];

    if (!formData.name.trim()) {
      validationErrors.push('Name is required');
    }

    if (!SecurityManager.validateEmail(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (!passwordStrength.isValid) {
      validationErrors.push('Password does not meet security requirements');
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    // Filter profanity from name
    const filteredName = SecurityManager.filterProfanity(formData.name);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      
      // Initialize user with welcome bonus
      creditManager.initializeUser(formData.email);
      
      onNavigate('onboarding');
    }, 1500);
  };

  const handleGoogleSignUp = async () => {
    setIsSocialLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors([error.message]);
      }
    } catch (error) {
      setErrors(['Failed to sign up with Google. Please try again.']);
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsSocialLoading(true);
    try {
      const { error } = await signInWithFacebook();
      if (error) {
        setErrors([error.message]);
      }
    } catch (error) {
      setErrors(['Failed to sign up with Facebook. Please try again.']);
    } finally {
      setIsSocialLoading(false);
    }
  };
  return (
    <Layout
      title="Sign Up"
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
          <h2 className="text-2xl font-bold text-white mb-2">Join Dates!</h2>
          <p className="text-white/80">Create your account to find love</p>
        </div>

        {/* Security Features */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center text-green-600 text-sm mb-2">
            <Shield className="w-4 h-4 mr-2" />
            <strong>Your Security Matters</strong>
          </div>
          <ul className="text-green-600 text-xs space-y-1 ml-6">
            <li>• End-to-end encryption</li>
            <li>• Two-factor authentication</li>
            <li>• Content moderation</li>
            <li>• Safe reporting system</li>
          </ul>
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

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="pl-10 bg-white/90"
                required
              />
            </div>
          </div>

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
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Create a password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                {passwordStrength.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                )}
                <span className="text-sm font-medium">
                  Password {passwordStrength.isValid ? 'Strong' : 'Requirements'}
                </span>
              </div>
              {!passwordStrength.isValid && (
                <ul className="text-xs text-gray-600 space-y-1">
                  {passwordStrength.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className="pl-10 pr-10 bg-white/90"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all duration-300"
            disabled={isLoading || !passwordStrength.isValid}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            By signing up, you agree to our{' '}
            <button 
              onClick={() => onNavigate('terms')}
              className="text-white underline hover:text-white/80 transition-colors"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              onClick={() => onNavigate('privacy')}
              className="text-white underline hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <span className="text-white/80">Already have an account? </span>
          <button
            onClick={() => onNavigate('signin')}
            className="text-white font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>

        {/* Social Sign Up */}
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
              onClick={handleGoogleSignUp}
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