import React, { useState } from 'react';
import { ModernLayout } from '@/components/ModernLayout';
import { ModernHeader } from '@/components/ModernHeader';
import { SwipeCard } from '@/components/SwipeCard';
import { Button } from '@/components/ui/button';
import { creditManager } from '@/lib/creditSystem';
import { sendLikeNotification, sendProfileViewNotification, sendMessageNotification, sendWinkNotification } from '@/lib/emailNotifications';
import { 
  Filter,
  Zap,
  Crown,
  MessageCircle,
  Video,
  Gift,
  Users,
  TrendingUp,
  MapPin,
  Settings
} from 'lucide-react';

interface ModernDiscoveryProps {
  onNavigate: (screen: string) => void;
}

export const ModernDiscovery: React.FC<ModernDiscoveryProps> = ({ onNavigate }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const profiles = [
    {
      id: '1',
      name: 'Emma',
      age: 25,
      location: 'New York, NY',
      occupation: 'Graphic Designer',
      education: 'NYU',
      images: [
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      bio: 'Love exploring new coffee shops and weekend hiking adventures. Looking for someone who shares my passion for creativity and outdoor activities. Always up for spontaneous adventures and deep conversations over a good cup of coffee.',
      interests: ['Coffee', 'Hiking', 'Design', 'Photography', 'Travel', 'Art', 'Music'],
      online: true,
      verified: true,
      premium: false
    },
    {
      id: '2',
      name: 'Sophia',
      age: 27,
      location: 'San Francisco, CA',
      occupation: 'Software Engineer',
      education: 'Stanford',
      images: [
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      bio: 'Tech enthusiast by day, chef by night. Always up for trying new restaurants or cooking something delicious at home. Looking for someone who appreciates good food and great conversations.',
      interests: ['Cooking', 'Technology', 'Music', 'Travel', 'Fitness', 'Wine', 'Innovation'],
      online: true,
      verified: true,
      premium: true
    },
    {
      id: '3',
      name: 'Isabella',
      age: 24,
      location: 'Los Angeles, CA',
      occupation: 'Marketing Manager',
      education: 'UCLA',
      images: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      bio: 'Beach lover and yoga enthusiast. Seeking genuine connections and meaningful conversations over sunset walks. Life is too short for anything but authentic relationships.',
      interests: ['Yoga', 'Beach', 'Reading', 'Movies', 'Wellness', 'Meditation', 'Nature'],
      online: false,
      verified: true,
      premium: false
    }
  ];

  const currentProfile = profiles[currentProfileIndex];

  const handleLike = () => {
    console.log('Liked:', currentProfile.id);
    
    // Send email notification to the liked user
    sendLikeNotification(currentProfile.id, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    // Send profile view notification as well (since liking implies viewing)
    sendProfileViewNotification(currentProfile.id, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    nextProfile();
  };

  const handlePass = () => {
    console.log('Passed:', currentProfile.id);
    nextProfile();
  };

  const handleSuperLike = () => {
    console.log('Super liked:', currentProfile.id);
    
    // Send email notification for super like
    sendLikeNotification(currentProfile.id, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    // Send profile view notification as well
    sendProfileViewNotification(currentProfile.id, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    nextProfile();
  };

  const handleSendMessage = (profileId: string, message: string) => {
    console.log('Message sent to:', profileId, message);
    
    // Send message notification
    sendMessageNotification(profileId, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = `💬 Message sent to ${currentProfile.name}!`;
    document.body.appendChild(successMessage);
    setTimeout(() => document.body.removeChild(successMessage), 3000);
    
    nextProfile();
  };

  const handleBlink = (profileId: string) => {
    console.log('Blink sent to:', profileId);
    
    // Send blink notification (using wink notification)
    sendWinkNotification(profileId, {
      name: 'You',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      id: 'current-user'
    });
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = `👁️ Blink sent to ${currentProfile.name}!`;
    document.body.appendChild(successMessage);
    setTimeout(() => document.body.removeChild(successMessage), 3000);
    
    nextProfile();
  };
  const handleReport = (profileId: string) => {
    console.log('Reported:', profileId);
    alert('User reported. Thank you for keeping our community safe.');
  };

  const handleBlock = (profileId: string) => {
    console.log('Blocked:', profileId);
    alert('User blocked successfully.');
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  return (
    <ModernLayout>
      <ModernHeader
        showMenu={true}
        onMenu={() => {/* Handle menu */}}
        showSearch={true}
        onSearch={() => setShowFilters(!showFilters)}
        showNotifications={true}
      />

      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full">
          {/* Main Profile Card */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <SwipeCard
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
                onReport={handleReport}
                onBlock={handleBlock}
              />
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="w-80 p-6 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => onNavigate('video-chat')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-all duration-300"
                  disabled={!creditManager.canAfford('current-user', 60) && !creditManager.isStaffMember('current-user')}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video Chat (60/min)
                </Button>
                <Button 
                  onClick={() => onNavigate('mail')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  onClick={() => onNavigate('gift-shop')}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 transition-all duration-300"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Gift
                </Button>
              </div>
            </div>

            {/* Boost Profile */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Boost Your Profile
              </h3>
              <p className="text-sm mb-4 opacity-90">Get 10x more views and matches</p>
              <Button 
                onClick={() => onNavigate('credits')}
                className="w-full bg-white text-orange-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                Boost Now - 10 Credits
              </Button>
            </div>

            {/* Discovery Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Discovery Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Profiles Viewed</span>
                  <span className="text-white font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Likes Given</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Super Likes</span>
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Matches Today</span>
                  <span className="text-green-400 font-bold">5</span>
                </div>
              </div>
            </div>

            {/* Location & Filters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Discovery Settings
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters & Preferences
                </Button>
                <Button 
                  onClick={() => onNavigate('settings')}
                  className="w-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Discovery Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full flex flex-col">
          <div className="flex-1 p-4 flex items-center justify-center">
            <SwipeCard
              profile={currentProfile}
              onLike={handleLike}
              onPass={handlePass}
              onSuperLike={handleSuperLike}
              onSendMessage={handleSendMessage}
              onBlink={handleBlink}
              onSendMessage={handleSendMessage}
              onBlink={handleBlink}
              onReport={handleReport}
              onBlock={handleBlock}
              className="max-w-sm"
            />
          </div>

          {/* Mobile Quick Actions */}
          <div className="p-4 bg-white/10 backdrop-blur-sm">
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => onNavigate('video-chat')}
                className="bg-blue-500 text-white p-3 rounded-full hover:scale-110 transition-all duration-300"
                disabled={!creditManager.canAfford('current-user', 60) && !creditManager.isStaffMember('current-user')}
              >
                <Video className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => onNavigate('mail')}
                className="bg-green-500 text-white p-3 rounded-full hover:scale-110 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => onNavigate('gift-shop')}
                className="bg-pink-500 text-white p-3 rounded-full hover:scale-110 transition-all duration-300"
              >
                <Gift className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => onNavigate('credits')}
                className="bg-yellow-500 text-white p-3 rounded-full hover:scale-110 transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Discovery Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age Range</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="18" className="flex-1 p-2 border rounded-lg" />
                  <span className="self-center">to</span>
                  <input type="number" placeholder="35" className="flex-1 p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Distance</label>
                <input type="range" min="1" max="100" className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 mile</span>
                  <span>100+ miles</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gray-500 text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-pink-500 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};