import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, Camera, Users } from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface VideoChatProps {
  onNavigate: (screen: string) => void;
}

export const VideoChat: React.FC<VideoChatProps> = ({ onNavigate }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userBalance, setUserBalance] = useState(creditManager.getTotalCredits('current-user'));

  const activeMatches = [
    {
      id: '1',
      name: 'Emma',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'online'
    },
    {
      id: '2',
      name: 'Sarah',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'online'
    },
    {
      id: '3',
      name: 'Jessica',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'away'
    }
  ];

  const startVideoCall = (matchName: string) => {
    const canAfford = creditManager.canAfford('current-user', 60);
    if (canAfford || creditManager.isStaffMember('current-user')) {
      setIsInCall(true);
      setCallDuration(0);
      // Start timer for credit deduction
      const timer = setInterval(() => {
        setCallDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration % 60 === 0) { // Every minute
            const success = creditManager.spendCredits('current-user', 60, `Video call minute ${newDuration / 60}`);
            if (success) {
              setUserBalance(creditManager.getTotalCredits('current-user'));
            } else if (!creditManager.isStaffMember('current-user')) {
              endCall();
              // Show error message
              const errorMessage = document.createElement('div');
              errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
              errorMessage.textContent = 'Insufficient credits for video call!';
              document.body.appendChild(errorMessage);
              setTimeout(() => document.body.removeChild(errorMessage), 3000);
            }
          }
          return newDuration;
        });
      }, 1000);
      (window as any).callTimer = timer;
    } else {
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = `Need ${formatCredits(60)} per minute for video calls!`;
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    }
  };

  const endCall = () => {
    setIsInCall(false);
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
    }
  };

  if (isInCall) {
    return (
      <Layout
        title="Video Call"
        onBack={endCall}
        showClose={false}
      >
        <div className="h-screen bg-black relative">
          {/* Remote Video */}
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Remote user"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Emma • {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
            </div>
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {formatCredits(userBalance)} remaining
            </div>
          </div>

          {/* Local Video */}
          <div className="absolute top-20 right-4 w-32 h-48 bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20">
            {isVideoOn ? (
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="You"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-white/50" />
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isVideoOn ? 'bg-white/20' : 'bg-red-500'
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isMicOn ? 'bg-white/20' : 'bg-red-500'
                }`}
              >
                {isMicOn ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>

              <button
                onClick={endCall}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
              >
                <Phone className="w-6 h-6 text-white transform rotate-[135deg]" />
              </button>

              <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Video Chat"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Video Chat" 
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Video Chat</h2>
          <p className="text-white/80">Connect face-to-face with your matches</p>
        </div>

        {/* Online Matches */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Available for Video Chat</h3>
          <div className="space-y-3">
            {activeMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={match.image}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        match.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{match.name}</h4>
                      <p className="text-white/70 text-sm capitalize">{match.status}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startVideoCall(match.name)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 hover:scale-105 transition-all duration-300"
                    disabled={match.status !== 'online'}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-4">Video Chat Features</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">HD Video Quality</p>
                <p className="text-white/70 text-sm">Crystal clear video calls</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Safe Environment</p>
                <p className="text-white/70 text-sm">Secure and private calls</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};