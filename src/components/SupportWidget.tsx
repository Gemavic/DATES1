import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportWidgetProps {
  className?: string;
}

export const SupportWidget: React.FC<SupportWidgetProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with AI assistant',
      color: 'from-blue-500 to-purple-600',
      action: () => {
        // This will be handled by the ChatBot component
        setIsOpen(false);
      }
    },
    {
      icon: Phone,
      title: 'Call Support',
      description: '+1 (613) 861-5799',
      color: 'from-green-500 to-teal-500',
      action: () => {
        window.open('tel:+16138615799');
        setIsOpen(false);
      }
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'supports@dates.care',
      color: 'from-pink-500 to-rose-500',
      action: () => {
        window.open('mailto:supports@dates.care');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className={`fixed bottom-24 left-6 z-40 ${className}`}>
      {/* Support Options */}
      {isOpen && (
        <div className="mb-4 space-y-2">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.action}
                className={`w-full flex items-center space-x-3 p-3 bg-gradient-to-r ${option.color} rounded-xl text-white shadow-lg hover:scale-105 transition-all duration-300`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">{option.title}</div>
                  <div className="text-xs opacity-90">{option.description}</div>
                </div>
              </button>
            );
          })}
          
          {/* 24/7 Notice */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center space-x-2 text-white mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <p className="text-xs text-white/80">We're always here to help!</p>
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <HelpCircle className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};