import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Users, Heart, MessageCircle, Calendar, Star, Shield } from 'lucide-react';

interface CoupleTherapyProps {
  onNavigate: (screen: string) => void;
}

export const CoupleTherapy: React.FC<CoupleTherapyProps> = ({ onNavigate }) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const availableDates = [
    '2025-01-15',
    '2025-01-16', 
    '2025-01-17',
    '2025-01-18',
    '2025-01-19',
    '2025-01-22',
    '2025-01-23'
  ];

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  const therapists = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Relationship Counseling',
      experience: '15 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$120/session',
      availability: 'Available today'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Marriage Therapy',
      experience: '12 years',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$100/session',
      availability: 'Available tomorrow'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Communication Skills',
      experience: '10 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$110/session',
      availability: 'Available this week'
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

  const bookSession = (therapistName: string) => {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = `📅 Session booked with ${therapistName}!`;
    document.body.appendChild(successMessage);
    setTimeout(() => document.body.removeChild(successMessage), 3000);
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
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Couple Therapy" 
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Couple Therapy</h2>
          <p className="text-white/80">Professional guidance for stronger relationships</p>
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

        {/* Available Therapists */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Available Therapists</h3>
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
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{therapist.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <span className="text-white text-sm">{therapist.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-1">{therapist.specialization}</p>
                    <p className="text-white/70 text-xs mb-2">{therapist.experience} experience • {therapist.rating}⭐</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium text-sm">{therapist.price}</span>
                      <span className="text-green-400 text-xs">{therapist.availability}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        bookSession(therapist.name);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:scale-105 transition-all duration-300"
                      type="button"
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

      {/* Booking Calendar Modal */}
      {showBookingCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Session</h3>
              <button
                onClick={() => setShowBookingCalendar(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            {/* Therapist Info */}
            {selectedTherapist && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={therapists.find(t => t.id === selectedTherapist)?.image}
                    alt="Therapist"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {therapists.find(t => t.id === selectedTherapist)?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {therapists.find(t => t.id === selectedTherapist)?.specialization}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Select Date</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedDate === date
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Select Time</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg border-2 transition-colors text-sm ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Booking Summary</h5>
                <p className="text-sm text-green-700">
                  Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-green-700">Time: {selectedTime}</p>
                <p className="text-sm text-green-700">
                  Therapist: {therapists.find(t => t.id === selectedTherapist)?.name}
                </p>
                <p className="text-sm text-green-700">
                  Cost: {therapists.find(t => t.id === selectedTherapist)?.price}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowBookingCalendar(false)}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};