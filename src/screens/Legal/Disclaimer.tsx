import React from 'react';
import { Layout } from '@/components/Layout';
import { AlertTriangle, Shield, Heart, Users } from 'lucide-react';

interface DisclaimerProps {
  onNavigate?: (screen: string) => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ onNavigate = () => {} }) => {
  return (
    <Layout
      title="Legal Disclaimer"
      onBack={() => onNavigate('welcome')}
      showClose={true}
      onClose={() => onNavigate('welcome')}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Legal Disclaimer</h2>
          <p className="text-white/80">Important legal information</p>
        </div>

        {/* Disclaimer Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              General Disclaimer
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              Dates.care excludes all representations, warranties, obligations, and liabilities arising out of or in 
              connection with the information provided.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Dating Service Disclaimer
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Dates.care is a platform that facilitates connections between users. We do not guarantee:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• That you will find a romantic partner</li>
              <li>• The accuracy of user profiles or information</li>
              <li>• The behavior or intentions of other users</li>
              <li>• Successful relationships or marriages</li>
              <li>• Compatibility between matched users</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              Safety and Security
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              While we implement security measures and content moderation:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Users are responsible for their own safety when meeting others</li>
              <li>• Always meet in public places for first dates</li>
              <li>• We cannot guarantee the identity verification of all users</li>
              <li>• Report suspicious behavior immediately</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Limitation of Liability
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              In no event shall Dates.care or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on Dates.care's website.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-orange-800 text-sm mb-2">
                <strong>Legal Department</strong>
              </p>
              <p className="text-orange-700 text-sm">📧 Email: legal@dates.care</p>
              <p className="text-orange-700 text-sm">📞 Phone: +1 (424) 488-7950</p>
              <p className="text-orange-700 text-sm">📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada</p>
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
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Back to App
          </button>
        </div>
      </div>
    </Layout>
  );
};