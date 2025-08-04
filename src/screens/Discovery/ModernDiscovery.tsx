import React, { useState } from 'react';
import { Heart, X, MessageCircle, Star, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { SwipeCard } from '@/components/SwipeCard';
import { creditManager, formatCredits } from '@/lib/creditSystem';
import { sendLikeNotification, sendMessageNotification, sendProfileViewNotification, sendWinkNotification } from '@/lib/emailNotifications';

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
  distance: number;
}

export const ModernDiscovery: React.FC = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));

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
      distance: 2.5
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
      verified: true,
      distance: 5.2
    }
  ];

  const currentProfile = profiles[currentProfileIndex];

  const handleLike = () => {
    if (creditManager.canAfford('current-user', 1)) {
      const success = creditManager.spendCredits('current-user', 1, `Liked ${currentProfile.name}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        sendLikeNotification(currentProfile.id, {
          id: 'current-user',
          name: 'You',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
        });
        nextProfile();
      }
    } else {
      alert(`Need ${formatCredits(1)} to like profiles!`);
    }
  };

  const handlePass = () => {
    nextProfile();
  };

  const handleSendMessage = () => {
    if (creditManager.canAfford('current-user', 5)) {
      const success = creditManager.spendCredits('current-user', 5, `Message to ${currentProfile.name}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        sendMessageNotification(currentProfile.id, {
          id: 'current-user',
          name: 'You',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
        });
        alert(`Message sent to ${currentProfile.name}!`);
      }
    } else {
      alert(`Need ${formatCredits(5)} to send messages!`);
    }
  };

  const handleBlink = () => {
    if (creditManager.canAfford('current-user', 1)) {
      const success = creditManager.spendCredits('current-user', 1, `Blink to ${currentProfile.name}`);
      if (success) {
        setUserBalance(creditManager.getBalance('current-user'));
        sendWinkNotification(currentProfile.id, {
          id: 'current-user',
          name: 'You',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
        });
        alert(`Blink sent to ${currentProfile.name}!`);
      }
    } else {
      alert(`Need ${formatCredits(1)} to send blinks!`);
    }
  };

  const handleReport = () => {
    alert(`Profile reported: ${currentProfile.name}`);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
          <p>Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Balance Display */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 text-white text-center">
          <p className="text-sm opacity-90">Your Balance</p>
          <p className="text-xl font-bold">{formatCredits(userBalance)}</p>
        </div>

        {/* Swipe Card */}
        <SwipeCard
          profile={currentProfile}
          onLike={handleLike}
          onPass={handlePass}
          onSendMessage={handleSendMessage}
          onBlink={handleBlink}
          onReport={handleReport}
        />
      </div>
    </div>
  );
};