import React, { useState } from 'react';
import { Shield, Users, CreditCard, Settings, Search, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'moderator' | 'credit_manager';
  status: 'active' | 'inactive';
}

export const StaffPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'credits' | 'requests'>('overview');
  const [searchUserId, setSearchUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [accessReason, setAccessReason] = useState('');
  const [resettlementAmount, setResettlementAmount] = useState('');
  const [resettlementReason, setResettlementReason] = useState('');
  const [resettlementCategory, setResettlementCategory] = useState<'dispute' | 'platform_glitch' | 'technical_error' | 'billing_error' | 'other'>('dispute');
  const [resettlementEvidence, setResettlementEvidence] = useState('');

  const currentStaffId = 'admin@dates.care'; // Simulated current staff member

  const staffMembers: StaffMember[] = [
    { id: '1', name: 'Admin User', email: 'admin@dates.care', role: 'admin', status: 'active' },
    { id: '2', name: 'Support Agent', email: 'support@dates.care', role: 'support', status: 'active' },
    { id: '3', name: 'Credit Manager', email: 'creditmanager@dates.care', role: 'credit_manager', status: 'active' },
    { id: '4', name: 'Moderator', email: 'moderator@dates.care', role: 'moderator', status: 'active' }
  ];

  const handleRequestAccess = () => {
    if (!searchUserId || !accessReason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const requestId = creditManager.requestCreditAccess(currentStaffId, searchUserId, accessReason);
      alert(`Credit access request submitted: ${requestId}`);
      setAccessReason('');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleRequestResettlement = () => {
    if (!searchUserId || !resettlementAmount || !resettlementReason) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseInt(resettlementAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const requestId = creditManager.requestCreditResettlement(
        currentStaffId,
        searchUserId,
        amount,
        resettlementReason,
        resettlementCategory,
        resettlementEvidence || undefined
      );
      alert(`Credit resettlement request submitted: ${requestId}`);
      setResettlementAmount('');
      setResettlementReason('');
      setResettlementEvidence('');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleApproveAccess = (requestId: string) => {
    try {
      creditManager.approveCreditAccess(requestId, currentStaffId);
      alert('Credit access approved');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleApproveResettlement = (requestId: string) => {
    try {
      creditManager.approveCreditResettlement(requestId, currentStaffId);
      alert('Credit resettlement approved and processed');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const getUserData = () => {
    if (!searchUserId) return null;
    try {
      return creditManager.getStaffUserData(currentStaffId, searchUserId);
    } catch (error) {
      return null;
    }
  };

  const userData = getUserData();
  const pendingRequests = creditManager.getPendingCreditRequests();
  const pendingResettlements = creditManager.getPendingCreditResettlements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto min-h-screen relative">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Staff Panel
            </h1>
            <div className="text-sm text-gray-600">
              Logged in as: {currentStaffId}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/20">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'credits', label: 'Credit Management', icon: CreditCard },
              { id: 'requests', label: 'Pending Requests', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === tab.id 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Staff</p>
                      <p className="text-2xl font-bold text-gray-900">{staffMembers.filter(s => s.status === 'active').length}</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingRequests.length + pendingResettlements.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Members</h3>
                <div className="space-y-3">
                  {staffMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'admin' ? 'bg-red-100 text-red-800' :
                          member.role === 'credit_manager' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'support' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role.replace('_', ' ')}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Search</h3>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter user email or ID"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => setSelectedUser(searchUserId)}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {userData && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Credit Information</h3>
                  {userData.accessApproved ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Complimentary Credits</p>
                        <p className="text-xl font-bold text-blue-600">{userData.complimentaryCredits}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Purchased Credits</p>
                        <p className="text-xl font-bold text-green-600">{userData.purchasedCredits}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Credits</p>
                        <p className="text-xl font-bold text-purple-600">{userData.totalCredits}</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <p className="text-sm text-gray-600">Chat Kobos</p>
                        <p className="text-xl font-bold text-pink-600">{userData.kobos}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Access to user credit data requires approval</p>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Reason for accessing user credit data..."
                          value={accessReason}
                          onChange={(e) => setAccessReason(e.target.value)}
                          className="w-full"
                        />
                        <Button onClick={handleRequestAccess} className="bg-orange-500 text-white hover:bg-orange-600">
                          Request Access
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'credits' && (
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Resettlement Request</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User ID/Email</label>
                    <Input
                      placeholder="Enter user email or ID"
                      value={searchUserId}
                      onChange={(e) => setSearchUserId(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter credit amount to compensate"
                      value={resettlementAmount}
                      onChange={(e) => setResettlementAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={resettlementCategory}
                      onChange={(e) => setResettlementCategory(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="dispute">User Dispute</option>
                      <option value="platform_glitch">Platform Glitch</option>
                      <option value="technical_error">Technical Error</option>
                      <option value="billing_error">Billing Error</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <Textarea
                      placeholder="Brief explanation for credit resettlement..."
                      value={resettlementReason}
                      onChange={(e) => setResettlementReason(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evidence (Optional)</label>
                    <Textarea
                      placeholder="Additional notes or evidence..."
                      value={resettlementEvidence}
                      onChange={(e) => setResettlementEvidence(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleRequestResettlement}
                    className="w-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Submit Resettlement Request
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              {/* Credit Access Requests */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Credit Access Requests</h3>
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No pending access requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div key={request.requestId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">Staff: {request.staffId}</p>
                            <p className="text-sm text-gray-600">Target User: {request.targetUserId}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">Reason: {request.reason}</p>
                        <Button 
                          onClick={() => handleApproveAccess(request.requestId)}
                          className="bg-green-500 text-white hover:bg-green-600"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Access
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Credit Resettlement Requests */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Credit Resettlement Requests</h3>
                {pendingResettlements.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No pending resettlement requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingResettlements.map((request) => (
                      <div key={request.requestId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">Request ID: {request.requestId}</p>
                            <p className="text-sm text-gray-600">Staff: {request.staffId}</p>
                            <p className="text-sm text-gray-600">User: {request.targetUserId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{formatCredits(request.amount)}</p>
                            <p className="text-xs text-gray-500">{request.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Category:</span> {request.category.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                          {request.evidence && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Evidence:</span> {request.evidence}
                            </p>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleApproveResettlement(request.requestId)}
                          className="bg-green-500 text-white hover:bg-green-600"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Process
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};