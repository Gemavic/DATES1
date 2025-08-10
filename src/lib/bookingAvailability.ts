// Enhanced Booking Availability System
export interface TimeSlot {
  id: string;
  therapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'video' | 'audio' | 'text';
  available: boolean;
  price: number;
  isRecurring?: boolean;
  conflictReason?: string;
}

export interface TherapistSchedule {
  therapistId: string;
  name: string;
  workingHours: {
    [key: string]: { // day of week
      start: string;
      end: string;
      breaks: { start: string; end: string }[];
    };
  };
  unavailableDates: string[];
  sessionDurations: number[];
  hourlyRate: number;
  maxSessionsPerDay: number;
}

export interface BookingConstraints {
  minAdvanceBooking: number; // hours
  maxAdvanceBooking: number; // days
  cancellationPolicy: number; // hours before session
  timeZone: string;
  bufferTime: number; // minutes between sessions
}

class AdvancedBookingAvailability {
  private schedules: Map<string, TherapistSchedule> = new Map();
  private bookedSlots: Map<string, TimeSlot[]> = new Map();
  private constraints: BookingConstraints;

  constructor() {
    this.constraints = {
      minAdvanceBooking: 2, // 2 hours minimum
      maxAdvanceBooking: 30, // 30 days maximum
      cancellationPolicy: 24, // 24 hours
      timeZone: 'America/New_York',
      bufferTime: 15 // 15 minutes between sessions
    };

    this.initializeTherapistSchedules();
  }

