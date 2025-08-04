import React, { useState } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  CreditCard, 
  Video, 
  Phone, 
  Gift, 
  Heart, 
  Users, 
  MessageCircle,
  Home,
  Settings,
  HelpCircle,
  Star,
  Crown,
  Newspaper,
  Mail,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { MessageChatBox } from './MessageChatBox';
import { cn } from '@/lib/utils';

interface MenuProps {
  onNavigate: (screen: any) => void;
  currentScreen: string;
}

export const Menu: React.FC<MenuProps> = ({ onNavigate, currentScreen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuSections = [
    {
      title: 'Main Navigation',
      items: [
        { id: 'discovery', icon: Home, label: 'Home', description: 'Discover new matches' },
        { id: 'matches', icon: Heart, label: 'Matches', description: 'Your connections' },
        { id: 'likes', icon: Star, label: 'Likes', description: 'Who likes you' },
        { id: 'profile', icon: User, label: 'Profile', description: 'Your profile' },
        { id: 'newsfeed', icon: Newspaper, label: 'Newsfeed', description: 'Community stories' },
        { id: 'mail', icon: Mail, label: 'Mail', description: 'Private messages' },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'signin', icon: LogIn, label: 'Sign In', description: 'Access your account' },
        { id: 'signup', icon: UserPlus, label: 'Sign Up', description: 'Create new account' },
        { id: 'settings', icon: Settings, label: 'Settings', description: 'App preferences' },
      ]
    },
    {
      title: 'Premium Features',
      items: [
        { id: 'credits', icon: CreditCard, label: 'Credits', description: 'Purchase credits' },
        { id: 'gift-shop', icon: Gift, label: 'Gift Shop', description: 'Send virtual gifts' },
        { id: 'match-suitor', icon: Crown, label: 'Match Suitor', description: 'Premium matching' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { id: 'video-chat', icon: Video, label: 'Video Chat', description: 'Video calls with matches' },
        { id: 'audio-chat', icon: Phone, label: 'Audio Chat', description: 'Voice calls with matches' },
      ]
    },
    {
      title: 'Support & Wellness',
      items: [
        { id: 'couple-therapy', icon: Users, label: 'Couple Therapy', description: 'Professional guidance' },
        { id: 'counselling', icon: MessageCircle, label: 'Counselling', description: 'Personal support' },
        { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
        { id: 'menu-showcase', icon: MenuIcon, label: 'Menu Overview', description: 'View all navigation options' },
        { id: 'staff-panel', icon: Shield, label: 'Staff Panel', description: 'Staff credit management' },
        { id: 'feedback', icon: MessageCircle, label: 'Feedback & Suggestions', description: 'Help us improve' },
      ]
    },
    {
      title: 'Legal & Privacy',
      items: [
        { id: 'terms', icon: Shield, label: 'Terms of Service', description: 'User agreement' },
        { id: 'privacy', icon: Shield, label: 'Privacy Policy', description: 'Data protection' },
        { id: 'dispute', icon: HelpCircle, label: 'Dispute Resolution', description: 'Conflict resolution' },
        { id: 'disclaimer', icon: AlertTriangle, label: 'Legal Disclaimer', description: 'Legal notices' },
      ]
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (screenId: string) => {
    onNavigate(screenId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className={cn(
          "fixed top-6 left-4 z-50 p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl",
          "hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer",
          "touch-manipulation safe-area-inset-top"
        )}
        type="button"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white flex-shrink-0" />
        ) : (
          <MenuIcon className="w-6 h-6 text-white flex-shrink-0" />
        )}
      </button>

      {/* Message Chat Box */}
      <div className="fixed top-6 right-4 z-50 safe-area-inset-top">
        <MessageChatBox />
      </div>
      {/* Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm touch-manipulation" 
          onClick={toggleMenu}
          onTouchStart={toggleMenu}
        />
      )}

      {/* Menu Panel */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 sm:w-96 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-600 shadow-2xl",
        "transform transition-transform duration-300 z-50 safe-area-inset-top safe-area-inset-bottom",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          {/* Menu Header */}
          <div className="mb-6 sm:mb-8 pt-16 sm:pt-20">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Dates Menu</h2>
            </div>
            <p className="text-white/80 text-sm sm:text-base">Navigate to any section</p>
          </div>

          {/* Menu Sections */}
          <div className="space-y-4 sm:space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-white/90 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 p-3 sm:p-4 rounded-xl transition-all duration-200",
                          "touch-manipulation active:scale-95 hover:scale-[1.02] cursor-pointer select-none user-select-none",
                          isActive 
                            ? 'bg-white/30 text-white shadow-lg' 
                            : 'text-white/80 hover:bg-white/20 hover:text-white'
                        )}
                        type="button"
                        role="button"
                        tabIndex={0}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm sm:text-base truncate">{item.label}</div>
                          <div className="text-xs sm:text-sm opacity-75 truncate">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Menu Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
            <div className="text-center text-white/60 text-xs">
              <p>© 2025 Dates</p>
              <p className="mt-1">Made with ❤️ for finding love</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};