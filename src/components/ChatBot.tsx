import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Mail, Clock, Zap, Paperclip, Smile, HelpCircle, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { agentAssistant, getAIResponse, createSupportTicket } from '@/lib/agentAssistant';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    category: 'general' as const,
    subject: '',
    description: ''
  });
  const { getFirstName } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: `Hi ${getFirstName()}! 👋 I'm your Dates.care AI assistant. I'm here 24/7 to help you with questions about our dating platform, credits, features, payments, verification, safety, and technical support. I have access to our complete knowledge base and can connect you with human agents when needed. How can I assist you today?`,
      timestamp: new Date(),
      quickReplies: ['How do credits work?', 'Payment methods', 'Account verification', 'Safety & security', 'Technical support', 'Talk to human agent']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😊', '😍', '🥰', '😘', '💕', '❤️', '🔥', '✨', '🌹', '💖', '😉', '😎', '🤗', '💋', '🌟', '💫', '👍', '👎', '🤔', '😂'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses: Record<string, { message: string; quickReplies?: string[] }> = {
    'credits': {
      message: 'Our credit system works like this:\n\n💳 Credits are used for ALL features:\n• Live Chat: 2 credits/minute or 1 kobo/minute\n• Send Photos: 10 credits\n• Video Calls: 60 credits/minute\n• Audio Calls: 50 credits/minute\n• First Mail: 10 credits\n• Following Mail: 30 credits\n• Read Mail: 10 credits (first in thread is FREE)\n• Virtual Gifts: varies\n\n💖 Kobos are priority chat credits (1 kobo = 1 minute)\n\n🎁 New users get 10 complimentary credits + 10 kobos!\n\n⚠️ NO FREE SERVICES - All features require credits\n⚠️ Pricing subject to change without notice',
      quickReplies: ['Buy more credits', 'Kobo vs Credits', 'Payment methods', 'Staff unlimited access']
    },
    'payment': {
      message: 'We accept multiple payment methods:\n\n💳 Credit/Debit Cards (Visa, MasterCard, Amex)\n₿ Cryptocurrencies:\n  • Bitcoin (3 confirmations)\n  • Ethereum (12 confirmations)\n  • USDT, USDC, BNB, ADA, SOL, MATIC, LTC, DOGE\n📱 Mobile Payments (Apple Pay, Google Pay, Samsung Pay)\n💙 PayPal: histogm@gmail.com\n\n🔒 All payments secured with 256-bit SSL encryption\n📤 Upload payment proof for crypto payments\n⏱️ Crypto processing: 2-30 minutes',
      quickReplies: ['Crypto wallet addresses', 'Card payment help', 'PayPal support', 'Upload payment proof']
    },
    'technical': {
      message: 'I can help with technical issues:\n\n🔧 Common solutions:\n• Clear browser cache and cookies\n• Try a different browser (Chrome, Firefox, Safari)\n• Check internet connection\n• Update your browser to latest version\n• Disable browser extensions\n• Check camera/microphone permissions for calls\n\n📧 For complex issues: tech@dates.care\n📞 Urgent technical support: +1 (613) 861-5799',
      quickReplies: ['Login problems', 'App not loading', 'Video/audio issues', 'Create tech ticket']
    },
    'account': {
      message: 'Account support available:\n\n👤 Account Issues:\n• Password reset (use "Forgot Password" link)\n• Email verification\n• Profile problems\n• Account verification status\n• Two-factor authentication\n\n🆔 Verification Requirements:\n• Government-issued photo ID\n• Selfie holding your ID\n• Address proof document\n• Phone number verification\n• Legal name information\n\n📧 Contact: supports@dates.care\n📞 Phone: +1 (613) 861-5799',
      quickReplies: ['Reset password', 'Start verification', 'Verification status', 'Contact account support']
    },
    'features': {
      message: 'Dates.care features:\n\n💕 Core Features:\n• AI-powered smart matching\n• Live chat (2 credits/min or 1 kobo/min)\n• Video calls (60 credits/min)\n• Audio calls (50 credits/min)\n• Private mail system (10-30 credits)\n• Virtual gift shop (varies)\n• Profile verification system\n• Couple therapy sessions\n• Personal counselling\n• 24/7 AI support\n• Blink feature (1 credit)\n• Message editing (10-minute window)\n\n⚠️ NO FREE SERVICES - All features require credits\n⚠️ Pricing subject to change without notice\n\n👨‍💼 Staff members get unlimited access to all features',
      quickReplies: ['Matching algorithm', 'Chat vs Mail', 'Verification benefits', 'Staff access']
    },
    'safety': {
      message: 'Your safety is our priority:\n\n🛡️ Safety Features:\n• Profile verification system (government ID required)\n• Report & block users (tap ⋯ menu)\n• End-to-end encryption for all communications\n• Content moderation and profanity filtering\n• 24/7 monitoring and support\n• High-security encryption for credit purchasers\n• Two-factor authentication available\n\n🚨 Safety Tips:\n• Always meet in public places\n• Tell someone about your plans\n• Trust your instincts\n• Report suspicious behavior immediately\n\n📧 Safety team: safety@dates.care',
      quickReplies: ['Report user', 'Verification process', 'Safety tips', 'Contact safety team']
    },
    'contact': {
      message: 'Contact Dates.care:\n\n📧 Email Support:\n• General: info@dates.care\n• Support: supports@dates.care\n• Technical: tech@dates.care\n• Billing: billing@dates.care\n• Safety: safety@dates.care\n• Admin: admin@dates.care\n• Verification: verification@dates.care\n\n📞 Phone: +1 (613) 861-5799\n📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada\n\n⏰ Available 24/7 for urgent matters!\n🎫 Create support ticket for detailed assistance\n📊 Average response time: 2-4 hours',
      quickReplies: ['Email support', 'Call support', 'Create support ticket', 'Emergency help']
    },
    'verification': {
      message: 'Account Verification Process:\n\n📋 Required Documents:\n• Government-issued photo ID (Driver\'s License, Passport)\n• Selfie holding your ID\n• Address proof (utility bill, bank statement)\n• Phone number verification (SMS code)\n• Legal name information\n\n✅ Benefits:\n• Blue verified badge\n• Priority in search results\n• Enhanced trust and safety\n• Access to verified-only features\n\n⏱️ Processing time: 24-48 hours\n📧 Updates sent to your email\n\n🆔 Start verification in Profile → Verification',
      quickReplies: ['Start verification', 'Required documents', 'Verification status', 'Contact verification team']
    },
    'billing': {
      message: 'Billing & Payment Support:\n\n💳 Payment Issues:\n• Failed payments\n• Refund requests (all sales final)\n• Billing disputes\n• Payment method updates\n\n💰 Credit Packages:\n• Starter: 50 credits + 10 bonus ($9.99)\n• Popular: 150 credits + 50 bonus ($24.99)\n• Premium: 300 credits + 100 bonus ($44.99)\n• Ultimate Combo: 500 credits + 200 bonus + 50 kobos ($79.99)\n\n⚠️ All purchases are final and non-refundable\n⚠️ Pricing subject to change without notice\n\n📧 Billing support: billing@dates.care',
      quickReplies: ['Payment failed', 'Refund policy', 'Credit packages', 'Contact billing']
    }
  };

  const generateBotResponse = (userMessage: string): { message: string; quickReplies?: string[] } => {
    // Use the enhanced AI response system
    const aiResponse = getAIResponse(userMessage);
    
    if (aiResponse.confidence > 0.8) {
      return {
        message: aiResponse.response,
        quickReplies: aiResponse.suggestedActions
      };
    }
    
    // Fallback to keyword matching for specific topics
    const message = userMessage.toLowerCase();
    
    if (message.includes('credit') || message.includes('kobo')) {
      return botResponses.credits;
    }
    if (message.includes('pay') || message.includes('billing') || message.includes('card') || message.includes('crypto') || message.includes('bitcoin')) {
      return botResponses.payment;
    }
    if (message.includes('verify') || message.includes('verification') || message.includes('documents')) {
      return botResponses.verification;
    }
    if (message.includes('bill') || message.includes('refund') || message.includes('charge')) {
      return botResponses.billing;
    }
    if (message.includes('technical') || message.includes('bug') || message.includes('error') || message.includes('not working')) {
      return botResponses.technical;
    }
    if (message.includes('account') || message.includes('login') || message.includes('password') || message.includes('verify')) {
      return botResponses.account;
    }
    if (message.includes('feature') || message.includes('how') || message.includes('what') || message.includes('match')) {
      return botResponses.features;
    }
    if (message.includes('safety') || message.includes('report') || message.includes('block') || message.includes('secure')) {
      return botResponses.safety;
    }
    if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone')) {
      return botResponses.contact;
    }
    if (message.includes('human') || message.includes('agent') || message.includes('ticket')) {
      return {
        message: 'I can connect you with our human support team! You can:\n\n🎫 Create a support ticket for detailed assistance\n📞 Call us at +1 (613) 861-5799\n📧 Email supports@dates.care\n\nOur agents specialize in:\n• Billing & Payments (Sarah)\n• Technical Issues (Mike & David)\n• Safety & Moderation (Emma)\n• Account & Verification (Mike)\n\nAverage response time: 2-4 hours\nUrgent matters: 15 minutes',
        quickReplies: ['Create support ticket', 'Call support', 'Email support', 'View agent availability']
      };
    }
    
    // Default response
    return {
      message: 'I understand you need help! I have access to our complete knowledge base and can assist with most questions. Here are some common topics, or you can ask me anything specific:\n\n📚 I can help with:\n• Credits, kobos, and pricing\n• Payment methods and crypto\n• Account verification\n• Technical troubleshooting\n• Safety and security\n• Features and how-to guides\n\nFor complex issues, I can connect you with our human support team.',
      quickReplies: ['Credits & Kobos', 'Payment Methods', 'Account Verification', 'Technical Support', 'Safety & Security', 'Talk to Human Agent']
    };
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse.message,
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Create support ticket' || reply === 'Talk to Human Agent' || reply === 'Talk to human agent') {
      setShowTicketForm(true);
    } else {
      sendMessage(reply);
    }
  };

  const createTicket = () => {
    if (!ticketData.subject.trim() || !ticketData.description.trim()) {
      alert('Please fill in both subject and description');
      return;
    }

    const ticketId = createSupportTicket(
      'current-user',
      'user@example.com',
      'Current User',
      ticketData.category,
      ticketData.subject,
      ticketData.description
    );

    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      message: `✅ Support ticket created successfully!\n\nTicket ID: ${ticketId}\nCategory: ${ticketData.category}\nPriority: Based on your issue\n\nOur support team will respond within:\n• Urgent: 15 minutes\n• High: 1 hour\n• Medium: 4 hours\n• Low: 24 hours\n\nYou'll receive email updates at your registered email address.`,
      timestamp: new Date(),
      quickReplies: ['Track my ticket', 'Contact support directly', 'Continue chatting']
    };

    setMessages(prev => [...prev, confirmationMessage]);
    setShowTicketForm(false);
    setTicketData({ category: 'general', subject: '', description: '' });
  };

  const addEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${className}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <MessageCircle className="w-8 h-8 text-white" />
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Dates.care AI Assistant</h3>
                <div className="flex items-center space-x-1 text-sm opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: showTicketForm ? '200px' : '300px' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Replies */}
                  {message.type === 'bot' && message.quickReplies && (
                    <div className="mt-2 space-y-1">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-3">
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

          {/* Support Ticket Form */}
          {showTicketForm && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Support Ticket
                </h4>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="general">General Support</option>
                  <option value="technical">Technical Issues</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="account">Account Issues</option>
                  <option value="safety">Safety & Security</option>
                  <option value="urgent">Urgent Matter</option>
                </select>
                
                <Input
                  placeholder="Subject"
                  value={ticketData.subject}
                  onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                  className="text-sm"
                />
                
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={ticketData.description}
                  onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowTicketForm(false)}
                    className="flex-1 bg-gray-500 text-white text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createTicket}
                    className="flex-1 bg-blue-500 text-white text-sm"
                  >
                    Create Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`border-t border-gray-200 p-4 ${showTicketForm ? 'hidden' : ''}`}>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Upload file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
                className="bg-blue-500 text-white p-2 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
                <div className="grid grid-cols-10 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:bg-gray-200 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact Options */}
            <div className="mt-3 flex justify-center space-x-4 text-xs">
              <button 
                onClick={() => window.open('tel:+16138615799')}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <Phone className="w-3 h-3" />
                <span>Call Support</span>
              </button>
              <button 
                onClick={() => window.open('mailto:supports@dates.care')}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <Mail className="w-3 h-3" />
                <span>Email Support</span>
              </button>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Create Ticket</span>
              </button>
              <div className="flex items-center space-x-1 text-green-500">
                <Clock className="w-3 h-3" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};