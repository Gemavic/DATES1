import React from 'react';
import { Heart, Search, User, Settings, Newspaper, Mail, Users, MessageCircle, MessageSquare } from 'lucide-react';
import { MessageChatBox } from './MessageChatBox';
import { cn } from '@/lib/utils';

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
      <div className={cn(
        "fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-40",
        "safe-area-inset-bottom",
        className
      )}>
        <div className="max-w-md mx-auto lg:max-w-full">
          <div className="flex justify-around py-3 px-2 sm:px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            if (tab.isChat) {
              return (
                <div key={tab.id} className="flex flex-col items-center py-2 px-1 sm:px-3 min-w-0">
                  <div className="relative">
                    <MessageChatBox />
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 truncate">{tab.label}</span>
                </div>
              );
            }
            
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Footer tab clicked:', tab.id);
                  
                  if (tab.id === 'mail') {
                    onNavigate('mail');
                  } else if (tab.id === 'newsfeed') {
                    onNavigate('newsfeed');
                  } else {
                    onNavigate(tab.id);
                  }
                }}
                className={cn(
                  "flex flex-col items-center py-2 px-1 sm:px-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation min-w-0",
                  "cursor-pointer select-none",
                  isActive 
                    ? 'text-white bg-pink-500 shadow-lg' 
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                )}
                type="button"
              >
                <Icon className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 mb-1 drop-shadow-sm flex-shrink-0",
                  isActive && 'fill-current'
                )} />
                <span className="text-xs font-medium drop-shadow-sm truncate">{tab.label}</span>
              </button>
            );
          })}
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="bg-gray-50 py-2 px-2 sm:px-4 border-t border-gray-100 lg:hidden">
          <div className="flex justify-center space-x-3 text-xs text-gray-500">
            <span>© 2025 Dates</span>
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-pink-600 underline touch-manipulation"
            >
              Privacy
            </button>
            <button 
              onClick={() => onNavigate('terms')}
              className="hover:text-pink-600 underline touch-manipulation"
            >
              Terms
            </button>
            <button 
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-pink-600 underline touch-manipulation"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};