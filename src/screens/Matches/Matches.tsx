import React from 'react';
import { Layout } from '@/components/Layout';
import { MessageCircle, Heart, Mail as MailIcon, User, Users, Newspaper } from 'lucide-react';
import { sendMessageNotification } from '@/lib/emailNotifications';
import { MessageChatBox } from '@/components/MessageChatBox';

interface MatchesProps {
  onNavigate: (screen: string) => void;
}

export const Matches: React.FC<MatchesProps> = ({ onNavigate }) => {
  // Updated matches to reflect La-Date style messaging
  const matches = [
    {
      id: '1',
      name: 'Gabriela',
      age: 23,
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'I believe in love that is nourished by everyday moments... 💕',
      time: '12:37 pm',
      unread: true,
      isNew: true
    },
    {
      id: '2',
      name: 'Astrid',
      age: 45,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'The city\'s asleep. I\'m not. And you should know... 🌙',
      time: '11:46 am',
      unread: true,
      isNew: true
    },
    {
      id: '3',
      name: 'Jessica',
      age: 34,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'I\'m glad to meet you. I am a woman discovering... ✨',
      time: '11:11 am',
      unread: true,
      isNew: true
    },
    {
      id: '4',
      name: 'Aline Claudia',
      age: 44,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: '🍓🍓 Sometimes after a hard day alone...',
      time: '10:59 am',
      unread: true,
      isNew: true
    },
    {
      id: '5',
      name: 'Yasmin',
      age: 29,
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Imagine how cosy it is to sit at home... 🏠',
      time: '10:57 am',
      unread: true,
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Dates</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button 
                  onClick={() => onNavigate('mail')}
                  className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <MailIcon className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <button 
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          </div>
          
          <div className="space-y-0">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() => {
                  sendMessageNotification(match.id, {
                    name: 'You',
                    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
                    id: 'current-user'
                  });
                }}
                className="border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={match.image}
                      alt={match.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-medium truncate ${match.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {match.name}, {match.age}
                        </h4>
                        {match.isNew && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            new
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{match.time}</span>
                    </div>
                    <p className={`text-sm truncate ${match.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {match.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around py-2">
            {[
              { id: 'search', icon: Users, label: 'Search', count: 0, color: 'text-gray-600' },
              { id: 'messages', icon: MessageCircle, label: 'Messages', count: 76, color: 'text-orange-500' },
              { id: 'mail', icon: MailIcon, label: 'Mail', count: 29, color: 'text-gray-600' },
              { id: 'newsfeed', icon: Newspaper, label: 'Newsfeed', count: 0, color: 'text-gray-600' },
              { id: 'people', icon: User, label: 'People', count: 0, color: 'text-gray-600' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === 'messages';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'mail') {
                      onNavigate('mail');
                    } else if (tab.id === 'newsfeed') {
                      onNavigate('newsfeed');
                    } else if (tab.id === 'people') {
                      onNavigate('discovery');
                    } else if (tab.id === 'search') {
                      onNavigate('discovery');
                    }
                  }}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 relative ${
                    isActive 
                      ? tab.color
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {tab.count > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{tab.count}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1">{tab.label}</span>
                </button>
              );
            })}
            
            {/* Message Chat Box in Footer */}
            <div className="flex flex-col items-center py-2 px-3">
              <MessageChatBox />
              <span className="text-xs font-medium text-gray-600 mt-1">Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};