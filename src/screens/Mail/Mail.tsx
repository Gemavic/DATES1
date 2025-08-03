import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail as MailIcon, Send, Inbox, Trash2, Star, Search, Plus, Paperclip } from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { sendEmailNotification } from '@/lib/emailNotifications';

interface MailProps {
  onNavigate: (screen: string) => void;
}

interface EditableMessage {
  id: string;
  content: string;
  sentAt: Date;
  isEditing: boolean;
}

export const Mail: React.FC<MailProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMail, setSelectedMail] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));
  const [editableMessages, setEditableMessages] = useState<Map<string, EditableMessage>>(new Map());
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const mailMessages = [
    {
      id: '1',
      from: 'Emma',
      fromImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Thank you for the lovely evening!',
      preview: 'I had such a wonderful time at dinner last night. The restaurant you chose was perfect...',
      content: 'I had such a wonderful time at dinner last night. The restaurant you chose was perfect and the conversation flowed so naturally. I would love to see you again soon. Maybe we could try that hiking trail you mentioned?',
      timestamp: '2 hours ago',
      read: false,
      starred: true
    },
    {
      id: '2',
      from: 'Sarah',
      fromImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Coffee date this weekend?',
      preview: 'Hi! I was wondering if you would like to grab coffee this Saturday morning...',
      content: 'Hi! I was wondering if you would like to grab coffee this Saturday morning? I know this great little café downtown that has amazing pastries. Let me know what you think!',
      timestamp: '1 day ago',
      read: true,
      starred: false
    },
    {
      id: '3',
      from: 'Jessica',
      fromImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Movie recommendations',
      preview: 'I loved our conversation about movies! Here are some of my favorites...',
      content: 'I loved our conversation about movies! Here are some of my favorites that I think you might enjoy: The Princess Bride, Inception, and La La Land. What do you think about watching one together sometime?',
      timestamp: '3 days ago',
      read: true,
      starred: false
    }
  ];

  const sentMessages = [
    {
      id: '4',
      to: 'Emma',
      toImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Looking forward to our date',
      preview: 'I am really excited about our dinner plans tonight...',
      content: 'I am really excited about our dinner plans tonight. I made reservations at that Italian place we talked about. See you at 7 PM!',
      timestamp: '1 day ago'
    }
  ];

  const canEditMessage = (messageId: string): boolean => {
    const editableMessage = editableMessages.get(messageId);
    if (!editableMessage) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - editableMessage.sentAt.getTime();
    const tenMinutesInMs = 10 * 60 * 1000;
    
    return timeDiff <= tenMinutesInMs;
  };

  const startEditingMessage = (messageId: string) => {
    const editableMessage = editableMessages.get(messageId);
    if (editableMessage && canEditMessage(messageId)) {
      setEditingMessageId(messageId);
      setEditContent(editableMessage.content);
    }
  };

  const saveEditedMessage = () => {
    if (editingMessageId) {
      const editableMessage = editableMessages.get(editingMessageId);
      if (editableMessage) {
        editableMessage.content = editContent;
        setEditableMessages(new Map(editableMessages));
        setEditingMessageId(null);
        setEditContent('');
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMessage.textContent = 'Message edited successfully!';
        document.body.appendChild(successMessage);
        setTimeout(() => document.body.removeChild(successMessage), 3000);
      }
    }
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleReadMail = (mailId: string) => {
    // Use sender's name as thread ID for simplicity
    const mail = mailMessages.find(m => m.id === mailId);
    const threadId = mail?.from || 'unknown';
    const readResult = creditManager.canReadMail('current-user', threadId);
    const canReadFree = readResult.isFree;
    
    if (canReadFree) {
      setSelectedMail(mailId);
      creditManager.markFirstMailRead('current-user', threadId);
      creditManager.addCredits('current-user', 0, `Read mail from ${threadId} (FREE - First in thread)`, false);
    } else if (creditManager.canAfford('current-user', 10)) {
      const success = creditManager.spendCredits('current-user', 10, `Read mail from ${threadId}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        setSelectedMail(mailId);
      }
    } else {
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = `Need ${formatCredits(10)} to read this message!`;
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    }
  };

  const handleSendMail = () => {
    // For compose, use recipient as thread ID (would be selected from UI)
    const threadId = 'recipient-name'; // This would come from the compose form
    const sendResult = creditManager.canSendMail('current-user', threadId);
    const canSendFree = sendResult.isFree;
    
    if (canSendFree) {
      creditManager.markFirstMailSent('current-user', threadId);
      creditManager.addCredits('current-user', 0, `Send mail to ${threadId} (FREE - First in thread)`, false);
      setActiveTab('inbox');
      
      // Add message to editable messages with 10-minute edit window
      const messageId = Date.now().toString();
      const newEditableMessage: EditableMessage = {
        id: messageId,
        content: 'Your composed message content here', // This would come from the form
        sentAt: new Date(),
        isEditing: false
      };
      setEditableMessages(prev => new Map(prev.set(messageId, newEditableMessage)));
      
      // Send email notification
      sendEmailNotification('recipient-id', {
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        id: 'current-user'
      });
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Message sent for free! (First mail in thread)';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } else if (creditManager.canAfford('current-user', 10)) {
      const success = creditManager.spendCredits('current-user', 10, `Send mail to ${threadId}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        setActiveTab('inbox');
        
        // Add message to editable messages with 10-minute edit window
        const messageId = Date.now().toString();
        const newEditableMessage: EditableMessage = {
          id: messageId,
          content: 'Your composed message content here', // This would come from the form
          sentAt: new Date(),
          isEditing: false
        };
        setEditableMessages(prev => new Map(prev.set(messageId, newEditableMessage)));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMessage.textContent = 'Message sent successfully!';
        document.body.appendChild(successMessage);
        setTimeout(() => document.body.removeChild(successMessage), 3000);
      }
    } else {
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = `Need ${formatCredits(10)} to send this message!`;
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    }
  };

  const renderMailList = (messages: any[], type: 'inbox' | 'sent') => (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => handleReadMail(message.id)}
          className={`bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
            !message.read && type === 'inbox' ? 'border-l-4 border-pink-500' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <img
              src={type === 'inbox' ? message.fromImage : message.toImage}
              alt={type === 'inbox' ? message.from : message.to}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-medium truncate ${!message.read && type === 'inbox' ? 'text-gray-900' : 'text-gray-700'}`}>
                  {type === 'inbox' ? message.from : `To: ${message.to}`}
                </h4>
                <div className="flex items-center space-x-2">
                  {message.starred && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  {type === 'sent' && canEditMessage(message.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingMessage(message.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                      title="Edit message (within 10 minutes)"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
              <h5 className={`text-sm mb-1 truncate ${!message.read && type === 'inbox' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                {message.subject}
              </h5>
              {editingMessageId === message.id ? (
                <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="text-xs"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveEditedMessage}
                      className="bg-green-500 text-white text-xs px-3 py-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white text-xs px-3 py-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 truncate">{message.preview}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSelectedMail = () => {
    const allMessages = [...mailMessages, ...sentMessages];
    const message = allMessages.find(m => m.id === selectedMail);
    if (!message) return null;

    const isInbox = mailMessages.some(m => m.id === selectedMail);

    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => setSelectedMail(null)}
            className="bg-gray-500 text-white px-4 py-2"
          >
            ← Back
          </Button>
          <div className="flex space-x-2">
            <Button className="bg-red-500 text-white p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
            {isInbox && (
              <Button className="bg-yellow-500 text-white p-2">
                <Star className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <img
            src={isInbox ? (message as any).fromImage : (message as any).toImage}
            alt={isInbox ? (message as any).from : (message as any).to}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {isInbox ? (message as any).from : `To: ${(message as any).to}`}
            </h3>
            <p className="text-sm text-gray-600">{message.timestamp}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{message.subject}</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{message.content}</p>
        </div>

        {isInbox && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setActiveTab('compose')}
              className="bg-pink-500 text-white px-6 py-2"
            >
              Reply
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCompose = () => {
    const threadId = 'recipient-name';
    const sendResult = creditManager.canSendMail('current-user', threadId);
    
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Compose Message</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <Input 
              placeholder="Select recipient..." 
              className="w-full bg-white border border-gray-300 focus:border-pink-500 focus:ring-pink-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <Input 
              placeholder="Enter subject..." 
              className="w-full bg-white border border-gray-300 focus:border-pink-500 focus:ring-pink-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <Textarea 
              placeholder="Write your message..." 
              className="w-full min-h-[200px] bg-white border border-gray-300 focus:border-pink-500 focus:ring-pink-500 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button 
              className="bg-gray-500 text-white px-4 py-2 flex items-center"
              disabled={!creditManager.canSendAttachmentFree('current-user', 'compose-thread') && !creditManager.canAfford('current-user', 10)}
            >
              <Paperclip className="w-4 h-4 mr-2" />
              {creditManager.canSendAttachmentFree('current-user', 'compose-thread') ? 'Attach File (FREE)' : 'Attach File (10 Credits)'}
            </Button>
            <div className="flex space-x-3">
              <Button
                onClick={() => setActiveTab('inbox')}
                className="bg-gray-500 text-white px-6 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMail}
                className="bg-pink-500 text-white px-6 py-2 flex items-center"
                disabled={!sendResult.isFree && !creditManager.canAfford('current-user', 10)}
              >
                <Send className="w-4 h-4 mr-2" />
                {sendResult.isFree ? 'Send FREE' : 'Send (10 Credits)'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedMail) {
    return (
      <Layout
        title="Mail"
        onBack={() => onNavigate('discovery')}
        showClose={false}
        showFooter={true}
        activeTab="mail"
        onNavigate={onNavigate}
      >
        <div className="px-4 py-6">
          {renderSelectedMail()}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Mail"
      onBack={() => onNavigate('discovery')}
      showClose={false}
      showFooter={true}
      activeTab="mail"
      onNavigate={onNavigate}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <img 
            src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Mail System" 
            className="w-full h-32 object-cover rounded-2xl shadow-lg mb-4"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <MailIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Private Mail</h2>
          <p className="text-white/80">Send and receive private messages</p>
        </div>

        {/* Credits Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Credits</p>
              <p className="text-2xl font-bold text-white">{formatCredits(userBalance)}</p>
            </div>
            <Button
              onClick={() => onNavigate('credits')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2"
            >
              Buy More
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-3 mb-6">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search messages..." 
              className="flex-1 border-none bg-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'inbox' ? 'bg-white text-gray-900' : 'text-white'
            }`}
          >
            <Inbox className="w-5 h-5 mr-2" />
            Inbox ({mailMessages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'sent' ? 'bg-white text-gray-900' : 'text-white'
            }`}
          >
            <Send className="w-5 h-5 mr-2" />
            Sent
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 ${
              activeTab === 'compose' ? 'bg-white text-gray-900' : 'text-white'
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Compose
          </button>
        </div>

        {/* Content */}
        {activeTab === 'inbox' && renderMailList(mailMessages, 'inbox')}
        {activeTab === 'sent' && renderMailList(sentMessages, 'sent')}
        {activeTab === 'compose' && renderCompose()}

        {/* Mail Pricing Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center text-green-600 mb-2">
            <MailIcon className="w-5 h-5 mr-2" />
            <strong>Mail Pricing</strong>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">📧 Read Mail:</span>
              <span className="font-bold text-blue-700">10 Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">📤 Send First Mail:</span>
              <span className="font-bold text-blue-700">10 Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">📤 Send Following Mail:</span>
              <span className="font-bold text-blue-700">30 Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">📎 Send Photos:</span>
              <span className="font-bold text-blue-700">10 Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">📷 View Photos:</span>
              <span className="font-bold text-blue-700">10 Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">📹 Video Call:</span>
              <span className="font-bold text-purple-700">60 Credits/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">📞 Audio Call:</span>
              <span className="font-bold text-purple-700">50 Credits/min</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs font-medium">
                ⚠️ NOTICE: All services require credits. No free features available. 
                Credit pricing is subject to change without prior notice or user consent.
              </p>
            </div>
          </div>
        </div>

        {/* Message Edit Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-blue-800 font-semibold text-lg mb-2">Message Editing</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>📝 You can edit sent messages within 10 minutes of delivery</p>
            <p>⏰ Edit window expires automatically after 10 minutes</p>
            <p>✏️ Look for the "Edit" button on your sent messages</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};