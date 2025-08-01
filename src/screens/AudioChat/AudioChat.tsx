import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Users } from 'lucide-react';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface AudioChatProps {
  onNavigate: (screen: string) => void;
}

export const AudioChat: React.FC<AudioChatProps> = ({ onNavigate }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
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
      status: 'busy'
    }
  ];

  const startAudioCall = (matchName: string) => {
    const canAfford = creditManager.canAfford('current-user', 50);
    if (canAfford || creditManager.isStaffMember('current-user')) {
      setIsInCall(true);
      setCallDuration(0);
      // Start timer for credit deduction
      const timer = setInterval(() => {
        setCallDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration % 60 === 0) { // Every minute
            const success = creditManager.spendCredits('current-user', 50, `Audio call minute ${newDuration / 60}`);
            if (success) {
              setUserBalance(creditManager.getTotalCredits('current-user'));
            } else if (!creditManager.isStaffMember('current-user')) {
              endCall();
              alert('Insufficient credits for audio call!');
            }
          }
          return newDuration;
        });
      }, 1000);
      (window as any).callTimer = timer;
    } else {
      alert(`Need ${formatCredits(50)} per minute for audio calls!`);
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
        title="Voice Call"
        onBack={endCall}
        showClose={false}
      >
        <div className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 relative flex flex-col items-center justify-center">
          {/* Call Info */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30">
              <img
                src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Emma"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Emma</h2>
            <p className="text-white/80 text-lg">{Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}</p>
            <p className="text-white/60 text-sm mt-2">Voice call in progress...</p>
            <p className="text-white/60 text-sm mt-1">{formatCredits(userBalance)} remaining</p>
            <p className="text-white/60 text-sm mt-1">{formatCredits(userBalance)} remaining</p>
          </div>

          {/* Audio Visualizer */}
          <div className="flex items-center space-x-2 mb-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/60 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeakerOn ? 'bg-white/30' : 'bg-white/10'
              }`}
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isMicOn ? 'bg-white/10' : 'bg-red-500'
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
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Audio Chat"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Audio Chat" 
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Audio Chat</h2>
          <p className="text-white/80">Have intimate voice conversations</p>
        </div>

        {/* Online Matches */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Available for Voice Chat</h3>
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
                        match.status === 'online' ? 'bg-green-500' : 
                        match.status === 'busy' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{match.name}</h4>
                      <p className="text-white/70 text-sm capitalize">{match.status}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startAudioCall(match.name)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 hover:scale-105 transition-all duration-300"
                    disabled={match.status !== 'online'}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-4">Voice Chat Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Crystal Clear Audio</p>
                <p className="text-white/70 text-sm">High-quality voice calls</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Private & Secure</p>
                <p className="text-white/70 text-sm">End-to-end encrypted calls</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};