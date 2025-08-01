import React from 'react';
import { Layout } from '@/components/Layout';
import { MessageCircle, Heart } from 'lucide-react';

interface MatchesProps {
  onNavigate: (screen: string) => void;
}

export const Matches: React.FC<MatchesProps> = ({ onNavigate }) => {
  const matches = [
    {
      id: '1',
      name: 'Emma',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Hey! How was your weekend?',
      time: '2m ago',
      unread: true
    },
    {
      id: '2',
      name: 'Sarah',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'That restaurant looks amazing!',
      time: '1h ago',
      unread: false
    },
    {
      id: '3',
      name: 'Jessica',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Thanks for the coffee recommendation ☕',
      time: '3h ago',
      unread: true
    }
  ];

  return (
    <Layout
      title="Matches"
      onBack={() => onNavigate('discovery')}
      showClose={false}
      showFooter={true}
      activeTab="matches"
      onNavigate={onNavigate}
    >
      <>
      <div className="px-4 py-6">
        {/* Header Image */}
        <div className="mb-6">
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Matches Header" 
            className="w-full h-24 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* New Matches Section */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">New Matches</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className="flex-shrink-0 text-center">
                <div className="relative">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-white/30"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#f55b03] rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                </div>
                <p className="text-white text-sm mt-2 font-medium">{match.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Section */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Messages</h2>
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={match.image}
                      alt={match.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-medium truncate">{match.name}</h3>
                      <span className="text-white/60 text-xs">{match.time}</span>
                    </div>
                    <p className={`text-sm truncate ${match.unread ? 'text-white' : 'text-white/70'}`}>
                      {match.lastMessage}
                    </p>
                  </div>
                  
                  <MessageCircle className="w-5 h-5 text-white/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No matches yet</h3>
            <p className="text-white/70">
              Keep swiping to find your perfect match!
            </p>
          </div>
        )}
      </div>
      </>
    </Layout>
  );
};