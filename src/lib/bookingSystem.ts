// Booking System for Therapy Sessions
export interface BookingSlot {
  id: string;
  therapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  available: boolean;
  type: 'video' | 'audio' | 'text';
  price: number;
  isRecurring?: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
}

export interface BookedSession {
  id: string;
  userId: string;
  therapistId: string;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'video' | 'audio' | 'text';
  serviceType: 'counselling' | 'couple-therapy';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  cost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TherapistAvailability {
  therapistId: string;
  dayOfWeek: string; // 'monday', 'tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '17:00'
  breakTimes: { start: string; end: string }[];
  sessionDurations: number[]; // allowed durations in minutes
  unavailableDates: string[]; // specific dates not available
}

export interface BookingPreferences {
  userId: string;
  preferredDurations: number[];
  preferredTypes: ('video' | 'audio' | 'text')[];
  preferredDays: string[];
  preferredTimes: string[];
  timezone: string;
  reminderSettings: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    timeBefore: number; // minutes before session
  };
}

class BookingManager {
  private bookedSessions: Map<string, BookedSession[]> = new Map();
  private therapistAvailability: Map<string, TherapistAvailability> = new Map();
  private userPreferences: Map<string, BookingPreferences> = new Map();

  constructor() {
    this.initializeDefaultAvailability();
  }

  private initializeDefaultAvailability() {
    // Dr. Lisa Thompson - Counselling
    this.therapistAvailability.set('1', {
      therapistId: '1',
      dayOfWeek: 'monday,tuesday,wednesday,thursday,friday',
      startTime: '09:00',
      endTime: '17:00',
      breakTimes: [{ start: '12:00', end: '13:00' }],
      sessionDurations: [30, 60, 90],
      unavailableDates: ['2025-01-20', '2025-01-27'] // Example vacation days
    });

    // Dr. James Wilson - Counselling
    this.therapistAvailability.set('2', {
      therapistId: '2',
      dayOfWeek: 'monday,wednesday,friday,saturday',
      startTime: '10:00',
      endTime: '18:00',
      breakTimes: [{ start: '14:00', end: '15:00' }],
      sessionDurations: [60, 90, 120],
      unavailableDates: []
    });

    // Dr. Sarah Johnson - Couple Therapy
    this.therapistAvailability.set('3', {
      therapistId: '3',
      dayOfWeek: 'tuesday,thursday,friday,saturday',
      startTime: '08:00',
      endTime: '16:00',
      breakTimes: [{ start: '12:00', end: '13:00' }],
      sessionDurations: [60, 90, 120],
      unavailableDates: ['2025-01-25']
    });
  }

  // Generate available slots for a therapist on a specific date
  generateAvailableSlots(therapistId: string, date: string, duration: number): BookingSlot[] {
    const availability = this.therapistAvailability.get(therapistId);
    if (!availability) return [];

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availableDays = availability.dayOfWeek.split(',');
    
    if (!availableDays.includes(dayOfWeek)) return [];
    if (availability.unavailableDates.includes(date)) return [];
    if (!availability.sessionDurations.includes(duration)) return [];

    const slots: BookingSlot[] = [];
    const startHour = parseInt(availability.startTime.split(':')[0]);
    const startMinute = parseInt(availability.startTime.split(':')[1]);
    const endHour = parseInt(availability.endTime.split(':')[0]);
    const endMinute = parseInt(availability.endTime.split(':')[1]);

    let currentTime = startHour * 60 + startMinute; // Convert to minutes
    const endTimeMinutes = endHour * 60 + endMinute;
    const sessionDuration = duration;

    while (currentTime + sessionDuration <= endTimeMinutes) {
      const slotHour = Math.floor(currentTime / 60);
      const slotMinute = currentTime % 60;
      const timeString = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
      
      // Check if slot conflicts with break times
      const isBreakTime = availability.breakTimes.some(breakTime => {
        const breakStart = this.timeStringToMinutes(breakTime.start);
        const breakEnd = this.timeStringToMinutes(breakTime.end);
        return currentTime < breakEnd && currentTime + sessionDuration > breakStart;
      });

      // Check if slot is already booked
      const isBooked = this.isSlotBooked(therapistId, date, timeString, sessionDuration);

      if (!isBreakTime && !isBooked) {
        const endTime = this.minutesToTimeString(currentTime + sessionDuration);
        
        // Generate slots for each session type
        ['video', 'audio', 'text'].forEach(type => {
          slots.push({
            id: `${therapistId}-${date}-${timeString}-${type}-${duration}`,
            therapistId,
            date,
            startTime: timeString,
            endTime,
            duration: sessionDuration,
            available: true,
            type: type as 'video' | 'audio' | 'text',
            price: this.calculateSessionPrice(therapistId, duration, type as any)
          });
        });
      }

      currentTime += 30; // Move to next 30-minute slot
    }

    return slots;
  }

  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private isSlotBooked(therapistId: string, date: string, startTime: string, duration: number): boolean {
    const userSessions = Array.from(this.bookedSessions.values()).flat();
    return userSessions.some(session => 
      session.therapistId === therapistId &&
      session.date === date &&
      this.timesOverlap(startTime, duration, session.startTime, session.duration)
    );
  }

