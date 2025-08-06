import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scale, FileText, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react';

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
    evidence: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disputeTypes = [
    { id: 'billing', name: 'Billing Dispute', description: 'Issues with charges or payments' },
    { id: 'refund', name: 'Refund Request', description: 'Request for credit refund' },
    { id: 'harassment', name: 'User Harassment', description: 'Report inappropriate user behavior' },
    { id: 'technical', name: 'Technical Issues', description: 'Platform or app problems' },
    { id: 'privacy', name: 'Privacy Concern', description: 'Data privacy or security issues' },
    { id: 'other', name: 'Other', description: 'Other dispute or concern' }
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
      successMessage.textContent = `✅ Dispute submitted successfully! Reference: ${disputeId}`;
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 5000);

      // Reset form
      setFormData({ name: '', email: '', phone: '', description: '', evidence: '' });
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
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispute Resolution</h2>
          <p className="text-white/80">We're here to help resolve any issues</p>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-3">Quick Resolution</h3>
          <div className="space-y-2 text-blue-700 text-sm">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>Call us: +1 (424) 488-7950</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>Email: disputes@dates.care</span>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              For urgent matters, calling is the fastest way to reach our dispute resolution team.
            </p>
          </div>
        </div>

        {/* Dispute Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Submit Dispute</h3>
          
          {/* Dispute Type */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Dispute Type</label>
            <div className="grid grid-cols-2 gap-2">
              {disputeTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setDisputeType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    disputeType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-sm">{type.name}</h4>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Dispute Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please describe your dispute in detail..."
              className="min-h-[120px]"
            />
          </div>

          {/* Evidence */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Supporting Evidence</label>
            <Textarea
              value={formData.evidence}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
              placeholder="Any additional information, transaction IDs, screenshots descriptions, etc."
              className="min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !disputeType || !formData.name || !formData.email || !formData.description}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </div>

        {/* Resolution Process */}
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resolution Process</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Submission Review</p>
                <p className="text-gray-600 text-sm">We review your dispute within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Investigation</p>
                <p className="text-gray-600 text-sm">Our team investigates the matter thoroughly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Resolution</p>
                <p className="text-gray-600 text-sm">We provide a resolution within 5-7 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Dispute Resolution Team</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>📧 disputes@dates.care</p>
            <p>📞 +1 (424) 488-7950</p>
            <p>📍 5515 Eglinton Ave, Etobicoke, ON, Canada</p>
            <p className="text-xs text-gray-600 mt-2">Available Monday-Friday, 9 AM - 6 PM EST</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};