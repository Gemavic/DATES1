import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Zap, Shield, FileText, Users, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { agentAssistant } from '@/lib/agentAssistant';

interface SupportWidgetProps {
  className?: string;
}

export const SupportWidget: React.FC<SupportWidgetProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgentStatus, setShowAgentStatus] = useState(false);
  
  const supportStats = agentAssistant.getSupportStats();
  const agentWorkload = agentAssistant.getAgentWorkload();

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
    },
    {
      icon: FileText,
      title: 'Create Ticket',
      description: 'Detailed support request',
      color: 'from-purple-500 to-indigo-500',
      action: () => {
        // This will trigger the ChatBot ticket form
        setIsOpen(false);
        // You could also navigate to a dedicated ticket page
      }
    },
    {
      icon: Users,
      title: 'Agent Status',
      description: `${supportStats.agentsOnline} agents online`,
      color: 'from-teal-500 to-cyan-500',
      action: () => {
        setShowAgentStatus(!showAgentStatus);
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
          
          {/* Agent Status */}
          {showAgentStatus && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Headphones className="w-4 h-4 mr-2" />
                Support Team Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white">
                  <span>Agents Online:</span>
                  <span className="font-bold text-green-400">{supportStats.agentsOnline}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Open Tickets:</span>
                  <span className="font-bold text-yellow-400">{supportStats.openTickets}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Avg Response:</span>
                  <span className="font-bold text-blue-400">{Math.round(supportStats.averageResponseTime)} min</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Satisfaction:</span>
                  <span className="font-bold text-green-400">{supportStats.satisfactionRating.toFixed(1)}/5.0</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-white/80 text-xs text-center">
                  Specialized agents available for billing, technical, safety, and account support
                </p>
              </div>
            </div>
          )}
          
          {/* 24/7 Notice */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center space-x-2 text-white mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24/7 AI + Human Support</span>
            </div>
            <p className="text-xs text-white/80">AI instant responses + Human agents for complex issues</p>
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative"
      >
        <HelpCircle className="w-7 h-7 text-white" />
        {supportStats.agentsOnline > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{supportStats.agentsOnline}</span>
          </div>
        )}
      </button>
    </div>
  );
};