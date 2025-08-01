import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  User, 
  Camera,
  FileText,
  Clock
} from 'lucide-react';
import { 
  verificationManager, 
  getVerificationStatus, 
  getVerificationRequirements,
  startVerification,
  uploadVerificationDocument,
  submitVerificationRequest
} from '@/lib/verification';

interface VerificationProps {
  onNavigate: (screen: string) => void;
}

export const Verification: React.FC<VerificationProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationId, setVerificationId] = useState<string>('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Canada'
    },
    legalName: {
      firstName: '',
      lastName: '',
      middleName: ''
    }
  });

  const verificationStatus = getVerificationStatus('current-user');
  const requirements = getVerificationRequirements();

  React.useEffect(() => {
    if (!verificationId) {
      const id = startVerification('current-user', 'user@example.com', 'Current User');
      setVerificationId(id);
    }
  }, []);

  const handleFileUpload = (type: 'government_id' | 'selfie' | 'address_proof', file: File) => {
    // Simulate file upload
    const fileUrl = `https://dates.care/uploads/${file.name}`;
    const success = uploadVerificationDocument(verificationId, type, file.name, fileUrl);
    
    if (success) {
      alert(`${file.name} uploaded successfully!`);
    }
  };

  const sendPhoneVerification = () => {
    const code = verificationManager.sendPhoneVerification(formData.phoneNumber);
    alert(`Verification code sent to ${formData.phoneNumber}: ${code}`);
  };

  const verifyPhone = () => {
    // In real app, this would verify against the sent code
    const isValid = phoneCode === '123456'; // Demo code
    setPhoneVerified(isValid);
    
    if (isValid) {
      alert('Phone number verified successfully!');
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  const submitVerification = () => {
    // Update personal info
    verificationManager.updatePersonalInfo(verificationId, {
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      legalName: formData.legalName
    });

    const success = submitVerificationRequest(verificationId);
    
    if (success) {
      alert('Verification submitted successfully! Our team will review your documents within 24-48 hours.');
      onNavigate('profile');
    } else {
      alert('Please complete all required fields and upload all documents.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h3>
              <p className="text-gray-600">Help us verify your identity to keep our community safe</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Required Documents</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Government-issued photo ID</span>
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  <span>Selfie holding your ID</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Address verification document</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Phone number verification</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Legal name information</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Start Verification
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Upload Documents</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">Government ID</p>
                <p className="text-xs text-gray-500 mb-3">Driver's License, Passport, or National ID</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('government_id', e.target.files[0])}
                  className="hidden"
                  id="gov-id"
                />
                <label htmlFor="gov-id">
                  <Button className="bg-gray-500 text-white cursor-pointer">
                    Upload ID
                  </Button>
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">Selfie with ID</p>
                <p className="text-xs text-gray-500 mb-3">Clear photo of you holding your ID</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                  className="hidden"
                  id="selfie"
                />
                <label htmlFor="selfie">
                  <Button className="bg-gray-500 text-white cursor-pointer">
                    Upload Selfie
                  </Button>
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">Address Proof</p>
                <p className="text-xs text-gray-500 mb-3">Utility bill, bank statement, or lease</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('address_proof', e.target.files[0])}
                  className="hidden"
                  id="address"
                />
                <label htmlFor="address">
                  <Button className="bg-gray-500 text-white cursor-pointer">
                    Upload Document
                  </Button>
                </label>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(3)}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Continue
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First Name"
                    value={formData.legalName.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      legalName: { ...prev.legalName, firstName: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Last Name"
                    value={formData.legalName.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      legalName: { ...prev.legalName, lastName: e.target.value }
                    }))}
                  />
                </div>
                <Input
                  placeholder="Middle Name (Optional)"
                  className="mt-3"
                  value={formData.legalName.middleName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    legalName: { ...prev.legalName, middleName: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="space-y-3">
                  <Input
                    placeholder="Street Address"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value }
                    }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Province"
                      value={formData.address.province}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, province: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Postal Code"
                      value={formData.address.postalCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, postalCode: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Country"
                      value={formData.address.country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, country: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(4)}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Continue
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Phone Verification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex space-x-3">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendPhoneVerification}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    disabled={!formData.phoneNumber}
                  >
                    Send Code
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter 6-digit code"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button
                    onClick={verifyPhone}
                    className="bg-green-500 text-white hover:bg-green-600"
                    disabled={phoneCode.length !== 6}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {phoneVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Phone number verified!</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => setCurrentStep(5)}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              disabled={!phoneVerified}
            >
              Continue
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Submit</h3>
              <p className="text-gray-600">Review your information and submit for verification</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Verification Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Documents Uploaded:</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal Information:</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Verification:</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">Review Process</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    Our verification team will review your submission within 24-48 hours. 
                    You'll receive an email notification once the review is complete.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={submitVerification}
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              Submit for Verification
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      title="Account Verification"
      onBack={() => onNavigate('profile')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="mt-6 flex space-x-3">
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
            >
              Previous
            </Button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Need help with verification?
          </p>
          <p className="text-gray-800 text-sm">
            Contact: verification@dates.care | +1 (613) 861-5799
          </p>
        </div>
      </div>
    </Layout>
  );
};