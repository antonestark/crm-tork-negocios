
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { BookingEvent } from '@/types/scheduling';
import { 
  fetchBookingsForDate, 
  fetchCalendarData, 
  createBookingInDb, 
  updateBookingStatusInDb 
} from '@/services/scheduling-service';
import { useSchedulingRealtime } from './use-scheduling-realtime';

export { BookingEvent } from '@/types/scheduling';

export const useSchedulingData = (selectedDate?: Date) => {
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get date range based on selectedDate or default to today
      const filterDate = selectedDate || new Date();
      const result = await fetchBookingsForDate(filterDate);
      setBookings(result);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err as Error);
      toast.error("Falha ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const fetchCalendarDataFn = useCallback(async () => {
    try {
      const { available, booked } = await fetchCalendarData();
      setAvailableDates(available);
      setBookedDates(booked);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchCalendarDataFn();
  }, [fetchBookings, fetchCalendarDataFn]);

  // Set up realtime subscription
  useSchedulingRealtime(() => {
    fetchBookings();
    fetchCalendarDataFn();
  });

  const createBooking = async (bookingData: Omit<BookingEvent, 'id' | 'date'>) => {
    try {
      const result = await createBookingInDb(bookingData);
      fetchBookings();
      fetchCalendarDataFn();
      return result;
    } catch (err: any) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const result = await updateBookingStatusInDb(id, status);
      toast.success("Status atualizado com sucesso");
      fetchBookings();
      fetchCalendarDataFn();
      return result;
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Falha ao atualizar status");
      return false;
    }
  };

  return {
    bookings,
    availableDates,
    bookedDates,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus
  };
};
