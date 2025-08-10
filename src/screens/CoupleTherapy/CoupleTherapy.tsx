import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Users, Heart, MessageCircle, Calendar, Star, Shield, Phone, Video, Clock, CheckCircle } from 'lucide-react';
import { CalendarScheduling } from '@/components/CalendarScheduling';
import { creditManager, formatCredits } from '@/lib/creditSystem';

interface CoupleTherapyProps {
  onNavigate: (screen: string) => void;
}

export const CoupleTherapy: React.FC<CoupleTherapyProps> = ({ onNavigate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(creditManager.getBalance('current-user'));

  const therapists = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'PhD, Licensed Marriage Therapist',
      specialization: 'Couples & Relationship Therapy',
      experience: '15 years experience',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 150,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      sessionTypes: ['video', 'audio'] as ('video' | 'audio' | 'text')[]
    },
    {
      id: '2',
      name: 'Dr. Michael Chen', 
      title: 'LMFT, Certified Couples Therapist',
      specialization: 'Marriage & Family Therapy',
      experience: '12 years experience',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 130,
      availableDays: ['monday', 'wednesday', 'friday', 'saturday', 'sunday'],
      sessionTypes: ['video', 'audio', 'text'] as ('video' | 'audio' | 'text')[]
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'PsyD, Relationship Specialist', 
      specialization: 'Communication & Conflict Resolution',
      experience: '10 years experience',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 140,
      availableDays: ['tuesday', 'thursday', 'friday', 'saturday'],
      sessionTypes: ['video', 'audio'] as ('video' | 'audio' | 'text')[]
    }
  ];

  const services = [
    {
      icon: Heart,
      title: 'Relationship Building',
      description: 'Strengthen your bond and connection',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MessageCircle,
      title: 'Communication Skills',
      description: 'Learn effective communication techniques',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Conflict Resolution',
      description: 'Resolve conflicts in a healthy way',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Trust Building',
      description: 'Rebuild and strengthen trust',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const handleBookSession = (therapistId: string, date: string, time: string, duration: number, type: 'video' | 'audio' | 'text') => {
    const therapist = therapists.find(t => t.id === therapistId);
    const cost = Math.round((therapist!.hourlyRate * duration / 60) * 100) / 100;
    
    // Check if user can afford the session (couple therapy costs more)
    const creditsNeeded = Math.ceil(cost * 1.2); // 20% markup for couple sessions
    
    if (creditManager.canAfford('current-user', creditsNeeded) || creditManager.isStaffMember('current-user')) {
      if (!creditManager.isStaffMember('current-user')) {
        const success = creditManager.spendCredits('current-user', creditsNeeded, `Couple therapy session with ${therapist!.name}`);
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
        cost: cost * 1.2, // Couple therapy premium
        status: 'confirmed',
        isCouple: true
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
            <div class="font-bold">Couple Therapy Booked!</div>
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
      alert(`Need ${formatCredits(creditsNeeded)} to book this couple therapy session!`);
    }
  };

  return (
    <Layout
      title="Couple Therapy"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Couple Therapy</h2>
          <p className="text-white/80">Professional guidance for stronger relationships</p>
        </div>

        {/* Credits Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Credits</p>
              <p className="text-2xl font-bold text-white">{formatCredits(userBalance)}</p>
            </div>
            <div className="text-right">
              <Button
                onClick={() => onNavigate('credits')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2"
              >
                Buy More
              </Button>
              <p className="text-white/60 text-xs mt-1">Couple sessions: +20% cost</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Our Services</h3>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-2">{service.title}</h4>
                  <p className="text-white/70 text-xs">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booked Sessions */}
        {bookedSessions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Your Upcoming Couple Sessions</h3>
            <div className="space-y-3">
              {bookedSessions.map((session) => (
                <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{session.therapistName}</h4>
                        <p className="text-white/70 text-sm">{session.date} at {session.time}</p>
                        <p className="text-white/60 text-xs">{session.duration} min • {session.type} • Couple Session</p>
                      </div>
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
              <h3 className="text-white font-semibold text-lg">Schedule Couple Therapy</h3>
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
              serviceType="couple-therapy"
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Our Couple Therapists</h3>
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
                          <span className="text-pink-400 text-xs">(+20% for couples)</span>
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
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:scale-105 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95"
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
        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium text-sm">Choose a Therapist</p>
                <p className="text-white/70 text-xs">Select from our certified professionals</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium text-sm">Book Your Session</p>
                <p className="text-white/70 text-xs">Schedule at your convenience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium text-sm">Start Your Journey</p>
                <p className="text-white/70 text-xs">Begin building a stronger relationship</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Calendar Scheduling */}
        {showCalendar ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Schedule Couple Therapy</h3>
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
              serviceType="couple-therapy"
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Our Couple Therapists</h3>
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
                          <span className="text-pink-400 text-xs">(+20% for couples)</span>
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
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:scale-105 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95"
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
        
        {/* Couple Therapy Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Why Choose Couple Therapy?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Strengthen Your Bond</p>
                <p className="text-white/70 text-sm">Deepen emotional connection and intimacy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Improve Communication</p>
                <p className="text-white/70 text-sm">Learn healthy ways to express feelings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Resolve Conflicts</p>
                <p className="text-white/70 text-sm">Navigate disagreements constructively</p>
              </div>
            </div>
          </div>
        </div>

    </Layout>
  );
};