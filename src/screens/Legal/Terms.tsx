import React from 'react';
import { Layout } from '@/components/Layout';
import { Shield, FileText, Users, Heart } from 'lucide-react';

interface TermsProps {
  onNavigate?: (screen: string) => void;
}

export const Terms: React.FC<TermsProps> = ({ onNavigate = () => {} }) => {
  return (
    <Layout
      title="Terms of Service"
      onBack={() => onNavigate('welcome')}
      showClose={true}
      onClose={() => onNavigate('welcome')}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Terms of Service</h2>
          <p className="text-white/80">Last updated: January 2025</p>
        </div>

        {/* Terms Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              1. Acceptance of Terms
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              By accessing and using Dates.care, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              2. Use License
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of Dates.care materials for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to reverse engineer any software contained on the website</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              3. User Conduct
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              You agree to use Dates.care in a manner consistent with all applicable laws and regulations. You will not:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Post inappropriate, offensive, or harmful content</li>
              <li>• Harass, abuse, or harm other users</li>
              <li>• Create fake profiles or impersonate others</li>
              <li>• Engage in commercial activities without permission</li>
              <li>• Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">4. Credit System</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Dates.care operates on a credit-based system:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• All purchases are final and non-refundable</li>
              <li>• Credit pricing is subject to change without notice</li>
              <li>• Credits have no cash value and cannot be transferred</li>
              <li>• Unused credits do not expire but may be subject to account closure policies</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">5. Privacy and Data</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
              to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">6. Contact Information</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-2">
                <strong>Dates.care Support</strong>
              </p>
              <p className="text-blue-700 text-sm">📧 Email: support@dates.care</p>
              <p className="text-blue-700 text-sm">📞 Phone: +1 (424) 488-7950</p>
              <p className="text-blue-700 text-sm">📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada</p>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => onNavigate('privacy')}
            className="w-full bg-white/20 text-white py-3 rounded-xl hover:bg-white/30 transition-colors"
          >
            View Privacy Policy
          </button>
          <button
            onClick={() => onNavigate('welcome')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Back to App
          </button>
        </div>
      </div>
    </Layout>
  );
};