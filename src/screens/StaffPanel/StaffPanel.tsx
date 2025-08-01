import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface StaffPanelProps {
  onNavigate: (screen: string) => void;
}

export const StaffPanel: React.FC<StaffPanelProps> = ({ onNavigate }) => {
  const [currentStaffId, setCurrentStaffId] = useState('admin@dates.care');
  const [targetUserId, setTargetUserId] = useState('');
  const [accessReason, setAccessReason] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState(creditManager.getPendingCreditRequests());

  const isStaff = creditManager.isStaffMember(currentStaffId);
  const isCreditManager = creditManager.isCreditManager(currentStaffId);

  const requestAccess = () => {
    if (!targetUserId || !accessReason) {
      alert('Please provide user ID and reason for access');
      return;
    }

    try {
      const requestId = creditManager.requestCreditAccess(currentStaffId, targetUserId, accessReason);
      alert(`Access request submitted. Request ID: ${requestId}`);
      setAccessReason('');
      setPendingRequests(creditManager.getPendingCreditRequests());
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const approveRequest = (requestId: string) => {
    try {
      creditManager.approveCreditAccess(requestId, currentStaffId);
      alert('Request approved successfully');
      setPendingRequests(creditManager.getPendingCreditRequests());
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const viewUserData = () => {
    if (!targetUserId) {
      alert('Please enter a user ID');
      return;
    }

    try {
      const data = creditManager.getStaffUserData(currentStaffId, targetUserId);
      setUserData(data);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <Layout
      title="Staff Panel"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Staff Panel</h2>
          <p className="text-white/80">Credit Management & User Access</p>
        </div>

        {/* Staff Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Staff Status</p>
              <p className="text-white font-bold">
                {isStaff ? (isCreditManager ? 'Credit Manager' : 'Staff Member') : 'Not Authorized'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isStaff ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <p className="text-white/70 text-sm mt-2">{currentStaffId}</p>
        </div>

        {isStaff && (
          <>
            {/* User Access Request */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Request User Credit Access
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Target User ID</label>
                  <Input
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="user@example.com"
                    className="bg-white/20 text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Reason for Access</label>
                  <Textarea
                    value={accessReason}
                    onChange={(e) => setAccessReason(e.target.value)}
                    placeholder="Customer support inquiry, billing issue, etc."
                    className="bg-white/20 text-white placeholder-white/50"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={requestAccess}
                    className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                    disabled={isCreditManager}
                  >
                    {isCreditManager ? 'Auto-Approved' : 'Request Access'}
                  </Button>
                  <Button
                    onClick={viewUserData}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Data
                  </Button>
                </div>
              </div>
            </div>

            {/* User Data Display */}
            {userData && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  User Credit Information
                </h3>
                
                {userData.accessApproved ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-white/80 text-sm">Complimentary</p>
                        <p className="text-2xl font-bold text-white">{userData.complimentaryCredits}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/80 text-sm">Purchased</p>
                        <p className="text-2xl font-bold text-white">{userData.purchasedCredits}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/80 text-sm">Kobos</p>
                        <p className="text-2xl font-bold text-white">{userData.kobos}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-3">
                      <h4 className="text-white font-medium mb-2">Recent Transactions</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {userData.transactions.slice(-5).map((transaction: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-white/80">{transaction.description}</span>
                            <span className={`font-medium ${
                              transaction.type === 'earn' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white">Access not approved for this user</p>
                    <p className="text-white/70 text-sm">Request approval from Credit Manager</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Requests (Credit Manager Only) */}
            {isCreditManager && pendingRequests.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Pending Access Requests ({pendingRequests.length})
                </h3>
                
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.requestId} className="bg-white/10 rounded-xl p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">{request.staffId}</p>
                          <p className="text-white/70 text-sm">Target: {request.targetUserId}</p>
                        </div>
                        <span className="text-white/60 text-xs">
                          {request.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-3">{request.reason}</p>
                      <Button
                        onClick={() => approveRequest(request.requestId)}
                        className="w-full bg-green-500 text-white hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Access
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Information */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-4">Dates.care Contact Information</h3>
          <div className="space-y-2 text-white/80 text-sm">
            <p><strong>Address:</strong> 5515 Eglinton Ave, Etobicoke, ON, Canada</p>
            <p><strong>Phone:</strong> +1 (613) 861-5799</p>
            <p><strong>Support:</strong> supports@dates.care</p>
            <p><strong>Info:</strong> info@dates.care</p>
            <p><strong>Admin:</strong> admin@dates.care</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};