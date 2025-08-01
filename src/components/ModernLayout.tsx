import React from 'react';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  className = "",
  showSidebar = false
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600",
      "relative overflow-hidden",
      className
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-pink-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-28 h-28 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-16 right-10 w-20 h-20 bg-rose-300/20 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {showSidebar && (
          <div className="w-80 bg-white/10 backdrop-blur-sm border-r border-white/20">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Dates</h1>
              </div>
              
              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-2">Your Activity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Profile Views</span>
                      <span className="text-white font-medium">124</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Matches</span>
                      <span className="text-white font-medium">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Messages</span>
                      <span className="text-white font-medium">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen">
        <div className="max-w-md mx-auto min-h-screen relative">
          {children}
        </div>
      </div>
    </div>
  );
};