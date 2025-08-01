import React from 'react';
import { ChevronLeftIcon, XIcon, Settings, User, Heart } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  showProfile?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showClose = false,
  showProfile = false,
  showSettings = false,
  onBack,
  onClose,
  onProfile,
  onSettings,
  className = ""
}) => {
  return (
    <div className={`relative w-full h-20 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-2xl z-30 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-[0px_8px_32px_rgba(0,0,0,0.25)]" />
      
      {/* Left side buttons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
        )}
        {showProfile && (
          <button 
            onClick={onProfile}
            className="p-2 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
      
      {/* Center title */}
      <div className="absolute inset-0 flex items-center justify-center">
        {title && (
          <div className="flex items-center space-x-2">
            <h1 className="font-alegreya font-bold text-white text-2xl">
              Dates
            </h1>
          </div>
        )}
      </div>
      
      {/* Right side buttons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
        {showSettings && (
          <button 
            onClick={onSettings}
            className="p-2 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        )}
        {showClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};