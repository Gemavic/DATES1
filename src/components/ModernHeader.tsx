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
      "relative w-full h-14 sm:h-16 z-30 transition-all duration-300 safe-area-inset-top",
      transparent 
        ? "bg-transparent" 
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm",
      className
    )}>
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation active:scale-95 cursor-pointer"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
            </button>
          )}
          
          {showMenu && !showBack && (
            <button 
              onClick={onMenu}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation active:scale-95 cursor-pointer"
              type="button"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
            </button>
          )}

          {title && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{title}</h1>
            </div>
          )}
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
          {!title && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dates</h1>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {showSearch && (
            <button 
              onClick={onSearch}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation active:scale-95 cursor-pointer"
              type="button"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
            </button>
          )}

          {showNotifications && (
            <button 
              onClick={onNotifications}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation active:scale-95 cursor-pointer relative"
              type="button"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
              <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          )}

          {showSettings && (
            <button 
              onClick={onSettings}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation active:scale-95 cursor-pointer"
              type="button"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};