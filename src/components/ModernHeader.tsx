import React from 'react';
import { ChevronLeft, Settings, Bell, Search, Menu, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageChatBox } from './MessageChatBox';

interface ModernHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  onSettings?: () => void;
  className?: string;
  transparent?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  showBack = false,
  showMenu = true,
  showSearch = false,
  showNotifications = true,
  showSettings = false,
  onBack,
  onMenu,
  onSearch,
  onNotifications,
  onSettings,
  className = "",
  transparent = false
}) => {
  return (
    <div className={cn(
      "relative w-full h-16 z-30 transition-all duration-300",
      transparent 
        ? "bg-transparent" 
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm",
      className
    )}>
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          
          {showMenu && !showBack && (
            <button 
              onClick={onMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {title && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
          {!title && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dates</h1>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <button 
              onClick={onSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {showNotifications && (
            <button 
              onClick={onNotifications}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          )}

          {showSettings && (
            <button 
              onClick={onSettings}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};