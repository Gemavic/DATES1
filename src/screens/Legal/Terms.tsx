import React from 'react';
import { Layout } from '@/components/Layout';
import { Shield, FileText, Users, Heart, Gavel, AlertTriangle, Clock } from 'lucide-react';

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
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Terms of Service</h2>
          <p className="text-white/80">Last updated: January 14, 2025</p>
          <p className="text-white/60 text-sm mt-2">Governed by Ontario, Canada and North American Laws</p>
        </div>

        {/* Terms Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-8 text-sm md:text-base">
          {/* 1. Acceptance and Jurisdiction */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Gavel className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500" />
              1. Acceptance of Terms and Jurisdiction
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                By accessing and using Dates.care ("Service", "Platform", "Website"), operated by Dates.care Inc. 
                ("Company", "we", "us", "our"), you ("User", "you", "your") accept and agree to be bound by these 
                Terms of Service ("Terms", "Agreement").
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Governing Law and Jurisdiction</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• These Terms are governed by the laws of Ontario, Canada</li>
                  <li>• Subject to federal laws of Canada where applicable</li>
                  <li>• Disputes resolved in Ontario Superior Court of Justice</li>
                  <li>• Compliance with North American privacy standards (PIPEDA, CPPA)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Service Description */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 text-pink-500" />
              2. Service Description and Age Requirements
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                Dates.care is an online dating and social networking platform that facilitates connections between users 
                seeking romantic relationships.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Age Verification - Legal Requirement</h4>
                <ul className="space-y-1 text-red-800">
                  <li>• You must be at least 18 years old to use this service</li>
                  <li>• Age verification required under Ontario's Protection of Children Act</li>
                  <li>• False age representation is prohibited and illegal</li>
                  <li>• Government-issued ID required for verification</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. User Obligations and Prohibited Conduct */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-500" />
              3. User Obligations and Prohibited Conduct
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Prohibited Activities (Criminal Code of Canada compliance):</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Harassment, stalking, or threatening behavior (Criminal Code ss. 264, 372)</li>
                  <li>Non-consensual sharing of intimate images (Criminal Code s. 162.1)</li>
                  <li>Identity theft or impersonation (Criminal Code s. 403)</li>
                  <li>Fraud or financial exploitation (Criminal Code ss. 380, 402.2)</li>
                  <li>Distribution of child sexual abuse material (Criminal Code s. 163.1)</li>
                  <li>Hate speech or discrimination prohibited under Ontario Human Rights Code</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Legal Consequences</h4>
                <p className="text-yellow-800">
                  Violations may result in immediate account termination, reporting to law enforcement, 
                  and potential criminal charges under Canadian federal and provincial laws.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Credit System and Financial Terms */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">4. Credit System and Financial Terms</h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Ontario Consumer Protection Act Compliance</h4>
                <ul className="space-y-1 text-orange-800">
                  <li>• All purchases are final and non-refundable (as permitted under CPA s. 13)</li>
                  <li>• Credit pricing subject to change with 30 days notice</li>
                  <li>• Clear disclosure of all fees and charges provided</li>
                  <li>• Cooling-off period: 10 business days for subscription services over $50</li>
                  <li>• Automatic renewal notice provided 30 days prior</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Credit System Terms:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Credits are virtual currency with no cash value</li>
                  <li>Credits cannot be transferred between users</li>
                  <li>Unused credits remain valid for 24 months from purchase date</li>
                  <li>Staff members receive unlimited access for platform operations</li>
                  <li>All transactions processed through Stripe (PCI DSS compliant)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">11. Legal Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Dates.care Inc.</h4>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Registered Address:</strong> 5515 Eglinton Ave, Etobicoke, ON M9C 5K5, Canada</p>
                  <p><strong>Legal Department:</strong> legal@dates.care</p>
                  <p><strong>Phone:</strong> +1 (424) 488-7950</p>
                  <p><strong>Dispute Resolution:</strong> disputes@dates.care</p>
                </div>
              </div>
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