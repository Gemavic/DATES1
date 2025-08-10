import React from 'react';
import { Layout } from '@/components/Layout';
import { Shield, Lock, Eye, Database, Users, MapPin, Phone, Mail, Clock } from 'lucide-react';

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
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Privacy Policy</h2>
          <p className="text-white/80">Last updated: January 14, 2025</p>
          <p className="text-white/60 text-sm mt-2">PIPEDA & CPPA Compliant</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-8 text-sm md:text-base">
          {/* 1. Information Collection - PIPEDA Compliance */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500" />
              1. Information We Collect (PIPEDA Principle 4)
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Personal Information Under PIPEDA</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                  <div>
                    <h5 className="font-medium mb-1">Identity Information:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Full legal name</li>
                      <li>• Date of birth (age verification)</li>
                      <li>• Government-issued photo ID</li>
                      <li>• Verification selfie photographs</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Contact Information:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Email address</li>
                      <li>• Phone number</li>
                      <li>• Residential address</li>
                      <li>• IP address and device info</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Profile and Preference Data:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Profile photos and videos</li>
                  <li>Biography and personal descriptions</li>
                  <li>Dating preferences and match criteria</li>
                  <li>Location data (with explicit consent)</li>
                  <li>Communication history and messages</li>
                  <li>Payment and transaction information</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Automatic Data Collection:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Device type, operating system, browser information</li>
                  <li>Usage patterns and feature interaction data</li>
                  <li>Log files and technical diagnostic information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Legal Basis for Processing */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-500" />
              2. Legal Basis for Processing
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Under Canadian Privacy Legislation:</h4>
              <div className="space-y-2 text-green-800">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Consent:</span>
                  <span>Express consent for sensitive personal information collection</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Contract:</span>
                  <span>Necessary for service delivery and platform operation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Legal Obligation:</span>
                  <span>Age verification, safety monitoring, regulatory compliance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Legitimate Interest:</span>
                  <span>Platform security, fraud prevention, service improvement</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Data Usage and Sharing */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-500" />
              3. How We Use and Share Your Information
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Primary Uses:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Creating and maintaining your dating profile</li>
                  <li>Facilitating matches and connections with other users</li>
                  <li>Processing payments and financial transactions</li>
                  <li>Providing customer support and technical assistance</li>
                  <li>Ensuring platform safety and security</li>
                  <li>Compliance with legal obligations and law enforcement requests</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Information Sharing - Limited Circumstances</h4>
                <ul className="space-y-1 text-yellow-800">
                  <li>• <strong>With Your Consent:</strong> Explicit permission for specific sharing</li>
                  <li>• <strong>Service Providers:</strong> Trusted partners under strict confidentiality agreements</li>
                  <li>• <strong>Legal Requirements:</strong> Court orders, subpoenas, regulatory investigations</li>
                  <li>• <strong>Safety Protection:</strong> Preventing harm, fraud, or illegal activities</li>
                  <li>• <strong>Business Transfers:</strong> Merger, acquisition, or asset sale (with notice)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Data Security and Retention */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">4. Data Security and Retention</h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-900 mb-2">Security Measures (ISO 27001 Standards)</h4>
                <ul className="space-y-1 text-indigo-800">
                  <li>• 256-bit SSL/TLS encryption for data transmission</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• Multi-factor authentication for administrative access</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Secure data centers in Canadian jurisdiction</li>
                  <li>• Employee background checks and confidentiality agreements</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Data Retention Policy:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                  <li><strong>Inactive Accounts:</strong> 24 months after last login</li>
                  <li><strong>Deleted Accounts:</strong> 30 days grace period, then permanent deletion</li>
                  <li><strong>Legal Hold:</strong> Extended retention for legal proceedings</li>
                  <li><strong>Financial Records:</strong> 7 years (CRA requirements)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Your Privacy Rights */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">5. Your Privacy Rights Under Canadian Law</h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-900 mb-2">PIPEDA Individual Rights</h4>
                <ul className="space-y-1 text-cyan-800">
                  <li>• <strong>Right to Access:</strong> Request copies of your personal information</li>
                  <li>• <strong>Right to Correction:</strong> Update or correct inaccurate information</li>
                  <li>• <strong>Right to Deletion:</strong> Request deletion of your personal data</li>
                  <li>• <strong>Right to Portability:</strong> Export your data in standard format</li>
                  <li>• <strong>Right to Withdraw Consent:</strong> Revoke consent for data processing</li>
                  <li>• <strong>Right to Complain:</strong> File complaints with Privacy Commissioner</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How to Exercise Your Rights</h4>
                <div className="space-y-2 text-gray-800">
                  <p><strong>Privacy Officer:</strong> privacy@dates.care</p>
                  <p><strong>Phone:</strong> +1 (424) 488-7950</p>
                  <p><strong>Mail:</strong> Privacy Officer, Dates.care Inc., 5515 Eglinton Ave, Etobicoke, ON M9C 5K5</p>
                  <p className="text-sm mt-2"><strong>Response Time:</strong> Within 30 days as required by PIPEDA</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Cross-Border Data Transfer */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">6. International Data Transfers</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Cross-Border Transfer Notice</h4>
                <p className="text-red-800 leading-relaxed">
                  Some service providers may be located outside Canada. Your personal information may be 
                  processed and stored in the United States or other jurisdictions where our service providers 
                  operate, subject to the laws of those jurisdictions.
                </p>
                <p className="text-red-800 text-sm mt-2">
                  We ensure adequate protection through contractual safeguards and adequacy decisions 
                  where available.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Cookies and Tracking */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Types of Cookies We Use:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="font-medium text-blue-900">Essential Cookies</h5>
                    <p className="text-blue-800 text-sm">Required for platform functionality</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-900">Analytics Cookies</h5>
                    <p className="text-green-800 text-sm">Help us improve user experience</p>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                You can manage cookie preferences through your browser settings. Disabling essential cookies 
                may affect platform functionality.
              </p>
            </div>
          </section>

          {/* 8. Children's Privacy */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">8. Protection of Minors</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Strict Age Verification Policy</h4>
              <ul className="space-y-1 text-red-800">
                <li>• Service restricted to users 18 years and older</li>
                <li>• Mandatory age verification with government-issued ID</li>
                <li>• Zero tolerance for underage users</li>
                <li>• Immediate account termination and reporting if minors detected</li>
                <li>• Compliance with Protection of Children Act (Ontario)</li>
              </ul>
            </div>
          </section>

          {/* 9. Data Breach Response */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">9. Data Breach Response Protocol</h3>
            <div className="space-y-3 text-gray-700">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">PIPEDA Breach Notification Requirements</h4>
                <ul className="space-y-1 text-orange-800">
                  <li>• Privacy Commissioner notified within 72 hours</li>
                  <li>• Affected users notified without undue delay</li>
                  <li>• Risk assessment and mitigation measures implemented</li>
                  <li>• Detailed incident documentation maintained</li>
                  <li>• Third-party forensic investigation when necessary</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 10. Quebec Privacy Act Compliance */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">10. Quebec Users - Additional Rights</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Act Respecting the Protection of Personal Information (Quebec)</h4>
              <ul className="space-y-1 text-purple-800">
                <li>• Enhanced consent requirements for sensitive data</li>
                <li>• Right to data portability in structured format</li>
                <li>• Mandatory privacy impact assessments</li>
                <li>• Local data residency preferences respected</li>
                <li>• Additional cooling-off period for subscription services</li>
              </ul>
            </div>
          </section>

          {/* 11. California Privacy Rights */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">11. California Users - CCPA Rights</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">California Consumer Privacy Act (CCPA) Compliance</h4>
              <ul className="space-y-1 text-yellow-800">
                <li>• Right to know what personal information is collected</li>
                <li>• Right to delete personal information</li>
                <li>• Right to opt-out of sale of personal information</li>
                <li>• Right to non-discrimination for exercising privacy rights</li>
                <li>• Toll-free number: 1-800-XXX-XXXX for California residents</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">12. Privacy Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Chief Privacy Officer
                </h4>
                <p className="text-gray-700">Dates.care Inc.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    <span><strong>Email:</strong> privacy@dates.care</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                    <span><strong>Phone:</strong> +1 (424) 488-7950</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500 mt-0.5" />
                    <div>
                      <p><strong>Address:</strong></p>
                      <p>Chief Privacy Officer</p>
                      <p>Dates.care Inc.</p>
                      <p>5515 Eglinton Ave</p>
                      <p>Etobicoke, ON M9C 5K5</p>
                      <p>Canada</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded mt-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Response Timeframes:</span>
                </div>
                <ul className="space-y-1">
                  <li>• Privacy inquiries: 3-5 business days</li>
                  <li>• Data access requests: 30 days (PIPEDA requirement)</li>
                  <li>• Data deletion requests: 30 days</li>
                  <li>• Complaint investigations: 30-60 days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Regulatory Oversight */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">13. Regulatory Oversight</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Filing Complaints</h4>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Privacy Commissioner of Canada:</strong></p>
                <p>Email: info@priv.gc.ca | Phone: 1-800-282-1376</p>
                <p>Website: www.priv.gc.ca</p>
                
                <p className="mt-3"><strong>Ontario Information and Privacy Commissioner:</strong></p>
                <p>Email: info@ipc.on.ca | Phone: 1-800-387-0073</p>
                <p>Website: www.ipc.on.ca</p>
              </div>
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