import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Search, Filter, Users } from 'lucide-react';
import { SwipeCard } from '@/components/SwipeCard';
import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { sendLikeNotification, sendMessageNotification, sendWinkNotification } from '@/lib/emailNotifications';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  images: string[];
  bio: string;
  interests: string[];
  online: boolean;
  verified: boolean;
  premium?: boolean;
}

interface ModernDiscoveryProps {
  onNavigate?: (screen: string) => void;
}

export const ModernDiscovery: React.FC<ModernDiscoveryProps> = ({ onNavigate = () => {} }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');

  const profiles: Profile[] = [
    {
      id: '1',
      name: 'Sofia',
      age: 28,
      location: 'New York, NY',
      occupation: 'Marketing Manager',
      education: 'Columbia University',
      images: [
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      bio: 'Love exploring new places, trying different cuisines, and meeting interesting people. Looking for someone to share adventures with!',
      interests: ['Travel', 'Photography', 'Cooking', 'Yoga'],
      online: true,
      verified: true,
      premium: true
    },
    {
      id: '2',
      name: 'Emma',
      age: 25,
      location: 'Los Angeles, CA',
      occupation: 'Graphic Designer',
      education: 'Art Center College',
      images: [
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      bio: 'Creative soul with a passion for art and design. Love hiking, coffee shops, and deep conversations under the stars.',
      interests: ['Art', 'Hiking', 'Coffee', 'Music'],
      online: false,
      verified: true
    },
    {
      id: '3',
      name: 'Jessica',
      age: 27,
      location: 'Chicago, IL',
      occupation: 'Software Engineer',
      education: 'Northwestern University',
      images: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      bio: 'Tech enthusiast who loves solving problems and building cool things. When not coding, you can find me at the gym or trying new restaurants.',
      interests: ['Technology', 'Fitness', 'Food', 'Travel'],
      online: true,
      verified: false
    }
  ];

  const currentProfile = profiles[currentProfileIndex];

  const handleLike = (profileId: string) => {
    if (creditManager.canAfford('current-user', 1) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', 1, `Liked ${currentProfile.name}`);
        if (success) {
          setUserBalance(creditManager.getBalance('current-user'));
        }
      }
      
      sendLikeNotification(profileId, {
        id: 'current-user',
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      nextProfile();
    } else {
      alert(`Need ${formatCredits(1)} to like profiles!`);
    }
  };

  const handlePass = (profileId: string) => {
    console.log('Passed profile:', profileId);
    nextProfile();
  };

  const handleSuperLike = (profileId: string) => {
    if (creditManager.canAfford('current-user', 5) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', 5, `Super liked ${currentProfile.name}`);
        if (success) {
          setUserBalance(creditManager.getBalance('current-user'));
        }
      }
      
      sendLikeNotification(profileId, {
        id: 'current-user',
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      nextProfile();
    } else {
      alert(`Need ${formatCredits(5)} to super like profiles!`);
    }
  };

  const handleSendMessage = (profileId: string, message: string) => {
    if (creditManager.canAfford('current-user', 5) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', 5, `Message to ${currentProfile.name}`);
        if (success) {
          setUserBalance(creditManager.getBalance('current-user'));
        }
      }
      
      sendMessageNotification(profileId, {
        id: 'current-user',
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      
      alert(`Message sent to ${currentProfile.name}: "${message}"`);
    } else {
      alert(`Need ${formatCredits(5)} to send messages!`);
    }
  };

  const handleBlink = (profileId: string) => {
    if (creditManager.canAfford('current-user', 1) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', 1, `Blink to ${currentProfile.name}`);
        if (success) {
          setUserBalance(creditManager.getBalance('current-user'));
        }
      }
      
      sendWinkNotification(profileId, {
        id: 'current-user',
        name: 'You',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      
      alert(`Blink sent to ${currentProfile.name}!`);
    } else {
      alert(`Need ${formatCredits(1)} to send blinks!`);
    }
  };

  const handleReport = (profileId: string) => {
    console.log('Reported profile:', profileId);
    alert(`Profile reported: ${currentProfile.name}`);
    nextProfile();
  };

  const handleBlock = (profileId: string) => {
    console.log('Blocked profile:', profileId);
    alert(`Profile blocked: ${currentProfile.name}`);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
          <p>Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <ModernHeader
          title="Dates"
          showMenu={false}
          showSearch={true}
          showNotifications={true}
          onSearch={() => {}}
          onNotifications={() => {}}
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <ModernHeader
          title="Discovery"
          showBack={false}
          showMenu={false}
          showSearch={true}
          showNotifications={true}
          onSearch={() => {}}
          onNotifications={() => {}}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {/* Balance Display */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white text-center">
              <p className="text-sm opacity-90">Your Balance</p>
              <p className="text-xl font-bold">{formatCredits(userBalance)}</p>
            </div>

            {/* Swipe Card */}
            <div className="flex justify-center">
              <SwipeCard
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
                onSendMessage={handleSendMessage}
                onBlink={handleBlink}
                onReport={handleReport}
                onBlock={handleBlock}
                className="w-full max-w-sm"
              />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="p-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-white">Discover</h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Balance: {formatCredits(userBalance)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('swipe')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'swipe' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'
                  }`}
                >
                  Swipe Mode
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'
                  }`}
                >
                  Grid View
                </button>
              </div>
            </div>

            {viewMode === 'swipe' ? (
              /* Swipe Mode for Desktop */
              <div className="flex justify-center">
                <SwipeCard
                  profile={currentProfile}
                  onLike={handleLike}
                  onPass={handlePass}
                  onSuperLike={handleSuperLike}
                  onSendMessage={handleSendMessage}
                  onBlink={handleBlink}
                  onReport={handleReport}
                  onBlock={handleBlock}
                  className="w-full max-w-md"
                />
              </div>
            ) : (
              /* Grid Mode for Desktop */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <div key={profile.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="relative">
                      <img
                        src={profile.images[0]}
                        alt={profile.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
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
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Premium
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{profile.name}, {profile.age}</h3>
                        <div className="flex items-center mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          <span className="text-sm">{profile.occupation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-white/90 text-sm mb-3 line-clamp-2">{profile.bio}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {profile.interests.slice(0, 3).map((interest, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {profile.interests.length > 3 && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                            +{profile.interests.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handlePass(profile.id)}
                          className="w-10 h-10 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleLike(profile.id)}
                          className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleSuperLike(profile.id)}
                          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Star className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};