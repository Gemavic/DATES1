import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600",
      "relative overflow-hidden",
      className
    )}>
      {/* Desktop/Tablet Container */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden lg:block w-80 bg-white/10 backdrop-blur-sm border-r border-white/20">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto">
          {children}
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden xl:block w-80 bg-white/10 backdrop-blur-sm border-l border-white/20">
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4">Online Now</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">User {i}</p>
                    <p className="text-white/70 text-xs">Online now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Container */}
      <div className="md:hidden min-h-screen">
        <div className="max-w-md mx-auto min-h-screen relative">
          {children}
        </div>
      </div>
    </div>
  );
};