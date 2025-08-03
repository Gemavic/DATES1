import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail as MailIcon, Send, Inbox, Trash2, Star, Search, Plus, Paperclip, MessageCircle, Users, Newspaper, User, MessageSquare, Image, Upload } from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { sendEmailNotification } from '@/lib/emailNotifications';
import { MessageChatBox } from '@/components/MessageChatBox';

interface MailProps {
  onNavigate: (screen: string) => void;
}

interface MailMessage {
  id: string;
  from: string;
  age: number;
  fromImage: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  isNew: boolean;
  online: boolean;
}

export const Mail: React.FC<MailProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'starred' | 'outbox' | 'trash'>('inbox');
  const [selectedMail, setSelectedMail] = useState<string | null>(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const [mailMessages, setMailMessages] = useState<MailMessage[]>([
    {
      id: '1',
      from: 'Gabriela',
      age: 23,
      fromImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'I believe in love that is nourished by e...',
      preview: 'I believe in love that is nourished by everyday moments and shared dreams...',
      content: 'I believe in love that is nourished by everyday moments and shared dreams. There\'s something magical about finding someone who understands your silence and celebrates your joy.',
      timestamp: '12:37 pm',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '2',
      from: 'Astrid',
      age: 45,
      fromImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'The city\'s asleep. I\'m not. And you sho...',
      preview: 'The city\'s asleep. I\'m not. And you should know that I\'m thinking of you...',
      content: 'The city\'s asleep. I\'m not. And you should know that I\'m thinking of you. Sometimes the quiet hours reveal the loudest truths about what our hearts really want.',
      timestamp: '11:46 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '3',
      from: 'Jessica',
      age: 34,
      fromImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'I\'m glad to meet you. I am a woman di...',
      preview: 'I\'m glad to meet you. I am a woman discovering life\'s beautiful moments...',
      content: 'I\'m glad to meet you. I am a woman discovering life\'s beautiful moments and I believe that the best adventures are shared with someone special.',
      timestamp: '11:11 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '4',
      from: 'Aline Claudia',
      age: 44,
      fromImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: '🍓🍓 Sometimes after a hard day alon...',
      preview: '🍓🍓 Sometimes after a hard day alone, I dream of sharing simple pleasures...',
      content: '🍓🍓 Sometimes after a hard day alone, I dream of sharing simple pleasures with someone who appreciates life\'s sweetest moments.',
      timestamp: '10:59 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '5',
      from: 'Yasmin',
      age: 29,
      fromImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Imagine how cosy it is to sit at home i...',
      preview: 'Imagine how cosy it is to sit at home in the evening with someone special...',
      content: 'Imagine how cosy it is to sit at home in the evening with someone special, sharing stories and creating memories that will last a lifetime.',
      timestamp: '10:57 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '6',
      from: 'Dara',
      age: 23,
      fromImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'Hi, 😊 I don\'t know if you believe in th...',
      preview: 'Hi, 😊 I don\'t know if you believe in the magic of first messages...',
      content: 'Hi, 😊 I don\'t know if you believe in the magic of first messages, but I hope this one finds you smiling and ready for something beautiful.',
      timestamp: '10:51 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    },
    {
      id: '7',
      from: 'Sindy',
      age: 38,
      fromImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      subject: 'My fascination with life translates into...',
      preview: 'My fascination with life translates into a desire to share every moment...',
      content: 'My fascination with life translates into a desire to share every moment with someone who sees the world through eyes as curious and passionate as mine.',
      timestamp: '10:44 am',
      read: false,
      starred: false,
      isNew: true,
      online: true
    }
  ]);

  const handleReadMail = (mailId: string) => {
    const mail = mailMessages.find(m => m.id === mailId);
    const threadId = mail?.from || 'unknown';
    const readResult = creditManager.canReadMail('current-user', threadId);
    const canReadFree = readResult.isFree;
    
    if (canReadFree) {
      setSelectedMail(mailId);
      creditManager.markFirstMailRead('current-user', threadId);
      // Mark message as read
      setMailMessages(prev => prev.map(msg => 
        msg.id === mailId ? { ...msg, read: true } : msg
      ));
    } else if (creditManager.canAfford('current-user', 10)) {
      const success = creditManager.spendCredits('current-user', 10, `Read mail from ${threadId}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        setSelectedMail(mailId);
        // Mark message as read
        setMailMessages(prev => prev.map(msg => 
          msg.id === mailId ? { ...msg, read: true } : msg
        ));
      }
    } else {
      alert(`Need ${formatCredits(10)} to read this message!`);
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    const message = mailMessages.find(m => m.id === selectedMail);
    if (!message) return;

    const threadId = message.from;
    const sendResult = creditManager.canSendMail('current-user', threadId);
    
    if (sendResult.canSend) {
      if (!sendResult.isFree) {
        const success = creditManager.spendCredits('current-user', sendResult.cost, `Reply to ${message.from}`);
        if (!success) {
          alert(`Need ${formatCredits(sendResult.cost)} to send this reply!`);
          return;
        }
        setUserBalance(creditManager.getBalance('current-user'));
      }
      
      // Mark first mail as sent for this thread
      creditManager.markFirstMailSent('current-user', threadId);
      
      // Send email notification
      sendEmailNotification(message.from, {
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        id: 'current-user'
      });
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = `📧 Reply sent to ${message.from}!`;
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
      
      setReplyMessage('');
      setShowReplyBox(false);
    } else {
      alert(`Need ${formatCredits(sendResult.cost)} to send this reply!`);
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        const message = mailMessages.find(m => m.id === selectedMail);
        if (!message) return;
        
        const threadId = message.from;
        const canSendResult = creditManager.canSendPhoto('current-user', threadId, true);
        
        if (canSendResult.isFree || creditManager.canAfford('current-user', canSendResult.cost)) {
          if (!canSendResult.isFree && !creditManager.isStaffMember('current-user')) {
            const success = creditManager.spendCredits('current-user', canSendResult.cost, `Photo upload to ${message.from}`);
            if (!success) {
              alert(`Need ${formatCredits(canSendResult.cost)} to upload photos!`);
              return;
            }
            setUserBalance(creditManager.getBalance('current-user'));
          }
          
          // Add photos to uploaded list
          const photoUrls = files.map(file => URL.createObjectURL(file));
          setUploadedPhotos(prev => [...prev, ...photoUrls]);
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMessage.textContent = `📷 ${files.length} photo(s) uploaded successfully!`;
          document.body.appendChild(successMessage);
          setTimeout(() => document.body.removeChild(successMessage), 3000);
        } else {
          alert(`Need ${formatCredits(canSendResult.cost)} to upload photos!`);
        }
      }
    };
    
    input.click();
  };

  const removePhoto = (photoUrl: string) => {
    setUploadedPhotos(prev => prev.filter(url => url !== photoUrl));
  };

  const filteredMessages = showOnlyUnread 
    ? mailMessages.filter(msg => !msg.read)
    : mailMessages;

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'inbox':
        return mailMessages.filter(m => !m.read).length;
      case 'starred':
        return mailMessages.filter(m => m.starred).length;
      case 'outbox':
        return 0;
      case 'trash':
        return 0;
      default:
        return 0;
    }
  };

  if (selectedMail) {
    const message = mailMessages.find(m => m.id === selectedMail);
    if (!message) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600">
        <div className="max-w-md mx-auto min-h-screen relative">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedMail(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Inbox
              </button>
              <h1 className="text-xl font-bold text-gray-900">Mail</h1>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img
                    src={message.fromImage}
                    alt={message.from}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {message.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{message.from}, {message.age}</h3>
                  <p className="text-sm text-gray-600">{message.timestamp}</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{message.content}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <Button
                  onClick={() => {
                    setShowReplyBox(!showReplyBox);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {showReplyBox ? 'Cancel Reply' : 'Reply'}
                </Button>
                
                {/* Reply Box */}
                {showReplyBox && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {/* Uploaded Photos Preview */}
                    {uploadedPhotos.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Attached Photos ({uploadedPhotos.length})
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedPhotos.map((photoUrl, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photoUrl}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removePhoto(photoUrl)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reply to {message.from}
                      </label>
                      <Textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full min-h-[100px] resize-none"
                      />
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handlePhotoUpload}
                        className="bg-blue-500 text-white hover:bg-blue-600 flex items-center"
                        type="button"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Upload Photos
                      </Button>
                      <span className="text-xs text-gray-500">Free in mail</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Cost: {creditManager.canSendMail('current-user', message.from).isFree ? 
                          'FREE (First mail)' : 
                          `${formatCredits(creditManager.canSendMail('current-user', message.from).cost)}`
                        }
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShowReplyBox(false)}
                          className="bg-gray-500 text-white hover:bg-gray-600"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim()}
                          className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply {uploadedPhotos.length > 0 && `(+${uploadedPhotos.length} photos)`}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600">
      <div className="max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Dates</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button 
                  onClick={() => onNavigate('matches')}
                  className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <button 
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/20">
          <div className="flex">
            {[
              { id: 'inbox', label: 'Inbox', color: 'text-orange-500 border-orange-500' },
              { id: 'starred', label: 'Starred', color: 'text-gray-500 border-transparent' },
              { id: 'outbox', label: 'Outbox', color: 'text-gray-500 border-transparent' },
              { id: 'trash', label: 'Trash', color: 'text-gray-500 border-transparent' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? tab.color : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Option */}
        <div className="bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-white/20">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Show only unread</span>
          </label>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto pb-20">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleReadMail(message.id)}
              className="border-b border-white/20 p-4 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm"
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={message.fromImage}
                    alt={message.from}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {message.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium truncate ${!message.read ? 'text-white' : 'text-white/80'}`}>
                        {message.from}, {message.age}
                      </h4>
                      {message.isNew && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/70">{message.timestamp}</span>
                      <button className="text-white/50 hover:text-yellow-400 transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm truncate ${!message.read ? 'font-medium text-white' : 'text-white/70'}`}>
                    {message.subject}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-t border-white/20 shadow-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="flex justify-around py-2">
            {[
              { id: 'search', icon: Users, label: 'Search', count: 0, color: 'text-gray-600' },
              { id: 'chat', icon: MessageCircle, label: 'Chat', count: 0, color: 'text-gray-600', isChat: true },
              { id: 'mail', icon: MailIcon, label: 'Mail', count: 29, color: 'text-orange-500' },
              { id: 'newsfeed', icon: Newspaper, label: 'Newsfeed', count: 0, color: 'text-gray-600' },
              { id: 'feedback', icon: MessageSquare, label: 'Feedback', count: 0, color: 'text-gray-600' },
              { id: 'people', icon: User, label: 'People', count: 0, color: 'text-gray-600' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === 'mail';
              
              if (tab.isChat) {
                return (
                  <div key={tab.id} className="flex flex-col items-center py-2 px-3">
                    <MessageChatBox />
                    <span className="text-xs font-medium text-gray-600 mt-1">{tab.label}</span>
                  </div>
                );
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'newsfeed') {
                      onNavigate('newsfeed');
                    } else if (tab.id === 'people') {
                      onNavigate('discovery');
                    } else if (tab.id === 'search') {
                      onNavigate('discovery');
                    } else if (tab.id === 'feedback') {
                      onNavigate('feedback');
                    }
                  }}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 relative ${
                    isActive 
                      ? tab.color
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {tab.count > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{tab.count}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};