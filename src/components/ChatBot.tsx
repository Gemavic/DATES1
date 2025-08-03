import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Mail, Clock, Zap, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hi! I\'m your Dates.care AI assistant. I\'m here 24/7 to help you with any questions about our dating platform, credits, features, or technical support. How can I assist you today?',
      timestamp: new Date(),
      quickReplies: ['How do credits work?', 'Payment help', 'Technical support', 'Account issues']
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
      message: 'Our credit system works like this:\n\n💳 Credits are used for premium features:\n• Live Chat: 2 credits/minute\n• Send Photos: 10 credits\n• Video Calls: 60 credits/minute\n• Audio Calls: 50 credits/minute\n• Mail: 10-30 credits\n\n💖 Kobos are for chat time (1 kobo = 1 minute)\n\nNew users get 10 free credits + 10 kobos!',
      quickReplies: ['Buy more credits', 'Free features', 'Payment methods']
    },
    'payment': {
      message: 'We accept multiple payment methods:\n\n💳 Credit/Debit Cards (Visa, MasterCard, Amex)\n₿ Cryptocurrencies (Bitcoin, Ethereum, USDT, etc.)\n📱 Mobile Payments (Apple Pay, Google Pay)\n💙 PayPal: histogm@gmail.com\n\nAll payments are secured with 256-bit SSL encryption.',
      quickReplies: ['Crypto payments', 'Card payment help', 'PayPal support']
    },
    'technical': {
      message: 'I can help with technical issues:\n\n🔧 Common solutions:\n• Clear browser cache and cookies\n• Try a different browser\n• Check internet connection\n• Update your browser\n\nFor complex issues, contact our tech team at tech@dates.care',
      quickReplies: ['Login problems', 'App not loading', 'Contact tech support']
    },
    'account': {
      message: 'Account support available:\n\n👤 Account Issues:\n• Password reset\n• Email verification\n• Profile problems\n• Verification status\n\n📧 Contact: support@dates.care\n📞 Phone: +1 (613) 861-5799\n\nOur team responds within 24 hours!',
      quickReplies: ['Reset password', 'Verification help', 'Contact support']
    },
    'features': {
      message: 'Dates.care features:\n\n💕 All Paid Features:\n• Smart matching algorithm\n• Video & audio calls (60/50 credits/min)\n• Private messaging & mail (10-30 credits)\n• Virtual gift shop (varies)\n• Couple therapy sessions\n• 24/7 AI support\n\n⚠️ NO FREE SERVICES - All features require credits\n⚠️ Pricing subject to change without notice',
      quickReplies: ['Safety features', 'Premium features', 'How matching works']
    },
    'safety': {
      message: 'Your safety is our priority:\n\n🛡️ Safety Features:\n• Profile verification system\n• Report & block users\n• End-to-end encryption\n• Content moderation\n• 24/7 monitoring\n\nAlways meet in public places for first dates!',
      quickReplies: ['Report user', 'Verification process', 'Safety tips']
    },
    'contact': {
      message: 'Contact Dates.care:\n\n📧 Email Support:\n• General: info@dates.care\n• Support: supports@dates.care\n• Technical: tech@dates.care\n• Admin: admin@dates.care\n\n📞 Phone: +1 (613) 861-5799\n📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada\n\n⏰ Available 24/7 for urgent matters!',
      quickReplies: ['Email support', 'Call support', 'Emergency help']
    }
  };

  const generateBotResponse = (userMessage: string): { message: string; quickReplies?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('credit') || message.includes('kobo') || message.includes('payment') || message.includes('buy')) {
      return botResponses.credits;
    }
    if (message.includes('pay') || message.includes('card') || message.includes('crypto') || message.includes('bitcoin')) {
      return botResponses.payment;
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
    
    // Default response
    return {
      message: 'I understand you need help! Here are some common topics I can assist with. You can also contact our human support team at supports@dates.care or call +1 (613) 861-5799 for immediate assistance.',
      quickReplies: ['Credits & Payment', 'Technical Support', 'Account Help', 'Safety & Security', 'Contact Human Support']
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
    sendMessage(reply);
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
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
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
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                <Phone className="w-3 h-3" />
                <span>Call Support</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                <Mail className="w-3 h-3" />
                <span>Email Support</span>
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