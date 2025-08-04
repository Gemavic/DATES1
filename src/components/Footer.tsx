import React from 'react';
import { Heart, Search, User, Settings, Newspaper, Mail, Users, MessageCircle, MessageSquare } from 'lucide-react';
import { MessageChatBox } from './MessageChatBox';

interface FooterProps {
  activeTab?: string;
  onNavigate: (screen: any) => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab = 'discovery',
  onNavigate,
  className = ""
}) => {
  const tabs = [
    { id: 'discovery', icon: Search, label: 'Search' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', isChat: true },
    { id: 'mail', icon: Mail, label: 'Mail' },
    { id: 'newsfeed', icon: Newspaper, label: 'News' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
    { id: 'profile', icon: Users, label: 'People' },
  ];

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-40 ${className}`}>
        <div className="max-w-md mx-auto lg:max-w-full">
          <div className="flex justify-around py-2 px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            if (tab.isChat) {
              return (
                <div key={tab.id} className="flex flex-col items-center py-2 px-3">
                  <Icon className={`w-6 h-6 mb-1 drop-shadow-sm ${isActive ? 'fill-current' : ''}`} />
                  <span className="text-xs font-medium drop-shadow-sm">{tab.label}</span>
                </div>
              );
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive 
                    ? 'text-white bg-pink-500 shadow-lg' 
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 drop-shadow-sm ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium drop-shadow-sm">{tab.label}</span>
              </button>
            );
          })}
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="bg-gray-50 py-2 px-4 border-t border-gray-100 sm:px-6 lg:hidden">
          <div className="flex justify-center space-x-3 text-xs text-gray-500">
            <span>© 2025 Dates</span>
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-pink-600 underline"
            >
              Privacy
            </button>
            <button 
              onClick={() => onNavigate('terms')}
              className="hover:text-pink-600 underline"
            >
              Terms
            </button>
            <button 
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-pink-600 underline"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};