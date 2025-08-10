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

          {/* 5. Privacy and Data Protection */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">5. Privacy and Data Protection</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">PIPEDA and CPPA Compliance</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Personal information collected with consent (PIPEDA Principle 3)</li>
                  <li>• Data minimization practices implemented</li>
                  <li>• User rights to access, correct, and delete personal data</li>
                  <li>• Cross-border data transfer restrictions respected</li>
                  <li>• Breach notification within 72 hours as required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                All content, features, and functionality are owned by Dates.care Inc. and protected by 
                Canadian copyright, trademark, and other intellectual property laws.
              </p>
              <div>
                <h4 className="font-semibold mb-2">User Content License:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>You retain ownership of content you submit</li>
                  <li>You grant us license to use, display, and distribute your content</li>
                  <li>You represent that you own or have rights to all submitted content</li>
                  <li>We may remove content that violates these Terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Ontario Courts Jurisdiction</h4>
                <p className="text-red-800 leading-relaxed">
                  To the maximum extent permitted by Ontario and Canadian law, Dates.care Inc. shall not be liable 
                  for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, 
                  data, or other intangible losses.
                </p>
              </div>
              <p className="leading-relaxed">
                Our maximum liability is limited to the amount paid by you for the service in the 12 months 
                preceding the claim, in accordance with Ontario's Sale of Goods Act.
              </p>
            </div>
          </section>

          {/* 8. Termination */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">8. Termination</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We may terminate or suspend your account with reasonable notice, except in cases of 
                serious misconduct where immediate termination is justified under Ontario employment and contract law.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Grounds for Immediate Termination:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Violation of criminal laws</li>
                  <li>Harassment or abuse of other users</li>
                  <li>Fraudulent payment or identity information</li>
                  <li>Violation of platform community guidelines</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 9. Dispute Resolution */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">9. Dispute Resolution</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Ontario Alternative Dispute Resolution</h4>
                <ol className="space-y-1 text-purple-800 list-decimal ml-4">
                  <li>Informal negotiation (30 days)</li>
                  <li>Mediation through Ontario Commercial Mediation Centre</li>
                  <li>Binding arbitration under Ontario Arbitration Act, 1991</li>
                  <li>Ontario Superior Court of Justice as final resort</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 10. Consumer Rights */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">10. Consumer Rights (Ontario CPA)</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Your Rights Under Ontario Law</h4>
              <ul className="space-y-1 text-green-800">
                <li>• Right to cancel subscriptions within 10 business days</li>
                <li>• Right to clear disclosure of all fees and charges</li>
                <li>• Right to dispute unauthorized charges</li>
                <li>• Protection against unfair business practices</li>
                <li>• Access to Ontario's Consumer Protection Agency for complaints</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">11. Legal Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Dates.care Inc.</h4>
                <p className="text-gray-700">Ontario Corporation #123456789</p>
              </div>
              <div className="space-y-1 text-gray-700">
                <p><strong>Registered Address:</strong> 5515 Eglinton Ave, Etobicoke, ON M9C 5K5, Canada</p>
                <p><strong>Legal Department:</strong> legal@dates.care</p>
                <p><strong>Phone:</strong> +1 (424) 488-7950</p>
                <p><strong>Dispute Resolution:</strong> disputes@dates.care</p>
              </div>
              <div className="text-xs text-gray-600 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p><strong>Regulatory Compliance:</strong></p>
                <p>• Registered with Ontario Consumer Protection Agency</p>
                <p>• Compliant with Personal Information Protection and Electronic Documents Act (PIPEDA)</p>
                <p>• Following Consumer Protection Act, 2002 (Ontario)</p>
              </div>
            </div>
          </section>

          {/* Effective Date and Amendments */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">12. Amendments and Notice</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We reserve the right to modify these Terms with 30 days advance notice via email and 
                platform notification, in compliance with Ontario Consumer Protection Act requirements.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Notice Requirements</h4>
                <ul className="space-y-1 text-orange-800">
                  <li>• Email notification to registered address</li>
                  <li>• In-app notification for 30 days</li>
                  <li>• Posted notice on website legal section</li>
                  <li>• Continued use constitutes acceptance of changes</li>
                </ul>
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