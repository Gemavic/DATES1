import React from 'react';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Brain, Shield, Phone, Video, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { CalendarScheduling } from '@/components/CalendarScheduling';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface CounsellingProps {
  onNavigate: (screen: string) => void;
}

export const Counselling: React.FC<CounsellingProps> = ({ onNavigate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));

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

  const therapists = [
    {
      id: '1',
      name: 'Dr. Lisa Thompson', 
      title: 'PhD, Licensed Therapist',
      specialization: 'Dating & Relationship Counseling',
      experience: '8 years experience',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 120,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      sessionTypes: ['video', 'audio', 'text'] as ('video' | 'audio' | 'text')[]
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      title: 'PsyD, Clinical Psychologist', 
      specialization: 'Anxiety & Confidence Counseling',
      experience: '10 years experience',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 100,
      availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
      sessionTypes: ['video', 'audio'] as ('video' | 'audio' | 'text')[]
    },
    {
      id: '3',
      name: 'Dr. Emma Rodriguez',
      title: 'LMFT, Marriage Therapist',
      specialization: 'Individual & Couples Therapy',
      experience: '12 years experience',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 110,
      availableDays: ['tuesday', 'thursday', 'friday', 'saturday', 'sunday'],
      sessionTypes: ['video', 'audio', 'text'] as ('video' | 'audio' | 'text')[]
    }
  ];

  const handleBookSession = (therapistId: string, date: string, time: string, duration: number, type: 'video' | 'audio' | 'text') => {
    const therapist = therapists.find(t => t.id === therapistId);
    const cost = Math.round((therapist!.hourlyRate * duration / 60) * 100) / 100;
    
    // Check if user can afford the session
    const creditsNeeded = Math.ceil(cost); // Convert to credits
    
    if (creditManager.canAfford('current-user', creditsNeeded) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', creditsNeeded, `Counselling session with ${therapist!.name}`);
        if (success) {
          setUserBalance(creditManager.getBalance('current-user'));
        }
      }
      
      const newBooking = {
        id: Math.random().toString(36).substring(2),
        therapistId,
        therapistName: therapist!.name,
        date,
        time,
        duration,
        type,
        cost,
        status: 'confirmed'
      };
      
      setBookedSessions(prev => [...prev, newBooking]);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-bold">Session Booked!</div>
            <div class="text-sm">${therapist!.name} • ${date} at ${time}</div>
          </div>
        </div>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 5000);
      
    } else {
      alert(`Need ${formatCredits(creditsNeeded)} to book this session!`);
    }
  };

  return (
    <Layout
      title="Personal Counselling"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Personal Counselling</h2>
          <p className="text-white/80">Professional support for your dating journey</p>
        </div>

        {/* Credits Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Credits</p>
              <p className="text-2xl font-bold text-white">{formatCredits(userBalance)}</p>
            </div>
            <Button
              onClick={() => onNavigate('credits')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2"
            >
              Buy More
            </Button>
          </div>
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

        {/* Booked Sessions */}
        {bookedSessions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Your Upcoming Sessions</h3>
            <div className="space-y-3">
              {bookedSessions.map((session) => (
                <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{session.therapistName}</h4>
                      <p className="text-white/70 text-sm">{session.date} at {session.time}</p>
                      <p className="text-white/60 text-xs">{session.duration} min • {session.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${session.cost}</p>
                      <span className="text-green-400 text-xs">Confirmed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Scheduling */}
        {showCalendar ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Schedule Your Session</h3>
              <Button
                onClick={() => setShowCalendar(false)}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                Close Calendar
              </Button>
            </div>
            <CalendarScheduling
              therapists={therapists}
              onBookSession={handleBookSession}
              serviceType="counselling"
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Our Counsellors</h3>
              <Button
                onClick={() => setShowCalendar(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>
            
            <div className="space-y-4">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{therapist.name}</h4>
                          <p className="text-white/60 text-xs">{therapist.title}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-white/30'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-white/70 text-xs">({therapist.rating})</span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-2">{therapist.specialization}</p>
                      <p className="text-white/70 text-xs mb-3">{therapist.experience}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium text-sm">${therapist.hourlyRate}/hour</span>
                          <span className="text-white/60 text-xs">•</span>
                          <div className="flex space-x-1">
                            {therapist.sessionTypes.map((type, i) => {
                              const Icon = type === 'video' ? Video : type === 'audio' ? Phone : MessageCircle;
                              return (
                                <Icon key={i} className="w-3 h-3 text-white/60" />
                              );
                            })}
                          </div>
                        </div>
                        <span className="text-green-400 text-xs">Available</span>
                      </div>
                      
                      <Button
                        onClick={() => setShowCalendar(true)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm hover:scale-105 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95"
                        type="button"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        View Availability
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4">
          <div className="text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Need Immediate Support?</h3>
            <p className="text-white/90 text-sm mb-4">
              If you're experiencing a crisis, we're here to help 24/7
            </p>
            <Button 
              onClick={() => window.open('tel:+14244887950')}
              className="bg-white text-red-500 font-semibold px-6 py-2 hover:scale-105 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95"
              type="button"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency Support
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};