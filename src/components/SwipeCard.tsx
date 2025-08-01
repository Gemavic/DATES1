import React, { useState, useRef } from 'react';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, MoreVertical, Flag, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation?: string;
  education?: string;
  images: string[];
  bio: string;
  interests: string[];
  online?: boolean;
  verified?: boolean;
  premium?: boolean;
}

interface SwipeCardProps {
  profile: Profile;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onSuperLike: (id: string) => void;
  onReport?: (id: string) => void;
  onBlock?: (id: string) => void;
  className?: string;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onLike,
  onPass,
  onSuperLike,
  onReport,
  onBlock,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      setDragOffset({
        x: moveClientX - clientX,
        y: moveClientY - clientY
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      
      // Determine action based on drag distance
      if (Math.abs(dragOffset.x) > 100) {
        if (dragOffset.x > 0) {
          onLike(profile.id);
        } else {
          onPass(profile.id);
        }
      } else if (dragOffset.y < -100) {
        onSuperLike(profile.id);
      }
      
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden",
        "transform transition-transform duration-200",
        isDragging && "cursor-grabbing",
        className
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Safety Menu */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
          
          {showMenu && (
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px] z-30">
              <button
                onClick={() => {
                  onReport?.(profile.id);
                  setShowMenu(false);
                  // Show report confirmation
                  const successMessage = document.createElement('div');
                  successMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                  successMessage.textContent = 'User reported. Thank you for keeping our community safe.';
                  document.body.appendChild(successMessage);
                  setTimeout(() => document.body.removeChild(successMessage), 3000);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Flag className="w-4 h-4 mr-2" />
                Report
              </button>
              <button
                onClick={() => {
                  onBlock?.(profile.id);
                  setShowMenu(false);
                  // Show block confirmation
                  const successMessage = document.createElement('div');
                  successMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                  successMessage.textContent = 'User blocked successfully.';
                  document.body.appendChild(successMessage);
                  setTimeout(() => document.body.removeChild(successMessage), 3000);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Block
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
        {profile.online && (
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Online
          </div>
        )}
        {profile.verified && (
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            ✓ Verified
          </div>
        )}
        {profile.premium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            Premium
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={profile.images[currentImageIndex]}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Image Navigation */}
        {profile.images.length > 1 && (
          <>
            <button
              onClick={() => handleImageClick('prev')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
              disabled={currentImageIndex === 0}
            >
              <span className="text-white text-lg">‹</span>
            </button>
            <button
              onClick={() => handleImageClick('next')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
              disabled={currentImageIndex === profile.images.length - 1}
            >
              <span className="text-white text-lg">›</span>
            </button>
            
            {/* Image Indicators */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {profile.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 mr-1 drop-shadow-sm" />
            <span className="text-sm drop-shadow-sm">{profile.location}</span>
          </div>
          {profile.occupation && (
            <div className="flex items-center mb-1">
              <Briefcase className="w-4 h-4 mr-1 drop-shadow-sm" />
              <span className="text-sm drop-shadow-sm">{profile.occupation}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1 drop-shadow-sm" />
              <span className="text-sm drop-shadow-sm">{profile.education}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bio and Interests */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50">
        <p className="text-gray-800 text-sm mb-4 leading-relaxed">
          {profile.bio}
        </p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-xs rounded-full border border-pink-200 hover:from-pink-200 hover:to-rose-200 transition-colors"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 p-6 bg-white">
        <button
          onClick={() => onPass(profile.id)}
          className="w-14 h-14 bg-gray-500 hover:bg-gray-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group"
        >
          <X className="w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => onSuperLike(profile.id)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group"
        >
          <Star className="w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => onLike(profile.id)}
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group"
        >
          <Heart className="w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Swipe Hints */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {dragOffset.x > 50 && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              LIKE
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              PASS
            </div>
          )}
          {dragOffset.y < -50 && (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              SUPER LIKE
            </div>
          )}
        </div>
      )}
    </div>
  );
};