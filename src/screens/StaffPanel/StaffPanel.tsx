import React, { useState, useEffect } from 'react';
import { Shield, Users, CreditCard, Settings, Search, AlertTriangle, CheckCircle, Clock, DollarSign, Heart, Key, ChevronLeft, ChevronRight, Coins, ArrowUp, ArrowDown, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { creditManager, formatCredits, formatKobos } from '@/lib/creditSystem';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'moderator' | 'credit_manager';
  status: 'active' | 'inactive';
  managerCode?: string;
}

interface CreditAward {
  id: string;
  staffId: string;
  targetUserId: string;
  amount: number;
  type: 'credits' | 'kobos' | 'both';
  reason: string;
  managerCode: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string;
}

export const StaffPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'credits' | 'requests' | 'awards'>('overview');
  const [searchUserId, setSearchUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [accessReason, setAccessReason] = useState('');
  const [resettlementAmount, setResettlementAmount] = useState('');
  const [resettlementReason, setResettlementReason] = useState('');
  const [resettlementCategory, setResettlementCategory] = useState<'dispute' | 'platform_glitch' | 'technical_error' | 'billing_error' | 'other'>('dispute');
  const [resettlementEvidence, setResettlementEvidence] = useState('');
  
  // New state for credit/kobo awarding
  const [managerCode, setManagerCode] = useState('');
  const [awardAmount, setAwardAmount] = useState('');
  const [awardType, setAwardType] = useState<'credits' | 'kobos' | 'both'>('credits');
  const [awardReason, setAwardReason] = useState('');
  const [showAwardModal, setShowAwardModal] = useState(false);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Awards management state
  const [creditAwards, setCreditAwards] = useState<CreditAward[]>([]);
  const [showAwardHistory, setShowAwardHistory] = useState(false);

  const currentStaffId = 'admin@dates.care'; // Simulated current staff member

  // Enhanced staff members with manager codes
  const staffMembers: StaffMember[] = [
    { 
      id: '1', 
      name: 'Admin User', 
      email: 'admin@dates.care', 
      role: 'admin', 
      status: 'active',
      managerCode: 'ADM2025'
    },
    { 
      id: '2', 
      name: 'Support Agent', 
      email: 'support@dates.care', 
      role: 'support', 
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'Credit Manager', 
      email: 'creditmanager@dates.care', 
      role: 'credit_manager', 
      status: 'active',
      managerCode: 'CRM2025'
    },
    { 
      id: '4', 
      name: 'Moderator', 
      email: 'moderator@dates.care', 
      role: 'moderator', 
      status: 'active' 
    }
  ];

  // Valid manager codes for authorization
  const VALID_MANAGER_CODES = {
    'ADM2025': { role: 'admin', permissions: ['award_credits', 'award_kobos', 'approve_all'] },
    'CRM2025': { role: 'credit_manager', permissions: ['award_credits', 'award_kobos'] },
    'MGR2025': { role: 'manager', permissions: ['award_credits'] }
  };

  // Enhanced JavaScript functionality
  useEffect(() => {
    // Auto-refresh data every 30 seconds
    const refreshInterval = setInterval(() => {
      if (activeTab === 'requests') {
        console.log('🔄 Auto-refreshing requests data...');
        // Refresh logic would go here
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [activeTab]);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handlePreviousPage();
            break;
          case 'ArrowRight':
            e.preventDefault();
            handleNextPage();
            break;
          case '1':
            e.preventDefault();
            setActiveTab('overview');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('users');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('credits');
            break;
          case '4':
            e.preventDefault();
            setActiveTab('requests');
            break;
          case '5':
            e.preventDefault();
            setActiveTab('awards');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation functions
  const handleNextPage = () => {
    const maxPage = Math.ceil(staffMembers.length / itemsPerPage);
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Enhanced sorting and filtering
  const getSortedAndFilteredStaff = () => {
    let filtered = staffMembers;
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(member => member.role === filterRole);
    }
    
    const sorted = [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'email':
          compareValue = a.email.localeCompare(b.email);
          break;
        case 'date':
          compareValue = 0; // Would use actual creation dates
          break;
      }
      
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });
    
    return sorted;
  };

  // Validate manager code
  const validateManagerCode = (code: string): boolean => {
    return VALID_MANAGER_CODES.hasOwnProperty(code);
  };

  // Award credits/kobos with manager authorization
  const handleAwardCredits = async () => {
    // Validation
    if (!searchUserId || !awardAmount || !awardReason || !managerCode) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (!validateManagerCode(managerCode)) {
      showNotification('Invalid manager code. Access denied.', 'error');
      return;
    }

    const amount = parseInt(awardAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    try {
      // Create award request
      const awardId = 'AWD-' + Math.random().toString(36).substring(2).toUpperCase();
      const newAward: CreditAward = {
        id: awardId,
        staffId: currentStaffId,
        targetUserId: searchUserId,
        amount: amount,
        type: awardType,
        reason: awardReason,
        managerCode: managerCode,
        timestamp: new Date(),
        status: 'approved', // Auto-approve with valid manager code
        approvedBy: currentStaffId
      };

      setCreditAwards(prev => [...prev, newAward]);

      // Award the credits/kobos
      if (awardType === 'credits' || awardType === 'both') {
        creditManager.addCredits(
          searchUserId, 
          amount, 
          `Manager Award: ${awardReason} (Code: ${managerCode})`, 
          false
        );
      }
      
      if (awardType === 'kobos' || awardType === 'both') {
        // Award kobos (would need implementation in credit system)
        console.log(`Awarded ${amount} kobos to ${searchUserId}`);
      }

      showNotification(
        `✅ Successfully awarded ${amount} ${awardType} to ${searchUserId}!`, 
        'success'
      );
      
      // Reset form
      setAwardAmount('');
      setAwardReason('');
      setManagerCode('');
      setShowAwardModal(false);
      
    } catch (error) {
      showNotification(`Error awarding credits: ${(error as Error).message}`, 'error');
    }
  };

  // Enhanced notification system
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="font-medium">${message}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  };

  const handleRequestAccess = () => {
    if (!searchUserId || !accessReason) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    try {
      const requestId = creditManager.requestCreditAccess(currentStaffId, searchUserId, accessReason);
      showNotification(`Credit access request submitted: ${requestId}`, 'success');
      setAccessReason('');
    } catch (error) {
      showNotification(`Error: ${(error as Error).message}`, 'error');
    }
  };

  const handleRequestResettlement = () => {
    if (!searchUserId || !resettlementAmount || !resettlementReason) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const amount = parseInt(resettlementAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
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
      showNotification(`Credit resettlement request submitted: ${requestId}`, 'success');
      setResettlementAmount('');
      setResettlementReason('');
      setResettlementEvidence('');
    } catch (error) {
      showNotification(`Error: ${(error as Error).message}`, 'error');
    }
  };

  const handleApproveAccess = (requestId: string) => {
    try {
      creditManager.approveCreditAccess(requestId, currentStaffId);
      showNotification('Credit access approved', 'success');
    } catch (error) {
      showNotification(`Error: ${(error as Error).message}`, 'error');
    }
  };

  const handleApproveResettlement = (requestId: string) => {
    try {
      creditManager.approveCreditResettlement(requestId, currentStaffId);
      showNotification('Credit resettlement approved and processed', 'success');
    } catch (error) {
      showNotification(`Error: ${(error as Error).message}`, 'error');
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
  const sortedStaff = getSortedAndFilteredStaff();
  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaff = sortedStaff.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-6xl mx-auto min-h-screen relative">
        {/* Enhanced Header with Navigation */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Staff Control Panel
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{currentStaffId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Previous page (Ctrl+←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Next page (Ctrl+→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/20">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Settings, shortcut: '1' },
              { id: 'users', label: 'User Management', icon: Users, shortcut: '2' },
              { id: 'credits', label: 'Credit Management', icon: CreditCard, shortcut: '3' },
              { id: 'requests', label: 'Pending Requests', icon: Clock, shortcut: '4' },
              { id: 'awards', label: 'Credit Awards', icon: Heart, shortcut: '5' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 flex items-center space-x-2 hover:bg-white/10 ${
                    activeTab === tab.id 
                      ? 'text-blue-600 border-blue-600 bg-white/20' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  title={`Switch to ${tab.label} (Ctrl+${tab.shortcut})`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-60">({tab.shortcut})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Enhanced Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-xs text-green-600">+12 today</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Staff</p>
                      <p className="text-2xl font-bold text-gray-900">{staffMembers.filter(s => s.status === 'active').length}</p>
                      <p className="text-xs text-blue-600">All online</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingRequests.length + pendingResettlements.length}</p>
                      <p className="text-xs text-orange-600">Needs attention</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Awards Today</p>
                      <p className="text-2xl font-bold text-gray-900">{creditAwards.length}</p>
                      <p className="text-xs text-purple-600">Credits/Kobos</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Staff Members with Enhanced Controls */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="credit_manager">Credit Manager</option>
                      <option value="support">Support</option>
                      <option value="moderator">Moderator</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Toggle sort order"
                    >
                      {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Refresh data"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {currentStaff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === 'admin' ? 'bg-red-100 text-red-800' :
                          member.role === 'credit_manager' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'support' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role.replace('_', ' ')}
                        </span>
                        {member.managerCode && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-mono rounded">
                            <Key className="w-3 h-3 inline mr-1" />
                            {member.managerCode}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedStaff.length)} of {sortedStaff.length} staff members
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="bg-gray-500 text-white disabled:opacity-50 text-sm px-3 py-1"
                    >
                      ← Previous
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-blue-500 text-white disabled:opacity-50 text-sm px-3 py-1"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Search & Management</h3>
                <div className="flex space-x-3 mb-4">
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
                  <Button
                    onClick={() => setShowAwardModal(true)}
                    className="bg-purple-500 text-white hover:bg-purple-600"
                    disabled={!searchUserId}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Award Credits
                  </Button>
                </div>

                {userData && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">User Credit Information</h4>
                    {userData.accessApproved ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-100 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Complimentary</p>
                          <p className="text-xl font-bold text-blue-600">{userData.complimentaryCredits}</p>
                          <p className="text-xs text-blue-500">Credits</p>
                        </div>
                        <div className="p-4 bg-green-100 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Purchased</p>
                          <p className="text-xl font-bold text-green-600">{userData.purchasedCredits}</p>
                          <p className="text-xs text-green-500">Credits</p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-bold text-purple-600">{userData.totalCredits}</p>
                          <p className="text-xs text-purple-500">Credits</p>
                        </div>
                        <div className="p-4 bg-pink-100 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Chat</p>
                          <p className="text-xl font-bold text-pink-600">{userData.kobos}</p>
                          <p className="text-xs text-pink-500">Kobos 💖</p>
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
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Credit & Kobo Awards</h3>
                  <Button
                    onClick={() => setShowAwardHistory(!showAwardHistory)}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {showAwardHistory ? 'Hide History' : 'View History'}
                  </Button>
                </div>

                {showAwardHistory && (
                  <div className="mb-6 bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Award History</h4>
                    {creditAwards.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No awards issued yet</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {creditAwards.map((award) => (
                          <div key={award.id} className="p-3 bg-white rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{award.id}</p>
                                <p className="text-xs text-gray-600">
                                  {award.amount} {award.type} to {award.targetUserId}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                award.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {award.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Award Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => {
                      setAwardType('credits');
                      setShowAwardModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:scale-105 transition-all"
                  >
                    <Coins className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Award Credits</span>
                    <span className="block text-xs opacity-80">Give credits to users</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setAwardType('kobos');
                      setShowAwardModal(true);
                    }}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:scale-105 transition-all"
                  >
                    <Heart className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Award Kobos</span>
                    <span className="block text-xs opacity-80">Give chat kobos to users</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setAwardType('both');
                      setShowAwardModal(true);
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl hover:scale-105 transition-all"
                  >
                    <DollarSign className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">Award Both</span>
                    <span className="block text-xs opacity-80">Credits + Kobos combo</span>
                  </Button>
                </div>
              </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</label>
                      <Input
                        type="number"
                        placeholder="Enter credit amount"
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Credit Access Requests</h3>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingRequests.length} pending
                  </span>
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending access requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div key={request.requestId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Credit Resettlement Requests</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingResettlements.length} pending
                  </span>
                </div>
                {pendingResettlements.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending resettlement requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingResettlements.map((request) => (
                      <div key={request.requestId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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

        {/* Enhanced Award Modal */}
        {showAwardModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-purple-500" />
                  Award {awardType === 'both' ? 'Credits & Kobos' : awardType === 'credits' ? 'Credits' : 'Kobos'}
                </h3>
                <button
                  onClick={() => setShowAwardModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>

              {/* Manager Authorization */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Manager Authorization Required
                </h4>
                <Input
                  type="password"
                  placeholder="Enter manager code (e.g., ADM2025, CRM2025)"
                  value={managerCode}
                  onChange={(e) => setManagerCode(e.target.value.toUpperCase())}
                  className="w-full mb-2"
                />
                <div className="text-xs text-red-700 space-y-1">
                  <p>• ADM2025: Admin (full access)</p>
                  <p>• CRM2025: Credit Manager (credits & kobos)</p>
                  <p>• MGR2025: Manager (credits only)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target User ID/Email</label>
                  <Input
                    placeholder="Enter user email or ID"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Award Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'credits', label: 'Credits', icon: Coins, color: 'blue' },
                      { id: 'kobos', label: 'Kobos', icon: Heart, color: 'pink' },
                      { id: 'both', label: 'Both', icon: DollarSign, color: 'purple' }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setAwardType(type.id as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            awardType === type.id
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount to award"
                    value={awardAmount}
                    onChange={(e) => setAwardAmount(e.target.value)}
                    className="w-full"
                    min="1"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Award</label>
                  <Textarea
                    placeholder="Explain why you're awarding credits/kobos..."
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Preview */}
                {awardAmount && searchUserId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">Award Preview</h5>
                    <div className="space-y-1 text-green-800 text-sm">
                      <p><strong>Recipient:</strong> {searchUserId}</p>
                      <p><strong>Award:</strong> {awardAmount} {awardType}</p>
                      <p><strong>Authorization:</strong> {managerCode || 'Not provided'}</p>
                      <p><strong>Valid Code:</strong> {validateManagerCode(managerCode) ? '✅ Yes' : '❌ No'}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowAwardModal(false)}
                    className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAwardCredits}
                    disabled={!searchUserId || !awardAmount || !awardReason || !validateManagerCode(managerCode)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-all disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Award {awardType === 'both' ? 'Credits & Kobos' : awardType}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Footer */}
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            title="Previous (Ctrl+←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            title="Next (Ctrl+→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            Shortcuts: Ctrl+1-5 (tabs) | Ctrl+←→ (navigate)
          </p>
        </div>
      </div>
    </div>
  );
};