import React from 'react';
import { Layout } from '@/components/Layout';
import { Shield, Lock, Eye, Database, Users } from 'lucide-react';

interface PrivacyProps {
  onNavigate?: (screen: string) => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onNavigate = () => {} }) => {
  return (
    <Layout
      title="Privacy Policy"
      onBack={() => onNavigate('welcome')}
      showClose={true}
      onClose={() => onNavigate('welcome')}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Privacy Policy</h2>
          <p className="text-white/80">Last updated: January 2025</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-500" />
              Information We Collect
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We collect information you provide directly to us, such as when you create an account, 
              update your profile, or contact us for support.
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Profile information (name, age, photos, bio)</li>
              <li>• Contact information (email, phone number)</li>
              <li>• Payment information (processed securely through Stripe)</li>
              <li>• Usage data and preferences</li>
              <li>• Communication content (messages, photos)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-500" />
              How We Use Your Information
            </h3>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• To provide and maintain our dating service</li>
              <li>• To match you with compatible users</li>
              <li>• To process payments and transactions</li>
              <li>• To send you updates and notifications</li>
              <li>• To improve our services and user experience</li>
              <li>• To ensure safety and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-purple-500" />
              Information Sharing
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• With your explicit consent</li>
              <li>• To comply with legal obligations</li>
              <li>• To protect our rights and safety</li>
              <li>• With trusted service providers (under strict confidentiality)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              Data Security
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. This includes 256-bit SSL encryption, secure data storage, 
              and regular security audits.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Your Rights</h3>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and data</li>
              <li>• Export your data</li>
              <li>• Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800 text-sm mb-2">
                <strong>Privacy Questions</strong>
              </p>
              <p className="text-green-700 text-sm">📧 Email: privacy@dates.care</p>
              <p className="text-green-700 text-sm">📞 Phone: +1 (424) 488-7950</p>
              <p className="text-green-700 text-sm">📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada</p>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => onNavigate('terms')}
            className="w-full bg-white/20 text-white py-3 rounded-xl hover:bg-white/30 transition-colors"
          >
            View Terms of Service
          </button>
          <button
            onClick={() => onNavigate('welcome')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Back to App
          </button>
        </div>
      </div>
    </Layout>
  );
};