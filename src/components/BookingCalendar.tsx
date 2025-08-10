import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Video,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { bookingManager, formatSessionTime, getSessionDurationLabel } from '@/lib/bookingSystem';

interface BookingCalendarProps {
  therapistId?: string;
  serviceType: 'counselling' | 'couple-therapy';
  onBookingConfirmed: (booking: any) => void;
  className?: string;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  therapistId,
  serviceType,
  onBookingConfirmed,
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'text'>('video');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = [
    { value: 30, label: '30 min', price: 60, description: 'Quick session' },
    { value: 60, label: '1 hour', price: 120, description: 'Standard session', popular: true },
    { value: 90, label: '1.5 hours', price: 180, description: 'Extended session' },
    { value: 120, label: '2 hours', price: 240, description: 'Intensive session' }
  ];

  // Generate calendar days for the next 21 days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isToday = i === 0;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Get available slots for this date
      const slots = therapistId 
        ? bookingManager.generateAvailableSlots(therapistId, dateString, selectedDuration)
        : [];

      days.push({
        date,
        dateString,
        isToday,
        isWeekend,
        availableSlots: slots.length,
        hasAvailability: slots.length > 0
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Update available slots when date/duration/type changes
  useEffect(() => {
    if (selectedDate && therapistId) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const slots = bookingManager.generateAvailableSlots(therapistId, selectedDate, selectedDuration);
        const filteredSlots = slots.filter(slot => slot.type === selectedType);
        setAvailableSlots(filteredSlots);
        setIsLoading(false);
      }, 300);
    }
  }, [selectedDate, selectedDuration, selectedType, therapistId]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleBookSlot = (slot: any) => {
    const booking = bookingManager.bookSession(
      'current-user',
      slot.therapistId,
      'Selected Therapist', // Would get from therapist data
      slot.date,
      slot.startTime,
      slot.duration,
      slot.type,
      serviceType
    );
    
    onBookingConfirmed(booking);
  };

  const getTypeIcon = (type: 'video' | 'audio' | 'text') => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      case 'text': return MessageCircle;
    }
  };

  const getAvailabilityColor = (count: number) => {
    if (count === 0) return 'text-red-500';
    if (count <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Duration and Type Selection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Session Preferences</h3>
        
        {/* Duration Options */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Session Duration</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDuration(option.value)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-300 text-center relative",
                  selectedDuration === option.value
                    ? "border-white bg-white/20 text-white"
                    : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15",
                  option.popular && "ring-2 ring-yellow-400"
                )}
              >
                {option.popular && (
                  <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                    Popular
                  </span>
                )}
                <Clock className="w-5 h-5 mx-auto mb-2" />
                <span className="block font-medium text-sm">{option.label}</span>
                <span className="block text-xs opacity-80">${option.price}</span>
                <span className="block text-xs opacity-60">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Session Type */}
        <div>
          <label className="block text-white font-medium mb-3">Session Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face' },
              { type: 'audio', label: 'Audio Call', icon: Phone, description: 'Voice only' },
              { type: 'text', label: 'Text Chat', icon: MessageCircle, description: 'Written chat' }
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => setSelectedType(option.type as any)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-300 text-center",
                    selectedType === option.type
                      ? "border-white bg-white/20 text-white"
                      : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15"
                  )}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2" />
                  <span className="block font-medium text-xs">{option.label}</span>
                  <span className="block text-xs opacity-80">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-900 min-w-[100px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.slice(0, 21).map((day) => (
            <button
              key={day.dateString}
              onClick={() => setSelectedDate(day.dateString)}
              disabled={!day.hasAvailability}
              className={cn(
                "aspect-square p-2 rounded-lg border-2 transition-all duration-300 relative text-center",
                selectedDate === day.dateString
                  ? "border-blue-500 bg-blue-50"
                  : day.hasAvailability
                  ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50",
                day.isToday && "ring-2 ring-green-400",
                day.isWeekend && !day.hasAvailability && "bg-gray-100"
              )}
            >
              <div className="text-sm font-medium text-gray-900">
                {day.date.getDate()}
              </div>
              <div className="text-xs mt-1">
                {day.hasAvailability ? (
                  <span className={cn("font-medium", getAvailabilityColor(day.availableSlots))}>
                    {day.availableSlots} slots
                  </span>
                ) : (
                  <span className="text-gray-400">No slots</span>
                )}
              </div>
              {day.isToday && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      {selectedDate && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">
              Available Times - {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
                const TypeIcon = getTypeIcon(slot.type);
                const timeRange = formatSessionTime(slot.startTime, slot.duration);
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleBookSlot(slot)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-center",
                      slot.available
                        ? "border-green-200 bg-green-50 hover:bg-green-100"
                        : "border-red-200 bg-red-50 cursor-not-allowed opacity-50"
                    )}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <TypeIcon className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="font-medium text-gray-900 text-sm">{slot.startTime}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{getSessionDurationLabel(slot.duration)}</p>
                    <p className="text-sm font-bold text-green-600">${slot.price}</p>
                    <div className="mt-2 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Available Slots</h4>
              <p className="text-gray-600 mb-4">
                No slots available for the selected date and preferences.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Try:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Selecting a different date</li>
                  <li>Choosing a different session duration</li>
                  <li>Trying a different session type</li>
                  <li>Selecting another therapist</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Summary */}
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Booking Summary
          </h4>
          <div className="space-y-2 text-sm">
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
              <span className="text-blue-700">Duration:</span>
              <span className="font-medium text-blue-900">{getSessionDurationLabel(selectedDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Type:</span>
              <div className="flex items-center space-x-1">
                {React.createElement(getTypeIcon(selectedType), { className: "w-4 h-4 text-blue-600" })}
                <span className="font-medium text-blue-900 capitalize">{selectedType}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Service:</span>
              <span className="font-medium text-blue-900 capitalize">{serviceType.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="text-blue-700">Available Slots:</span>
              <span className={cn("font-bold", getAvailabilityColor(availableSlots.length))}>
                {availableSlots.length} slots
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <div className="flex items-center text-yellow-800 text-sm mb-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span className="font-medium">Booking Tips</span>
        </div>
        <ul className="text-yellow-700 text-xs space-y-1">
          <li>• Book sessions at least 24 hours in advance</li>
          <li>• Video sessions provide the best therapeutic experience</li>
          <li>• {serviceType === 'couple-therapy' ? 'Both partners should be present for couple sessions' : 'Individual sessions are completely confidential'}</li>
          <li>• Free cancellation up to 24 hours before your session</li>
          <li>• You'll receive email and text reminders before your session</li>
        </ul>
      </div>
    </div>
  );
};