import React from 'react';
import { Layout } from '@/components/Layout';
import { AlertTriangle, Shield, Heart, Users, Gavel, FileText, Phone, Mail, Clock } from 'lucide-react';

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
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Legal Disclaimer</h2>
          <p className="text-white/80">Important legal notices and limitations</p>
          <p className="text-white/60 text-sm mt-2">Ontario, Canada Legal Framework</p>
        </div>

        {/* Disclaimer Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-8 text-sm md:text-base">
          {/* 1. General Disclaimer */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 mr-2 text-orange-500" />
              1. General Disclaimer of Warranties
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                The services provided by Dates.care Inc. are offered "as is" and "as available" without 
                warranties of any kind, either express or implied, to the fullest extent permitted by Ontario 
                and Canadian law.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Specifically Disclaimed:</h4>
                <ul className="space-y-1 text-orange-800">
                  <li>• Warranties of merchantability or fitness for particular purpose</li>
                  <li>• Guarantees of service availability or uninterrupted operation</li>
                  <li>• Warranties regarding accuracy or completeness of user information</li>
                  <li>• Guarantees of successful romantic outcomes or relationships</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Dating Service Specific Disclaimers */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 text-pink-500" />
              2. Dating Service Disclaimers
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-semibold text-pink-900 mb-2">No Guarantee of Romantic Success</h4>
                <p className="text-pink-800 leading-relaxed">
                  Dates.care is a platform that facilitates introductions between consenting adults. 
                  We do not guarantee, warrant, or represent that you will:
                </p>
                <ul className="space-y-1 text-pink-800 mt-2">
                  <li>• Find a romantic partner or spouse</li>
                  <li>• Achieve successful dates or relationships</li>
                  <li>• Experience compatibility with matched users</li>
                  <li>• Meet users who accurately represent themselves</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">User Verification Limitations</h4>
                <p className="text-yellow-800">
                  While we implement identity verification measures, we cannot guarantee the complete 
                  accuracy of all user profiles, photos, or personal information. Users are responsible 
                  for exercising due diligence in their interactions.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Safety and Personal Security */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500" />
              3. Personal Safety and Security Disclaimer
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Personal Safety Responsibility</h4>
                <p className="text-red-800 leading-relaxed mb-3">
                  Meeting strangers carries inherent risks. Users assume full responsibility for their 
                  personal safety when meeting other users in person.
                </p>
                <div className="space-y-2 text-red-800">
                  <h5 className="font-medium">Mandatory Safety Guidelines:</h5>
                  <ul className="space-y-1 list-disc ml-4">
                    <li>Always meet in public places for initial meetings</li>
                    <li>Inform trusted contacts of your plans and location</li>
                    <li>Arrange your own transportation</li>
                    <li>Trust your instincts and leave if you feel unsafe</li>
                    <li>Never share financial information or send money</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Platform Security Measures</h4>
                <p className="text-blue-800">
                  We implement reporting tools, content moderation, and verification systems, but cannot 
                  guarantee the prevention of all harmful behavior or ensure the safety of offline interactions.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Limitation of Liability */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Gavel className="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-500" />
              4. Limitation of Liability (Ontario Law)
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Liability Limitations Under Ontario Law</h4>
                <p className="text-purple-800 leading-relaxed mb-3">
                  In no event shall Dates.care Inc., its directors, officers, employees, or agents be liable for:
                </p>
                <ul className="space-y-1 text-purple-800">
                  <li>• Indirect, incidental, special, or consequential damages</li>
                  <li>• Loss of profits, data, or business opportunities</li>
                  <li>• Damages arising from user interactions or offline meetings</li>
                  <li>• Third-party actions or content</li>
                  <li>• Service interruptions or technical failures</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Maximum Liability Cap</h4>
                <p className="text-gray-800">
                  Our total liability to you for all claims arising from or relating to the service shall not 
                  exceed the greater of: (a) $100 CAD, or (b) the amount paid by you to Dates.care in the 
                  12 months preceding the claim.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  This limitation applies except where prohibited by mandatory consumer protection laws.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Indemnification */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">5. User Indemnification</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless Dates.care Inc. and its affiliates from any 
                claims, damages, losses, or expenses arising from:
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Your use or misuse of the service</li>
                <li>Your violation of these Terms or applicable laws</li>
                <li>Content you submit or share through the platform</li>
                <li>Your interactions with other users</li>
                <li>Any false or misleading information you provide</li>
              </ul>
            </div>
          </section>

          {/* 6. Third-Party Services */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">6. Third-Party Services and Links</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-900 mb-2">External Service Providers</h4>
                <ul className="space-y-1 text-cyan-800">
                  <li>• <strong>Payment Processing:</strong> Stripe Inc. (PCI DSS compliant)</li>
                  <li>• <strong>Cloud Infrastructure:</strong> Various providers with data residency agreements</li>
                  <li>• <strong>Analytics:</strong> Privacy-compliant analytics services</li>
                  <li>• <strong>Communication:</strong> Email and SMS service providers</li>
                </ul>
                <p className="text-cyan-800 text-sm mt-2">
                  We are not responsible for the privacy practices or content of third-party services.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Force Majeure */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">7. Force Majeure</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                We shall not be liable for any failure or delay in performance due to circumstances beyond our 
                reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, 
                pandemic, government actions, or technical failures.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">8. Legal Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Dates.care Inc.</h4>
                <p className="text-gray-700">Ontario Corporation Registration #ON123456789</p>
                <p className="text-gray-700">HST/GST Registration #123456789RT0001</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p><strong>Legal Department:</strong> legal@dates.care</p>
                  <p><strong>Compliance Officer:</strong> compliance@dates.care</p>
                  <p><strong>Phone:</strong> +1 (424) 488-7950</p>
                </div>
                <div>
                  <p><strong>Registered Office:</strong></p>
                  <p>5515 Eglinton Ave</p>
                  <p>Etobicoke, ON M9C 5K5</p>
                  <p>Canada</p>
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
            onClick={() => onNavigate('dispute')}
            className="w-full bg-white/20 text-white py-3 rounded-xl hover:bg-white/30 transition-colors"
          >
            Dispute Resolution
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