  private initializeTherapistSchedules() {
    // Dr. Sarah Johnson - Couple Therapy
    this.schedules.set('1', {
      therapistId: '1',
      name: 'Dr. Sarah Johnson',
      workingHours: {
        monday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
        wednesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
        friday: { start: '09:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '10:00', end: '14:00', breaks: [] }
      },
      unavailableDates: ['2025-01-20', '2025-02-15'], // Vacation days
      sessionDurations: [60, 90, 120],
      hourlyRate: 150,
      maxSessionsPerDay: 8
    });

    // Dr. Michael Chen - Counselling
    this.schedules.set('2', {
      therapistId: '2', 
      name: 'Dr. Michael Chen',
      workingHours: {
        monday: { start: '08:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { start: '10:00', end: '18:00', breaks: [{ start: '15:00', end: '16:00' }] },
        friday: { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
        saturday: { start: '09:00', end: '15:00', breaks: [] },
        sunday: { start: '11:00', end: '17:00', breaks: [{ start: '14:00', end: '15:00' }] }
      },
      unavailableDates: ['2025-01-25'],
      sessionDurations: [30, 60, 90, 120],
      hourlyRate: 130,
      maxSessionsPerDay: 10
    });

    // Dr. Emily Rodriguez - Both Services
    this.schedules.set('3', {
      therapistId: '3',
      name: 'Dr. Emily Rodriguez', 
      workingHours: {
        tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:30', end: '13:30' }] },
        thursday: { start: '10:00', end: '18:00', breaks: [{ start: '15:00', end: '16:00' }] },
        friday: { start: '08:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '10:00', end: '16:00', breaks: [{ start: '13:00', end: '14:00' }] }
      },
      unavailableDates: [],
      sessionDurations: [60, 90, 120],
      hourlyRate: 140,
      maxSessionsPerDay: 7
    });
  }

  // Generate available time slots for a specific date and therapist
  generateAvailableSlots(
    therapistId: string,
    date: string,
    duration: number,
    sessionType: 'video' | 'audio' | 'text' = 'video'
  ): TimeSlot[] {
    const schedule = this.schedules.get(therapistId);
    if (!schedule) return [];

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingDay = schedule.workingHours[dayOfWeek];
    
    if (!workingDay) return [];
    if (schedule.unavailableDates.includes(date)) return [];
    if (!schedule.sessionDurations.includes(duration)) return [];

    // Check if date is within booking constraints
    if (!this.isDateBookable(date)) return [];

    const slots: TimeSlot[] = [];
    const startTime = this.timeToMinutes(workingDay.start);
    const endTime = this.timeToMinutes(workingDay.end);
    
    let currentTime = startTime;
    
    while (currentTime + duration + this.constraints.bufferTime <= endTime) {
      const slotStartTime = this.minutesToTime(currentTime);
      const slotEndTime = this.minutesToTime(currentTime + duration);
      
      // Check for conflicts with breaks
      const hasBreakConflict = workingDay.breaks.some(breakTime => {
        const breakStart = this.timeToMinutes(breakTime.start);
        const breakEnd = this.timeToMinutes(breakTime.end);
        return currentTime < breakEnd && currentTime + duration > breakStart;
      });

      // Check for conflicts with existing bookings
      const hasBookingConflict = this.hasBookingConflict(therapistId, date, slotStartTime, duration);

      // Check daily session limit
      const dailySessionCount = this.getDailySessionCount(therapistId, date);
      const exceedsLimit = dailySessionCount >= schedule.maxSessionsPerDay;

      if (!hasBreakConflict && !hasBookingConflict && !exceedsLimit) {
        slots.push({
          id: `${therapistId}-${date}-${slotStartTime}-${sessionType}-${duration}`,
          therapistId,
          date,
          startTime: slotStartTime,
          endTime: slotEndTime,
          duration,
          type: sessionType,
          available: true,
          price: this.calculatePrice(schedule.hourlyRate, duration, sessionType)
        });
      }

      currentTime += 30; // Move to next 30-minute slot
    }

    return slots;
  }

  // Batch generate slots for multiple days
  generateBatchSlots(
    therapistId: string,
    startDate: string,
    endDate: string,
    duration: number,
    sessionType: 'video' | 'audio' | 'text' = 'video'
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const daySlots = this.generateAvailableSlots(therapistId, dateString, duration, sessionType);
      slots.push(...daySlots);
    }

    return slots;
  }

  // Get availability summary for a date range
  getAvailabilitySummary(
    therapistId: string,
    startDate: string,
    endDate: string
  ): {
    totalDays: number;
    availableDays: number;
    totalSlots: number;
    availableSlots: number;
    busyDays: string[];
  } {
    const summary = {
      totalDays: 0,
      availableDays: 0,
      totalSlots: 0,
      availableSlots: 0,
      busyDays: [] as string[]
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      summary.totalDays++;

      const slots = this.generateAvailableSlots(therapistId, dateString, 60); // Use 60min as standard
      summary.totalSlots += 8; // Assume 8 possible slots per day
      summary.availableSlots += slots.length;

      if (slots.length > 0) {
        summary.availableDays++;
      } else {
        summary.busyDays.push(dateString);
      }
    }

    return summary;
  }

  // Helper methods
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private isDateBookable(date: string): boolean {
    const bookingDate = new Date(date);
    const now = new Date();
    const minDate = new Date(now.getTime() + this.constraints.minAdvanceBooking * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + this.constraints.maxAdvanceBooking * 24 * 60 * 60 * 1000);

    return bookingDate >= minDate && bookingDate <= maxDate;
  }

  private hasBookingConflict(therapistId: string, date: string, startTime: string, duration: number): boolean {
    const bookedSlots = this.bookedSlots.get(`${therapistId}-${date}`) || [];
    const newStart = this.timeToMinutes(startTime);
    const newEnd = newStart + duration;

    return bookedSlots.some(slot => {
      const slotStart = this.timeToMinutes(slot.startTime);
      const slotEnd = this.timeToMinutes(slot.endTime);
      return newStart < slotEnd && newEnd > slotStart;
    });
  }

  private getDailySessionCount(therapistId: string, date: string): number {
    const bookedSlots = this.bookedSlots.get(`${therapistId}-${date}`) || [];
    return bookedSlots.length;
  }

  private calculatePrice(hourlyRate: number, duration: number, sessionType: 'video' | 'audio' | 'text'): number {
    const basePrice = (hourlyRate / 60) * duration;
    
    const typeMultiplier = {
      video: 1.0,
      audio: 0.8,
      text: 0.6
    };

    return Math.round(basePrice * typeMultiplier[sessionType] * 100) / 100;
  }

  // Book a slot
  bookSlot(slot: TimeSlot): boolean {
    const key = `${slot.therapistId}-${slot.date}`;
    const existingSlots = this.bookedSlots.get(key) || [];
    
    // Check for conflicts one more time
    if (this.hasBookingConflict(slot.therapistId, slot.date, slot.startTime, slot.duration)) {
      return false;
    }

    existingSlots.push(slot);
    this.bookedSlots.set(key, existingSlots);
    return true;
  }

  // Get all therapist schedules
  getAllSchedules(): TherapistSchedule[] {
    return Array.from(this.schedules.values());
  }

  // Get specific therapist schedule
  getTherapistSchedule(therapistId: string): TherapistSchedule | null {
    return this.schedules.get(therapistId) || null;
  }
}

// Export singleton instance
export const bookingAvailability = new AdvancedBookingAvailability();

// Utility functions
export const formatTimeRange = (startTime: string, duration: number): string => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(start.getTime() + duration * 60000);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const getAvailabilityColor = (availableCount: number): string => {
  if (availableCount === 0) return 'text-red-500';
  if (availableCount <= 2) return 'text-yellow-500';
  if (availableCount <= 5) return 'text-green-500';
  return 'text-blue-500';
};

export const getDurationLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};