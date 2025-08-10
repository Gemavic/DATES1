import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { bookingAvailability, formatTimeRange, getAvailabilityColor, getDurationLabel } from '@/lib/bookingAvailability';

interface AdvancedCalendarProps {
  therapists: any[];
  serviceType: 'counselling' | 'couple-therapy';
  onBookingConfirmed: (booking: any) => void;
  className?: string;
}

export const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  therapists,
  serviceType,
  onBookingConfirmed,
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'text'>('video');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('week');
  const [showFilters, setShowFilters] = useState(false);

  const durationOptions = [
    { value: 30, label: '30 min', price: 75, description: 'Brief consultation', icon: '⚡' },
    { value: 60, label: '1 hour', price: 150, description: 'Standard session', popular: true, icon: '⭐' },
    { value: 90, label: '1.5 hours', price: 225, description: 'Extended session', icon: '🔥' },
    { value: 120, label: '2 hours', price: 300, description: 'Intensive session', icon: '💎' }
  ];

  // Generate calendar weeks
  const generateCalendarWeeks = () => {
    const weeks = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Start from the first day of the week containing the first day of the month
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End at the last day of the week containing the last day of the month
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(date);
        day.setDate(date.getDate() + i);
        
        const dateString = day.toISOString().split('T')[0];
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = day.toDateString() === new Date().toDateString();
        const isPast = day < new Date();
        
        // Get availability summary
        const availability = selectedTherapist 
          ? bookingAvailability.generateAvailableSlots(selectedTherapist, dateString, selectedDuration, selectedType)
          : [];

        week.push({
          date: day,
          dateString,
          isCurrentMonth,
          isToday,
          isPast,
          availableSlots: availability.length,
          hasAvailability: availability.length > 0
        });
      }
      weeks.push(week);
    }

    return weeks;
  };

  // Update available slots when selections change
  useEffect(() => {
    if (selectedDate && selectedTherapist) {
      setIsLoading(true);
      
      // Simulate realistic loading time
      setTimeout(() => {
        const slots = bookingAvailability.generateAvailableSlots(
          selectedTherapist,
          selectedDate,
          selectedDuration,
          selectedType
        );
        setAvailableSlots(slots);
        setIsLoading(false);
      }, 400);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedTherapist, selectedDuration, selectedType]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleBookSlot = (slot: any) => {
    const therapist = therapists.find(t => t.id === slot.therapistId);
    if (!therapist) return;

    // Calculate final price (add 20% for couple therapy)
    const finalPrice = serviceType === 'couple-therapy' ? slot.price * 1.2 : slot.price;

    const booking = {
      id: Math.random().toString(36).substring(2),
      therapistId: slot.therapistId,
      therapistName: therapist.name,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      type: slot.type,
      serviceType,
      cost: finalPrice,
      status: 'confirmed',
      bookingTime: new Date()
    };

    // Book the slot
    const success = bookingAvailability.bookSlot(slot);
    if (success) {
      onBookingConfirmed(booking);
    } else {
      alert('This slot is no longer available. Please select another time.');
    }
  };

  const getTypeIcon = (type: 'video' | 'audio' | 'text') => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      case 'text': return MessageCircle;
    }
  };

  const calendarWeeks = generateCalendarWeeks();
  const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Session Configuration */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-xl">Session Configuration</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 text-white hover:bg-white/30 text-sm px-3 py-2"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-white/20 text-white hover:bg-white/30 text-sm px-3 py-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <h4 className="text-white font-medium mb-3">Filter Options</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
                className="p-2 bg-white/20 text-white rounded-lg border border-white/30"
              >
                <option value="">All Therapists</option>
                {therapists.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="p-2 bg-white/20 text-white rounded-lg border border-white/30"
              >
                {durationOptions.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="p-2 bg-white/20 text-white rounded-lg border border-white/30"
              >
                <option value="video">Video Call</option>
                <option value="audio">Audio Call</option>
                <option value="text">Text Chat</option>
              </select>
              
              <select
                value={calendarView}
                onChange={(e) => setCalendarView(e.target.value as any)}
                className="p-2 bg-white/20 text-white rounded-lg border border-white/30"
              >
                <option value="week">Week View</option>
                <option value="month">Month View</option>
              </select>
            </div>
          </div>
        )}

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
                    {serviceType === 'couple-therapy' && (
                      <span className="text-xs text-pink-400">(+20%)</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration and Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-3">Session Duration</label>
            <div className="grid grid-cols-2 gap-3">
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
                  <div className="text-lg mb-1">{option.icon}</div>
                  <span className="block font-medium text-sm">{option.label}</span>
                  <span className="block text-xs opacity-80">${option.price}</span>
                  <span className="block text-xs opacity-60">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">Session Type</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { type: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face therapy', multiplier: '1.0x' },
                { type: 'audio', label: 'Audio Call', icon: Phone, description: 'Voice-only session', multiplier: '0.8x' },
                { type: 'text', label: 'Text Chat', icon: MessageCircle, description: 'Written communication', multiplier: '0.6x' }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type as any)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300",
                      selectedType === option.type
                        ? "border-white bg-white/20 text-white"
                        : "border-white/30 bg-white/10 text-white/80 hover:bg-white/15"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <span className="block font-medium text-sm">{option.label}</span>
                      <span className="block text-xs opacity-80">{option.description}</span>
                    </div>
                    <span className="text-xs opacity-70">{option.multiplier}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Calendar */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Select Date & Time</h3>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCalendarView('week')}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  calendarView === 'week' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('month')}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  calendarView === 'month' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                Month
              </button>
            </div>
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-900 min-w-[140px] text-center">
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
        <div className="space-y-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Weeks */}
          {calendarWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day) => (
                <button
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  disabled={day.isPast || !day.hasAvailability}
                  className={cn(
                    "aspect-square p-2 rounded-lg border-2 transition-all duration-300 relative text-center",
                    selectedDate === day.dateString
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : day.hasAvailability && !day.isPast
                      ? "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100"
                      : day.isPast
                      ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                      : "border-red-200 bg-red-50 cursor-not-allowed opacity-50",
                    day.isToday && "ring-2 ring-blue-400",
                    !day.isCurrentMonth && "opacity-40"
                  )}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {day.date.getDate()}
                  </div>
                  <div className="text-xs mt-1">
                    {day.hasAvailability && !day.isPast ? (
                      <span className={cn("font-medium", getAvailabilityColor(day.availableSlots))}>
                        {day.availableSlots} slots
                      </span>
                    ) : day.isPast ? (
                      <span className="text-gray-400">Past</span>
                    ) : (
                      <span className="text-red-500">Full</span>
                    )}
                  </div>
                  {day.isToday && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      {selectedDate && selectedTherapist && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
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
                <span className="text-sm">Loading slots...</span>
              </div>
            )}
          </div>

          {/* Therapist Info */}
          {selectedTherapistData && (
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedTherapistData.image}
                  alt={selectedTherapistData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{selectedTherapistData.name}</h5>
                  <p className="text-sm text-gray-600">{selectedTherapistData.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                    <span className="text-xs text-gray-600">{selectedTherapistData.rating} rating</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${selectedTherapistData.hourlyRate}/hour</p>
                  <p className="text-xs text-gray-600">{getDurationLabel(selectedDuration)}</p>
                  {serviceType === 'couple-therapy' && (
                    <p className="text-xs text-pink-600">+20% for couples</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Time Slots Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
                const TypeIcon = getTypeIcon(slot.type);
                const finalPrice = serviceType === 'couple-therapy' ? slot.price * 1.2 : slot.price;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleBookSlot(slot)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-center",
                      slot.available
                        ? "border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400"
                        : "border-red-200 bg-red-50 cursor-not-allowed opacity-50"
                    )}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <TypeIcon className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="font-medium text-gray-900 text-sm">{slot.startTime}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{getDurationLabel(slot.duration)}</p>
                    <p className="text-sm font-bold text-green-600">${finalPrice.toFixed(2)}</p>
                    <div className="mt-2 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeRange(slot.startTime, slot.duration)}
                    </p>
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

      {/* Availability Legend */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
        <h4 className="text-white font-medium mb-3">Availability Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-white">Available (5+ slots)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-white">Limited (2-4 slots)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-white">Fully Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-white">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedDate && selectedTherapist && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Booking Configuration
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Therapist:</span>
                <span className="font-medium text-blue-900">{selectedTherapistData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Date:</span>
                <span className="font-medium text-blue-900">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Duration:</span>
                <span className="font-medium text-blue-900">{getDurationLabel(selectedDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Available:</span>
                <span className={cn("font-bold", getAvailabilityColor(availableSlots.length))}>
                  {availableSlots.length} slots
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};