  private timesOverlap(start1: string, duration1: number, start2: string, duration2: number): boolean {
    const start1Minutes = this.timeStringToMinutes(start1);
    const end1Minutes = start1Minutes + duration1;
    const start2Minutes = this.timeStringToMinutes(start2);
    const end2Minutes = start2Minutes + duration2;

    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
  }

  private calculateSessionPrice(therapistId: string, duration: number, type: 'video' | 'audio' | 'text'): number {
    // Base rates per therapist (would be in database in real app)
    const baseRates: Record<string, number> = {
      '1': 120, // Dr. Lisa Thompson
      '2': 100, // Dr. James Wilson  
      '3': 140  // Dr. Sarah Johnson
    };

    const baseRate = baseRates[therapistId] || 100;
    const hourlyRate = (baseRate / 60) * duration;

    // Type multipliers
    const typeMultiplier = {
      'video': 1.0,
      'audio': 0.8,
      'text': 0.6
    };

    return Math.round(hourlyRate * typeMultiplier[type] * 100) / 100;
  }

  // Book a session
  bookSession(
    userId: string,
    therapistId: string,
    therapistName: string,
    date: string,
    startTime: string,
    duration: number,
    type: 'video' | 'audio' | 'text',
    serviceType: 'counselling' | 'couple-therapy'
  ): BookedSession {
    const endTime = this.minutesToTimeString(
      this.timeStringToMinutes(startTime) + duration
    );

    const cost = this.calculateSessionPrice(therapistId, duration, type);
    const finalCost = serviceType === 'couple-therapy' ? cost * 1.2 : cost; // 20% markup for couples

    const session: BookedSession = {
      id: Math.random().toString(36).substring(2),
      userId,
      therapistId,
      therapistName,
      date,
      startTime,
      endTime,
      duration,
      type,
      serviceType,
      status: 'scheduled',
      cost: finalCost,
      paymentStatus: 'paid',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!this.bookedSessions.has(userId)) {
      this.bookedSessions.set(userId, []);
    }
    this.bookedSessions.get(userId)!.push(session);

    return session;
  }

  // Get user's booked sessions
  getUserSessions(userId: string): BookedSession[] {
    return this.bookedSessions.get(userId) || [];
  }

  // Cancel a session
  cancelSession(userId: string, sessionId: string, reason?: string): boolean {
    const userSessions = this.bookedSessions.get(userId);
    if (!userSessions) return false;

    const sessionIndex = userSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return false;

    const session = userSessions[sessionIndex];
    
    // Check if cancellation is allowed (24 hours before)
    const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
    const now = new Date();
    const hoursDifference = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return false; // Cannot cancel within 24 hours
    }

    session.status = 'cancelled';
    session.updatedAt = new Date();
    session.notes = reason || 'Cancelled by user';

