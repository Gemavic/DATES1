import React from 'react';
import { Layout } from '@/components/Layout';
import { Camera, Edit, Heart, MapPin, Briefcase, GraduationCap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVerificationStatus } from '@/lib/verification';

interface ProfileProps {
  onNavigate: (screen: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const verificationStatus = getVerificationStatus('current-user');
  
  const userProfile = {
    name: 'You',
    age: 25,
    location: 'New York, NY',
    occupation: 'Software Developer',
    education: 'NYU',
    images: ['https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'],
    bio: 'Love exploring new coffee shops and weekend hiking adventures. Looking for someone who shares my passion for creativity and outdoor activities.',
    interests: ['Coffee', 'Hiking', 'Design', 'Photography', 'Travel']
  };

  return (
    <Layout
      title="Profile"
      onBack={() => onNavigate('discovery')}
      showClose={false}
      showFooter={true}
      activeTab="profile"
      onNavigate={onNavigate}
    >
      <div className="px-4 py-6">
        {/* Cover Photo */}
        <div className="mb-6">
          <img 
            src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Profile Cover" 
            className="w-full h-32 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img
                src={userProfile.images[0]}
                alt={userProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {userProfile.name}, {userProfile.age}
                {verificationStatus.isVerified && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                    ✓ Verified
                  </span>
                )}
              </h2>
              <div className="flex items-center text-white/80 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{userProfile.location}</span>
              </div>
              <Button
                onClick={() => onNavigate('edit-profile')}
                className="bg-white/20 text-white hover:bg-white/30 text-sm px-4 py-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {/* About */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">About Me</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              {userProfile.bio}
            </p>
            
            {/* Work & Education */}
            <div className="space-y-2">
              <div className="flex items-center text-white/80">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="text-sm">{userProfile.occupation}</span>
              </div>
              <div className="flex items-center text-white/80">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="text-sm">{userProfile.education}</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white text-sm rounded-full border border-white/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">Your Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24</div>
                <div className="text-white/70 text-xs">Likes Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-white/70 text-xs">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">8</div>
                <div className="text-white/70 text-xs">Conversations</div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">Account Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Verification Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  verificationStatus.isVerified 
                    ? 'bg-green-500 text-white' 
                    : verificationStatus.status === 'submitted' 
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {verificationStatus.isVerified ? 'Verified' : 
                   verificationStatus.status === 'submitted' ? 'Under Review' :
                   verificationStatus.status === 'rejected' ? 'Rejected' : 'Not Started'}
                </span>
              </div>
              
              {!verificationStatus.isVerified && (
                <Button
                  onClick={() => onNavigate('verification')}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  {verificationStatus.status === 'not_started' ? 'Start Verification' : 'Continue Verification'}
                </Button>
              )}
              
              {verificationStatus.isVerified && (
                <div className="text-green-400 text-sm">
                  ✅ Your account is verified and trusted
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center justify-between text-white hover:text-white/80 transition-colors"
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings & Preferences</span>
              </div>
              <div className="text-white/60">→</div>
            </button>
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex justify-center space-x-4 text-xs">
                <button 
                  onClick={() => onNavigate('terms')}
                  className="text-white/70 hover:text-white underline"
                >
                  Terms
                </button>
                <button 
                  onClick={() => onNavigate('privacy')}
                  className="text-white/70 hover:text-white underline"
                >
                  Privacy
                </button>
                <button 
                  onClick={() => onNavigate('disclaimer')}
                  className="text-white/70 hover:text-white underline"
                >
                  Disclaimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};