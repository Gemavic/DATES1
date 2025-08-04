import React, { useState } from 'react';
import { ProfileCard } from '@/components/ProfileCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiscoveryProps {
  onNavigate: (screen: any) => void;
}

export const Discovery: React.FC<DiscoveryProps> = ({ onNavigate }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'following'>('online');

  const profiles = [
    {
      id: '1',
      name: 'Tetiana',
      age: 29,
      location: 'New York, NY',
      occupation: 'Graphic Designer',
      education: 'NYU',
      images: ['https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'],
      bio: 'Love exploring new coffee shops and weekend hiking adventures. Looking for someone who shares my passion for creativity and outdoor activities.',
      interests: ['Coffee', 'Hiking', 'Design', 'Photography', 'Travel'],
      photoCount: 37,
      online: true
    },
    {
      id: '2',
      name: 'Claudia',
      age: 27,
      location: 'San Francisco, CA',
      occupation: 'Software Engineer',
      education: 'Stanford',
      images: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'],
      bio: 'Tech enthusiast by day, chef by night. Always up for trying new restaurants or cooking something delicious at home.',
      interests: ['Cooking', 'Technology', 'Music', 'Travel', 'Fitness'],
      photoCount: 12,
      online: true
    },
    {
      id: '3',
      name: 'Mi Khan',
      age: 29,
      location: 'Los Angeles, CA',
      occupation: 'Marketing Manager',
      education: 'UCLA',
      images: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'],
      bio: 'Beach lover and yoga enthusiast. Seeking genuine connections and meaningful conversations over sunset walks.',
      interests: ['Yoga', 'Beach', 'Reading', 'Movies', 'Wellness'],
      photoCount: 13,
      online: true
    },
    {
      id: '4',
      name: 'Anastasiia',
      age: 31,
      location: 'Miami, FL',
      occupation: 'Fashion Designer',
      education: 'FIT',
      images: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'],
      bio: 'Fashion designer with a passion for art and culture. Love traveling and discovering new places.',
      interests: ['Fashion', 'Art', 'Travel', 'Culture', 'Photography'],
      photoCount: 30,
      online: true
    }
  ];

  const handleLike = (profileId: string) => {
    console.log('Liked:', profileId);
    nextProfile();
  };

  const handlePass = (profileId: string) => {
    console.log('Passed:', profileId);
    nextProfile();
  };

  const handleSuperLike = (profileId: string) => {
    console.log('Super liked:', profileId);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-md mx-auto">
        {/* Header with BestDates branding */}
        <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Dates</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-lg">👤</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profiles Header */}
        <div className="px-4 py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profiles</h2>
          
          {/* Tabs */}
          <div className="flex space-x-6 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'all' 
                  ? 'border-orange-500 text-gray-900' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'online' 
                  ? 'border-orange-500 text-orange-500' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'following' 
                  ? 'border-orange-500 text-gray-900' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              Following
            </button>
            <div className="flex-1"></div>
            <button className="flex items-center space-x-1 text-orange-500">
              <span>Filters</span>
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative">
                  <img
                    src={profile.images[0]}
                    alt={profile.name}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">♡</span>
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                    <span className="text-white text-xs">📷</span>
                    <span className="text-white text-xs font-medium">{profile.photoCount}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{profile.name}, {profile.age}</h3>
                    {profile.online && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <Button
                    onClick={() => onNavigate('profile')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl cursor-pointer touch-manipulation active:scale-95"
                    type="button"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <Footer
          activeTab="discovery"
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};