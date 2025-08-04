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
      "relative w-full h-14 sm:h-16 z-30 transition-all duration-300",
      transparent 
        ? "bg-transparent" 
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm",
      className
    )}>
      <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}
          
          {showMenu && !showBack && (
            <button 
              onClick={onMenu}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}

          {title && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
          {!title && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dates</h1>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {showSearch && (
            <button 
              onClick={onSearch}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          )}

          {showNotifications && (
            <button 
              onClick={onNotifications}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </button>
          )}

          {showSettings && (
            <button 
              onClick={onSettings}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};