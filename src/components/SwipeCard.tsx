import React, { useState, useRef } from 'react';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, MoreVertical, Flag, Shield, Zap, MessageCircle, Send, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendProfileViewNotification } from '@/lib/emailNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  onSendMessage: (id: string, message: string) => void;
  onBlink: (id: string) => void;
  onReport?: (id: string) => void;
  onBlock?: (id: string) => void;
  className?: string;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onLike,
  onPass,
  onSuperLike,
  onSendMessage,
  onBlink,
  onReport,
  onBlock,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Send profile view notification when card is rendered
  React.useEffect(() => {
    sendProfileViewNotification(profile.id, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
  }, [profile.id]);

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
  const emojis = ['😊', '😍', '🥰', '😘', '💕', '❤️', '🔥', '✨', '🌹', '💖', '😉', '😎', '🤗', '💋', '🌟', '💫'];

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(profile.id, message);
      setMessage('');
      setShowMessageBox(false);
      setShowEmojiPicker(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleBlink = () => {
    onBlink(profile.id);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-sm mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden",
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
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
          
          {showMenu && (
            <div className="absolute top-8 sm:top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px] z-30">
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
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col space-y-1 sm:space-y-2 z-10">
        {profile.online && (
          <div className="bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Online
          </div>
        )}
        {profile.verified && (
          <div className="bg-blue-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
            ✓ Verified
          </div>
        )}
        {profile.premium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium flex items-center">
            <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
            Premium
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="relative h-80 sm:h-96 md:h-[500px] overflow-hidden">
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
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
              disabled={currentImageIndex === 0}
            >
              <span className="text-white text-base sm:text-lg">‹</span>
            </button>
            <button
              onClick={() => handleImageClick('next')}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
              disabled={currentImageIndex === profile.images.length - 1}
            >
              <span className="text-white text-base sm:text-lg">›</span>
            </button>
            
            {/* Image Indicators */}
            <div className="absolute top-1.5 sm:top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {profile.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors",
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
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
          <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center mb-1 sm:mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 drop-shadow-sm" />
            <span className="text-sm drop-shadow-sm">{profile.location}</span>
          </div>
          {profile.occupation && (
            <div className="flex items-center mb-1">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 drop-shadow-sm" />
              <span className="text-sm drop-shadow-sm">{profile.occupation}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 drop-shadow-sm" />
              <span className="text-sm drop-shadow-sm">{profile.education}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bio and Interests */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50">
        <p className="text-gray-800 text-sm mb-3 sm:mb-4 leading-relaxed">
          {profile.bio}
        </p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {profile.interests.map((interest, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-xs rounded-full border border-pink-200 hover:from-pink-200 hover:to-rose-200 transition-colors"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      {/* Message Box */}
      {showMessageBox && (
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send a message to ${profile.name}...`}
              className="w-full min-h-[60px] sm:min-h-[80px] resize-none text-sm"
            />
            
            {/* Chat Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowMessageBox(false)}
                  className="bg-gray-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 flex items-center text-sm"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Send
                </Button>
              </div>
            </div>
            
            {/* Message Input with Embedded Emoji */}
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Send a message to ${profile.name}...`}
                className="w-full min-h-[60px] sm:min-h-[80px] resize-none pl-10 sm:pl-12 text-sm"
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute left-2 sm:left-3 top-2 sm:top-3 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 touch-manipulation"
                title="Add emoji"
              >
                <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg sm:text-xl hover:bg-gray-200 rounded p-0.5 sm:p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-white">
        <button
          onClick={() => onPass(profile.id)}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 hover:bg-gray-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group touch-manipulation active:scale-95"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={handleBlink}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group touch-manipulation active:scale-95"
          title="Send a Blink"
        >
          <span className="text-white text-base sm:text-lg drop-shadow-sm group-hover:scale-110 transition-transform">👁️</span>
        </button>
        
        <button
          onClick={() => setShowMessageBox(!showMessageBox)}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group touch-manipulation active:scale-95"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => onSuperLike(profile.id)}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-2xl group touch-manipulation active:scale-95"
        >
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Swipe Hints */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {dragOffset.x > 50 && (
            <div className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-base sm:text-lg shadow-lg">
              LIKE
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-base sm:text-lg shadow-lg">
              PASS
            </div>
          )}
          {dragOffset.y < -50 && (
            <div className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-base sm:text-lg shadow-lg">
              SUPER LIKE
            </div>
          )}
        </div>
      )}
    </div>
  );
};