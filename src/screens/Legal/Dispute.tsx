import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scale, FileText, Phone, Mail, AlertCircle, CheckCircle, Gavel, Shield, Clock, Upload } from 'lucide-react';

interface DisputeProps {
  onNavigate?: (screen: string) => void;
}

export const Dispute: React.FC<DisputeProps> = ({ onNavigate = () => {} }) => {
  const [disputeType, setDisputeType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    evidence: '',
    desiredResolution: '',
    incidentDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disputeTypes = [
    { id: 'billing', name: 'Billing Dispute', description: 'Issues with charges, refunds, or unauthorized transactions', legal: 'Consumer Protection Act, 2002 (Ontario)' },
    { id: 'service', name: 'Service Quality', description: 'Platform functionality or service delivery issues', legal: 'Sale of Goods Act (Ontario)' },
    { id: 'harassment', name: 'User Harassment', description: 'Report inappropriate user behavior or safety concerns', legal: 'Criminal Code of Canada s. 264' },
    { id: 'privacy', name: 'Privacy Violation', description: 'Unauthorized use or disclosure of personal information', legal: 'PIPEDA / Privacy Act' },
    { id: 'discrimination', name: 'Discrimination', description: 'Discriminatory treatment based on protected grounds', legal: 'Ontario Human Rights Code' },
    { id: 'contract', name: 'Contract Dispute', description: 'Disagreement regarding terms or service delivery', legal: 'Contract Law (Ontario)' }
  ];

  const handleSubmit = () => {
    if (!disputeType || !formData.name || !formData.email || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      const disputeId = 'DSP-' + Math.random().toString(36).substring(2).toUpperCase();
      
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-bold">Dispute Filed Successfully!</div>
            <div class="text-sm">Reference: ${disputeId}</div>
          </div>
        </div>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 7000);

      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        description: '', 
        evidence: '', 
        desiredResolution: '', 
        incidentDate: '' 
      });
      setDisputeType('');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Layout
      title="Dispute Resolution"
      onBack={() => onNavigate('welcome')}
      showClose={true}
      onClose={() => onNavigate('welcome')}
    >
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispute Resolution</h2>
          <p className="text-white/80">Fair resolution under Ontario and Canadian law</p>
        </div>

        {/* Legal Framework */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-3 flex items-center">
            <Gavel className="w-5 h-5 mr-2" />
            Ontario Alternative Dispute Resolution Process
          </h3>
          <div className="space-y-2 text-blue-700 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
              <span><strong>Informal Resolution:</strong> Direct negotiation (30 days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">2</span>
              <span><strong>Mediation:</strong> Ontario Commercial Mediation Centre</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">3</span>
              <span><strong>Arbitration:</strong> Binding arbitration under Ontario Arbitration Act</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">4</span>
              <span><strong>Court Action:</strong> Ontario Superior Court of Justice</span>
            </div>
          </div>
        </div>

        {/* Quick Resolution Options */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-green-800 font-semibold mb-3">Quick Resolution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <div>
                <p className="font-medium">Emergency Line:</p>
                <p>+1 (424) 488-7950</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <div>
                <p className="font-medium">Dispute Email:</p>
                <p>disputes@dates.care</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3">
            <strong>Response Time:</strong> Urgent matters within 4 hours, standard disputes within 2 business days
          </p>
        </div>

        {/* Dispute Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Submit Formal Dispute
          </h3>
          
          {/* Dispute Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Dispute Category *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {disputeTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setDisputeType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    disputeType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium text-sm mb-1">{type.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{type.description}</p>
                  <p className="text-xs text-blue-600 font-medium">Legal Basis: {type.legal}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Legal Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full legal name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(XXX) XXX-XXXX"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Incident Date</label>
              <Input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Dispute Details */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Detailed Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide a detailed description of your dispute, including dates, amounts, and relevant circumstances..."
              className="min-h-[120px] w-full"
            />
          </div>

          {/* Supporting Evidence */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Supporting Evidence</label>
            <Textarea
              value={formData.evidence}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
              placeholder="List any supporting evidence: transaction IDs, screenshot descriptions, email references, witness information, etc."
              className="min-h-[80px] w-full"
            />
            <div className="mt-2">
              <Button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
                  input.onchange = (e) => {
                    const files = Array.from((e.target as HTMLInputElement).files || []);
                    if (files.length > 0) {
                      alert(`${files.length} file(s) selected for upload: ${files.map(f => f.name).join(', ')}`);
                    }
                  };
                  input.click();
                }}
                className="bg-gray-500 text-white hover:bg-gray-600 text-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Supporting Documents
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
              </p>
            </div>
          </div>

          {/* Desired Resolution */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Desired Resolution</label>
            <Textarea
              value={formData.desiredResolution}
              onChange={(e) => setFormData(prev => ({ ...prev, desiredResolution: e.target.value }))}
              placeholder="What outcome are you seeking? (e.g., refund, account restoration, policy change, etc.)"
              className="min-h-[80px] w-full"
            />
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Legal Notice</h4>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  By submitting this dispute, you acknowledge that false or misleading information may result in 
                  dismissal of your claim and potential legal consequences under Ontario's Courts of Justice Act. 
                  All information will be treated confidentially in accordance with PIPEDA requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !disputeType || !formData.name || !formData.email || !formData.description}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Filing Dispute...
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 mr-2" />
                Submit Formal Dispute
              </>
            )}
          </Button>
        </div>

        {/* Resolution Process */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-500" />
            Dispute Resolution Process
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Initial Review (24-48 hours)</h4>
                <p className="text-gray-600 text-sm">Our legal team reviews your submission for completeness and jurisdiction</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Investigation Period (5-10 business days)</h4>
                <p className="text-gray-600 text-sm">Thorough investigation with evidence review and fact-finding</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Resolution Proposal (2-3 business days)</h4>
                <p className="text-gray-600 text-sm">Written resolution proposal with legal rationale</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Implementation (1-5 business days)</h4>
                <p className="text-gray-600 text-sm">Resolution implementation and case closure</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 text-sm">
              <strong>Total Process Time:</strong> Typically 10-20 business days. Complex cases may require 
              additional time with regular status updates provided.
            </p>
          </div>
        </div>

        {/* External Dispute Resolution */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">External Dispute Resolution Options</h3>
          
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Ontario Consumer Protection</h4>
              <div className="space-y-1 text-purple-800 text-sm">
                <p><strong>Consumer Protection Ontario:</strong></p>
                <p>Phone: 1-800-889-9768</p>
                <p>Website: www.ontario.ca/consumer-protection</p>
                <p>Email: consumer@ontario.ca</p>
              </div>
            </div>
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">Privacy Commissioner of Canada</h4>
              <div className="space-y-1 text-cyan-800 text-sm">
                <p><strong>For Privacy Disputes:</strong></p>
                <p>Phone: 1-800-282-1376</p>
                <p>Website: www.priv.gc.ca</p>
                <p>Email: info@priv.gc.ca</p>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Better Business Bureau</h4>
              <div className="space-y-1 text-orange-800 text-sm">
                <p><strong>BBB Toronto:</strong></p>
                <p>Phone: (416) 644-4936</p>
                <p>Website: www.bbb.org/toronto</p>
                <p>Online complaint filing available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Dispute Resolution Team
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p><strong>Primary Contact:</strong> disputes@dates.care</p>
              <p><strong>Legal Counsel:</strong> legal@dates.care</p>
              <p><strong>Emergency Line:</strong> +1 (424) 488-7950</p>
            </div>
            <div>
              <p><strong>Mailing Address:</strong></p>
              <p>Dispute Resolution Department</p>
              <p>Dates.care Inc.</p>
              <p>5515 Eglinton Ave, Etobicoke, ON M9C 5K5</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-700">
              <strong>Office Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM EST | 
              Emergency matters handled 24/7
            </p>
          </div>
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
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Back to App
          </button>
        </div>
      </div>
    </Layout>
  );
};