    return true;
  }

  // Get available slots for date range
  getAvailableSlots(
    therapistId: string, 
    startDate: string, 
    endDate: string, 
    duration: number
  ): BookingSlot[] {
    const slots: BookingSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const daySlots = this.generateAvailableSlots(therapistId, dateString, duration);
      slots.push(...daySlots);
    }

    return slots;
  }

  // Get booking statistics
  getBookingStats(therapistId?: string): {
    totalBookings: number;
    todayBookings: number;
    weekBookings: number;
    cancelledBookings: number;
    revenue: number;
  } {
    const allSessions = Array.from(this.bookedSessions.values()).flat();
    const filteredSessions = therapistId 
      ? allSessions.filter(s => s.therapistId === therapistId)
      : allSessions;

    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

    return {
      totalBookings: filteredSessions.length,
      todayBookings: filteredSessions.filter(s => s.date === today).length,
      weekBookings: filteredSessions.filter(s => s.date >= weekAgoString).length,
      cancelledBookings: filteredSessions.filter(s => s.status === 'cancelled').length,
      revenue: filteredSessions
        .filter(s => s.paymentStatus === 'paid')
        .reduce((sum, s) => sum + s.cost, 0)
    };
  }

  // Reschedule a session
  rescheduleSession(
    userId: string,
    sessionId: string,
    newDate: string,
    newStartTime: string
  ): boolean {
    const userSessions = this.bookedSessions.get(userId);
    if (!userSessions) return false;

    const session = userSessions.find(s => s.id === sessionId);
    if (!session) return false;

    // Check if new slot is available
    const isAvailable = !this.isSlotBooked(
      session.therapistId,
      newDate,
      newStartTime,
      session.duration
    );

    if (!isAvailable) return false;

    // Update session
    session.date = newDate;
    session.startTime = newStartTime;
    session.endTime = this.minutesToTimeString(
      this.timeStringToMinutes(newStartTime) + session.duration
    );
    session.updatedAt = new Date();

    return true;
  }

  // Set user booking preferences
  setUserPreferences(userId: string, preferences: Partial<BookingPreferences>): void {
    const existing = this.userPreferences.get(userId) || {
      userId,
      preferredDurations: [60],
      preferredTypes: ['video'],
      preferredDays: [],
      preferredTimes: [],
      timezone: 'America/New_York',
      reminderSettings: {
        email: true,
        sms: false,
        inApp: true,
        timeBefore: 60
      }
    };

    this.userPreferences.set(userId, { ...existing, ...preferences });
  }

  // Get user preferences
  getUserPreferences(userId: string): BookingPreferences | null {
    return this.userPreferences.get(userId) || null;
  }

  // Send booking reminders
  sendBookingReminder(sessionId: string): boolean {
    const allSessions = Array.from(this.bookedSessions.values()).flat();
    const session = allSessions.find(s => s.id === sessionId);
    
    if (!session) return false;

    const userPrefs = this.getUserPreferences(session.userId);
    if (!userPrefs) return false;

    console.log(`📅 Booking reminder sent for session ${sessionId}:`);
    console.log(`- Session: ${session.therapistName} on ${session.date} at ${session.startTime}`);
    console.log(`- Duration: ${session.duration} minutes`);
    console.log(`- Type: ${session.type}`);
    
    if (userPrefs.reminderSettings.email) {
      console.log(`📧 Email reminder sent to user ${session.userId}`);
    }
    
    if (userPrefs.reminderSettings.sms) {
      console.log(`📱 SMS reminder sent to user ${session.userId}`);
    }

    return true;
  }

  // Get upcoming sessions
  getUpcomingSessions(userId: string, days: number = 7): BookedSession[] {
    const userSessions = this.getUserSessions(userId);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return userSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= today && 
             sessionDate <= futureDate && 
             ['scheduled', 'confirmed'].includes(session.status);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Check for conflicts
  hasScheduleConflict(
    userId: string,
    date: string,
    startTime: string,
    duration: number
  ): boolean {
    const userSessions = this.getUserSessions(userId);
    return userSessions.some(session =>
      session.date === date &&
      this.timesOverlap(startTime, duration, session.startTime, session.duration) &&
      ['scheduled', 'confirmed'].includes(session.status)
    );
  }

  // Bulk availability check
  checkMultipleSlots(requests: {
    therapistId: string;
    date: string;
    startTime: string;
    duration: number;
  }[]): boolean[] {
    return requests.map(request => 
      !this.isSlotBooked(request.therapistId, request.date, request.startTime, request.duration)
    );
  }

  // Get therapist schedule
  getTherapistSchedule(therapistId: string, date: string): {
    availability: TherapistAvailability | null;
    bookedSlots: BookedSession[];
    availableSlots: BookingSlot[];
  } {
    const availability = this.therapistAvailability.get(therapistId) || null;
    const allSessions = Array.from(this.bookedSessions.values()).flat();
    const bookedSlots = allSessions.filter(s => 
      s.therapistId === therapistId && 
      s.date === date &&
      ['scheduled', 'confirmed'].includes(s.status)
    );

    const availableSlots = availability 
      ? this.generateAvailableSlots(therapistId, date, 60) // Default 60 min
      : [];

    return {
      availability,
      bookedSlots,
      availableSlots
    };
  }
}

// Create singleton instance
export const bookingManager = new BookingManager();

// Utility functions
export const formatSessionTime = (startTime: string, duration: number): string => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(start.getTime() + duration * 60000);
  
  return `${start.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })} - ${end.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })}`;
};

export const getSessionDurationLabel = (duration: number): string => {
  if (duration < 60) return `${duration} min`;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours}h ${minutes}m`;
};

export const calculateSessionCredits = (price: number): number => {
  return Math.ceil(price); // Convert price to credits (1 credit = $1)
};