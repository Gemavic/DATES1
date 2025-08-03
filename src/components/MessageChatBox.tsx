import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Smile, Paperclip, Image, Video, Phone, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { sendMessageNotification } from '@/lib/emailNotifications';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'image' | 'video';
  edited?: boolean;
  editedAt?: Date;
}

interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantImage: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
}

interface MessageChatBoxProps {
  className?: string;
}

export const MessageChatBox: React.FC<MessageChatBoxProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userBalance, setUserBalance] = useState(creditManager.getTotalCredits('current-user'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getFirstName } = useAuth();

  // Sample chat threads matching La-Date style
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread-gabriela',
      participantId: 'gabriela-id',
      participantName: 'Gabriela',
      participantImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: {
        id: 'msg-gabriela',
        senderId: 'gabriela-id',
        senderName: 'Gabriela',
        senderImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
        message: `Hey! How's your day going? Would love to chat more 😊`,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'text'
      },
      unreadCount: 1,
      isOnline: true,
      isTyping: false
    },
    {
      id: 'thread-astrid',
      participantId: 'astrid-id',
      participantName: 'Astrid',
      participantImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: {
        id: 'msg-astrid',
        senderId: 'astrid-id',
        senderName: 'Astrid',
        senderImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        message: 'Thanks for the great conversation yesterday! 🌟',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'text'
      },
      unreadCount: 1,
      isOnline: true,
      isTyping: false
    },
    {
      id: 'thread-jessica',
      participantId: 'jessica-id',
      participantName: 'Jessica',
      participantImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: {
        id: 'msg-jessica',
        senderId: 'jessica-id',
        senderName: 'Jessica',
        senderImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
        message: 'Looking forward to our coffee date this weekend! ☕',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: 'text'
      },
      unreadCount: 1,
      isOnline: true,
      isTyping: false
    }
  ]);

  // Sample messages for active thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-gabriela-1',
      senderId: 'gabriela-id',
      senderName: 'Gabriela',
      senderImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'Hey! How are you doing today? Hope you\'re having a great day! 😊',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-user-1',
      senderId: 'current-user',
      senderName: 'You',
      senderImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'I\'m doing well, thanks for asking! How about you? 😄',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      type: 'text'
    }
  ]);

  const emojis = [
    '😊', '😍', '🥰', '😘', '💕', '❤️', '🔥', '✨', 
    '🌹', '💖', '😉', '😎', '🤗', '💋', '🌟', '💫',
    '👍', '👎', '🤔', '😂', '😭', '🥺', '😴', '🤤',
    '☕', '🍕', '🍔', '🍷', '🎉', '🎊', '🎈', '🎁'
  ];

  const totalUnread = chatThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const activeThreadData = chatThreads.find(t => t.id === activeThread);
    if (!activeThreadData) return;

    // Check if user can afford chat
    const canAfford = creditManager.canAfford('current-user', 2);
    const hasKobos = creditManager.getKobos('current-user') > 0;
    
    if (!canAfford && !hasKobos && !creditManager.isStaffMember('current-user')) {
      alert(`Need ${formatCredits(2)} or 1 Kobo to send messages!`);
      return;
    }

    // Deduct credits/kobos
    if (!creditManager.isStaffMember('current-user')) {
      if (hasKobos) {
        // Use kobo first (would need implementation in credit system)
        console.log('Used 1 kobo for chat message');
      } else {
        creditManager.spendCredits('current-user', 2, `Chat message to ${activeThreadData.participantName}`);
        setUserBalance(creditManager.getTotalCredits('current-user'));
      }
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: message.trim(),
      timestamp: new Date(),
      documents: [],
      responses: []
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setShowEmojiPicker(false);

    // Send email notification
    sendMessageNotification(activeThreadData.participantId, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });

    // Update thread with new message
    setChatThreads(prev => prev.map(thread => 
      thread.id === activeThread 
        ? { ...thread, lastMessage: newMessage, unreadCount: 0 }
        : thread
    ));
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'image') {
      input.accept = 'image/*';
    } else if (type === 'video') {
      input.accept = 'video/*';
    } else {
      input.accept = '*/*';
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check if user can afford media sharing
        const cost = type === 'image' ? 10 : type === 'video' ? 50 : 5;
        if (creditManager.canAfford('current-user', cost) || creditManager.isStaffMember('current-user')) {
          if (!creditManager.isStaffMember('current-user')) {
            creditManager.spendCredits('current-user', cost, `Shared ${type}: ${file.name}`);
            setUserBalance(creditManager.getTotalCredits('current-user'));
          }
          
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMessage.textContent = `📎 ${file.name} uploaded successfully!`;
          document.body.appendChild(successMessage);
          setTimeout(() => document.body.removeChild(successMessage), 3000);
        } else {
          alert(`Need ${formatCredits(cost)} to share ${type}!`);
        }
      }
    };
    input.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderThreadList = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Messages</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm opacity-90">{totalUnread} unread messages</p>
      </div>

      {/* Credits Balance */}
      <div className="p-3 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700">Chat Balance:</span>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-blue-900">{formatCredits(userBalance)}</span>
            <span className="text-pink-600 font-bold">{creditManager.getKobos('current-user')} 💖</span>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-1">2 credits or 1 kobo per minute</p>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {chatThreads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveThread(thread.id)}
            className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={thread.participantImage}
                  alt={thread.participantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  thread.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                {thread.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{thread.unreadCount}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleFileUpload('file')}
                className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors flex-shrink-0"
                title="Upload file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{thread.participantName}</h4>
                  <span className="text-xs text-gray-500">
                    {thread.lastMessage?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {thread.isTyping ? (
                      <span className="text-blue-500 italic">typing...</span>
                    ) : (
                      thread.lastMessage?.message || 'No messages yet'
                    )}
                  </p>
                  {thread.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => handleFileUpload('video')}
            className="flex items-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            disabled={!creditManager.canAfford('current-user', 60) && !creditManager.isStaffMember('current-user')}
          >
            <Video className="w-4 h-4" />
            <span className="text-xs">Video Call</span>
          </button>
          <button
            onClick={() => handleFileUpload('video')}
            className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            disabled={!creditManager.canAfford('current-user', 50) && !creditManager.isStaffMember('current-user')}
          >
            <Phone className="w-4 h-4" />
            <span className="text-xs">Audio Call</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderChatView = () => {
    const thread = chatThreads.find(t => t.id === activeThread);
    if (!thread) return null;

    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveThread(null)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={thread.participantImage}
                alt={thread.participantName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                thread.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{thread.participantName}</h3>
              <p className="text-sm opacity-90">
                {thread.isOnline ? (
                  thread.isTyping ? 'typing...' : 'online'
                ) : 'offline'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFileUpload('video')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                disabled={!creditManager.canAfford('current-user', 60) && !creditManager.isStaffMember('current-user')}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFileUpload('video')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                disabled={!creditManager.canAfford('current-user', 50) && !creditManager.isStaffMember('current-user')}
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.senderId === 'current-user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-end space-x-2 ${msg.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <img
                    src={msg.senderImage}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className={`rounded-2xl p-3 max-w-xs ${
                    msg.senderId === 'current-user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {msg.edited && (
                        <span className="text-xs opacity-70">edited</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {thread.isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <img
                  src={thread.participantImage}
                  alt={thread.participantName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-white border border-gray-200 rounded-2xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 bg-gray-50 rounded-lg p-3 border">
              <div className="grid grid-cols-8 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Controls */}
          <div className="flex items-end space-x-2">
            
            <button
              onClick={() => handleFileUpload('file')}
              className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors flex-shrink-0"
              title="Upload file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative flex items-center">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${thread.participantName}...`}
                className="w-full min-h-[40px] max-h-[120px] resize-none pr-12 pl-12 rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                rows={1}
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || (!creditManager.canAfford('current-user', 2) && creditManager.getKobos('current-user') === 0 && !creditManager.isStaffMember('current-user'))}
              className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-all duration-300 hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Cost Info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              💬 2 credits or 1 kobo per minute • 📷 10 credits per image • 📎 5 credits per file
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Chat Button in Navigation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center mb-1 ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-white" />
        {totalUnread > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{totalUnread > 9 ? '9' : totalUnread}</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {activeThread ? renderChatView() : renderThreadList()}
        </div>
      )}
    </>
  );
};