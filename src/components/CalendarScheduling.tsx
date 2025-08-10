import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Video, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Star,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  time: string;
  duration: number; // in minutes
  available: boolean;
  therapistId: string;
  type: 'video' | 'audio' | 'text';
  price: number;
}

interface CalendarDay {
  date: Date;
  dateString: string;
  isToday: boolean;
  isWeekend: boolean;
  slots: TimeSlot[];
}

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
  hourlyRate: number;
  availableDays: string[];
  sessionTypes: ('video' | 'audio' | 'text')[];
}

interface CalendarSchedulingProps {
  therapists: Therapist[];
  onBookSession: (therapistId: string, date: string, time: string, duration: number, type: 'video' | 'audio' | 'text') => void;
  serviceType: 'counselling' | 'couple-therapy';
  className?: string;
}

export const CalendarScheduling: React.FC<CalendarSchedulingProps> = ({
  therapists,
  onBookSession,
  serviceType,
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'text'>('video');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Session duration options
  const durationOptions = [
    { minutes: 30, label: '30 min', description: 'Brief consultation' },
    { minutes: 60, label: '1 hour', description: 'Standard session', popular: true },
    { minutes: 90, label: '1.5 hours', description: 'Extended session' },
    { minutes: 120, label: '2 hours', description: 'Intensive session' }
  ];

  // Generate calendar days for the next 14 days
  useEffect(() => {
    const generateCalendarDays = () => {
      const days: CalendarDay[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = i === 0;

        // Generate time slots for this day
        const slots = generateTimeSlots(dateString, isWeekend);

        days.push({
          date,
          dateString,
          isToday,
          isWeekend,
          slots
        });
      }

      setCalendarDays(days);
    };

    generateCalendarDays();
  }, [therapists, selectedDuration]);

  // Generate time slots for a specific day
  const generateTimeSlots = (dateString: string, isWeekend: boolean): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Different hours for weekends
    const startHour = isWeekend ? 10 : 9;
    const endHour = isWeekend ? 17 : 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const timeDisplay = formatTime(hour, minute);

        // Check each therapist's availability
        therapists.forEach(therapist => {
          if (therapist.availableDays.includes(dayOfWeek)) {
            // Simulate availability (in real app, this would be from database)
            const isAvailable = Math.random() > 0.3; // 70% availability
            
            therapist.sessionTypes.forEach(type => {
              slots.push({
                id: `${dateString}-${time}-${therapist.id}-${type}`,
                time: timeDisplay,
                duration: selectedDuration,
                available: isAvailable,
                therapistId: therapist.id,
                type,
                price: calculatePrice(therapist.hourlyRate, selectedDuration)
              });
            });
          }
        });
      }
    }

    return slots;
  };

  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const calculatePrice = (hourlyRate: number, duration: number): number => {
    return Math.round((hourlyRate * duration / 60) * 100) / 100;
  };

  const getAvailableSlots = (date: string) => {
    const day = calendarDays.find(d => d.dateString === date);
    if (!day) return [];

    return day.slots.filter(slot => 
      slot.available && 
      (!selectedTherapist || slot.therapistId === selectedTherapist) &&
      slot.type === selectedType
    );
  };

  const getTotalAvailableSlots = (date: string) => {
    return getAvailableSlots(date).length;
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedSlot && selectedDate) {
      onBookSession(
        selectedSlot.therapistId,
        selectedDate,
        selectedSlot.time,
        selectedSlot.duration,
        selectedSlot.type
      );
      setShowBookingModal(false);
      setSelectedSlot(null);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const getTypeIcon = (type: 'video' | 'audio' | 'text') => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      case 'text': return MessageCircle;
    }
  };

  const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Session Configuration */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Session Preferences</h3>
        
        {/* Therapist Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Select Therapist</label>
          <div className="grid grid-cols-1 gap-3">
            {therapists.map((therapist) => (
              <button
                key={therapist.id}
                onClick={() => setSelectedTherapist(therapist.id)}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300",
                  selectedTherapist === therapist.id
                    ? "border-white bg-white/20 text-white"
                    : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15"
                )}
              >
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <h4 className="font-medium">{therapist.name}</h4>
                  <p className="text-sm opacity-80">{therapist.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-xs">{therapist.rating}</span>
                    </div>
                    <span className="text-xs">•</span>
                    <span className="text-xs">${therapist.hourlyRate}/hour</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Session Duration</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.minutes}
                onClick={() => setSelectedDuration(option.minutes)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-300 text-center",
                  selectedDuration === option.minutes
                    ? "border-white bg-white/20 text-white"
                    : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15",
                  option.popular && "ring-2 ring-yellow-400"
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs opacity-80">{option.description}</p>
                {option.popular && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Session Type Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Session Type</label>
          <div className="grid grid-cols-3 gap-3">
            {['video', 'audio', 'text'].map((type) => {
              const Icon = getTypeIcon(type as any);
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-300 text-center",
                    selectedType === type
                      ? "border-white bg-white/20 text-white"
                      : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15"
                  )}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium capitalize">{type}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Available Appointments</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-900 min-w-[120px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.slice(0, 14).map((day) => {
            const availableSlots = getTotalAvailableSlots(day.dateString);
            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDate(day.dateString)}
                disabled={availableSlots === 0}
                className={cn(
                  "aspect-square p-2 rounded-lg border-2 transition-all duration-300 relative",
                  selectedDate === day.dateString
                    ? "border-blue-500 bg-blue-50"
                    : availableSlots > 0
                    ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50",
                  day.isToday && "ring-2 ring-green-400",
                  day.isWeekend && "bg-gray-50"
                )}
              >
                <div className="text-sm font-medium text-gray-900">
                  {day.date.getDate()}
                </div>
                <div className="text-xs mt-1">
                  {availableSlots > 0 ? (
                    <span className="text-green-600 font-medium">{availableSlots} slots</span>
                  ) : (
                    <span className="text-red-500">Full</span>
                  )}
                </div>
                {day.isToday && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Time Slots */}
        {selectedDate && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">
              Available Times - {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            
            {selectedTherapistData && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedTherapistData.image}
                    alt={selectedTherapistData.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">{selectedTherapistData.name}</h5>
                    <p className="text-sm text-gray-600">{selectedTherapistData.specialization}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium">${calculatePrice(selectedTherapistData.hourlyRate, selectedDuration)}</p>
                    <p className="text-xs text-gray-600">{selectedDuration} min</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getAvailableSlots(selectedDate).map((slot) => {
                const therapist = therapists.find(t => t.id === slot.therapistId);
                const TypeIcon = getTypeIcon(slot.type);
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105",
                      slot.available
                        ? "border-green-200 bg-green-50 hover:bg-green-100"
                        : "border-red-200 bg-red-50 cursor-not-allowed opacity-50"
                    )}
                    disabled={!slot.available}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TypeIcon className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="font-medium text-gray-900 text-sm">{slot.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{therapist?.name}</p>
                      <p className="text-xs font-medium text-green-600">${slot.price}</p>
                      <p className="text-xs text-gray-500">{slot.duration} min</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {getAvailableSlots(selectedDate).length === 0 && (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">No Available Slots</h4>
                <p className="text-gray-600 text-sm">
                  Try selecting a different date, therapist, or session type.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Availability Legend */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
        <h4 className="text-white font-medium mb-3">Availability Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-white">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-white">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-white">Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-white">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Booking</h3>
              <p className="text-gray-600">Review your session details</p>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Session Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Therapist:</span>
                    <span className="font-medium text-blue-900">
                      {therapists.find(t => t.id === selectedSlot.therapistId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Date:</span>
                    <span className="font-medium text-blue-900">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Time:</span>
                    <span className="font-medium text-blue-900">{selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Duration:</span>
                    <span className="font-medium text-blue-900">{selectedSlot.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Type:</span>
                    <div className="flex items-center space-x-1">
                      {React.createElement(getTypeIcon(selectedSlot.type), { className: "w-4 h-4 text-blue-600" })}
                      <span className="font-medium text-blue-900 capitalize">{selectedSlot.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-700 font-medium">Total Cost:</span>
                    <span className="font-bold text-blue-900 text-lg">${selectedSlot.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-600 text-sm mb-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Booking Policy</span>
                </div>
                <ul className="text-green-700 text-xs space-y-1">
                  <li>• Free cancellation up to 24 hours before session</li>
                  <li>• Secure video/audio connection provided</li>
                  <li>• Session recordings available on request</li>
                  <li>• Follow-up notes sent after session</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-white font-bold text-lg">
            {calendarDays.reduce((sum, day) => sum + getTotalAvailableSlots(day.dateString), 0)}
          </p>
          <p className="text-white/70 text-xs">Available Slots</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-white font-bold text-lg">{therapists.length}</p>
          <p className="text-white/70 text-xs">Therapists</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-white font-bold text-lg">{selectedDuration}</p>
          <p className="text-white/70 text-xs">Minutes</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            {React.createElement(getTypeIcon(selectedType), { className: "w-6 h-6 text-pink-400" })}
          </div>
          <p className="text-white font-bold text-lg capitalize">{selectedType}</p>
          <p className="text-white/70 text-xs">Session Type</p>
        </div>
      </div>
    </div>
  );
};