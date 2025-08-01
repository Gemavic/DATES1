import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Brain, Shield, Phone, Video, Calendar } from 'lucide-react';

interface CounsellingProps {
  onNavigate: (screen: string) => void;
}

export const Counselling: React.FC<CounsellingProps> = ({ onNavigate }) => {
  const counsellingTypes = [
    {
      icon: Heart,
      title: 'Dating Anxiety',
      description: 'Overcome dating fears and build confidence',
      color: 'from-pink-500 to-rose-500',
      sessions: '8-12 sessions'
    },
    {
      icon: Brain,
      title: 'Self-Esteem',
      description: 'Build confidence and self-worth',
      color: 'from-blue-500 to-cyan-500',
      sessions: '6-10 sessions'
    },
    {
      icon: MessageCircle,
      title: 'Communication',
      description: 'Improve social and dating communication',
      color: 'from-green-500 to-teal-500',
      sessions: '4-8 sessions'
    },
    {
      icon: Shield,
      title: 'Past Trauma',
      description: 'Heal from past relationship trauma',
      color: 'from-purple-500 to-indigo-500',
      sessions: '12-16 sessions'
    }
  ];

  const counsellors = [
    {
      id: '1',
      name: 'Dr. Lisa Thompson',
      specialization: 'Dating & Relationship Coach',
      experience: '8 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$80/session',
      nextAvailable: 'Today 3:00 PM'
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      specialization: 'Anxiety & Confidence Coach',
      experience: '10 years',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$75/session',
      nextAvailable: 'Tomorrow 10:00 AM'
    }
  ];

  const sessionModes = [
    { icon: Video, name: 'Video Call', description: 'Face-to-face sessions' },
    { icon: Phone, name: 'Voice Call', description: 'Audio-only sessions' },
    { icon: MessageCircle, name: 'Text Chat', description: 'Written conversations' }
  ];

  return (
    <Layout
      title="Personal Counselling"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Counselling" 
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Personal Counselling</h2>
          <p className="text-white/80">Professional support for your dating journey</p>
        </div>

        {/* Counselling Types */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Areas We Help With</h3>
          <div className="space-y-4">
            {counsellingTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{type.title}</h4>
                      <p className="text-white/70 text-sm mb-2">{type.description}</p>
                      <p className="text-white/60 text-xs">{type.sessions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Modes */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Session Options</h3>
          <div className="grid grid-cols-3 gap-3">
            {sessionModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center"
                >
                  <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <h4 className="text-white font-medium text-sm mb-1">{mode.name}</h4>
                  <p className="text-white/70 text-xs">{mode.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Counsellors */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Available Counsellors</h3>
          <div className="space-y-4">
            {counsellors.map((counsellor) => (
              <div
                key={counsellor.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={counsellor.image}
                    alt={counsellor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{counsellor.name}</h4>
                    <p className="text-white/80 text-sm mb-1">{counsellor.specialization}</p>
                    <p className="text-white/70 text-xs mb-2">{counsellor.experience} experience</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium text-sm">{counsellor.price}</span>
                      <span className="text-green-400 text-xs">Next: {counsellor.nextAvailable}</span>
                    </div>
                    <Button
                      onClick={() => {
                        const successMessage = document.createElement('div');
                        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        successMessage.textContent = `📅 Session booked with ${counsellor.name}!`;
                        document.body.appendChild(successMessage);
                        setTimeout(() => document.body.removeChild(successMessage), 3000);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm hover:scale-105 transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4">
          <div className="text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Need Immediate Support?</h3>
            <p className="text-white/90 text-sm mb-4">
              If you're experiencing a crisis, we're here to help 24/7
            </p>
            <Button className="bg-white text-red-500 font-semibold px-6 py-2 hover:scale-105 transition-all duration-300">
              Emergency Support
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};