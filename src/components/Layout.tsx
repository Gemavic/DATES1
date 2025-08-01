import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  showProfile?: boolean;
  showSettings?: boolean;
  showFooter?: boolean;
  activeTab?: string;
  onBack?: () => void;
  onClose?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onNavigate?: (screen: string) => void;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showBack = true,
  showClose = true,
  showProfile = false,
  showSettings = false,
  showFooter = false,
  activeTab,
  onBack,
  onClose,
  onProfile,
  onSettings,
  onNavigate,
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-pink-500 ${className}`}>
      <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          showBack={showBack}
          showClose={showClose}
          showProfile={showProfile}
          showSettings={showSettings}
          onBack={onBack}
          onClose={onClose}
          onProfile={onProfile}
          onSettings={onSettings}
        />
        
        {/* Content */}
        <div className={`relative z-10 ${showFooter ? 'pb-32' : 'pb-8'}`}>
          {children}
        </div>
        
        {/* Footer */}
        {showFooter && onNavigate && (
          <Footer
            activeTab={activeTab}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};