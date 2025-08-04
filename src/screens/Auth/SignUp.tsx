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

  const { signUp } = useAuth();

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

      </div>
    </Layout>
  );
};