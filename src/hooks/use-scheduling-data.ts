
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, startOfDay, endOfDay } from 'date-fns';

export type BookingEvent = {
  id: string;
  title: string;
  client?: { company_name: string } | null;
  client_id?: string | null;
  start_time: string;
  end_time: string;
  status: string;
  date: string;
};

export const useSchedulingData = (selectedDate?: Date) => {
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchCalendarData();
    
    // Set up a realtime subscription for scheduling updates
    const subscription = supabase
      .channel('scheduling_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scheduling' 
      }, () => {
        fetchBookings();
        fetchCalendarData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get date range based on selectedDate or default to today
      const filterDate = selectedDate || new Date();
      const dayStart = startOfDay(filterDate);
      const dayEnd = endOfDay(filterDate);
      
      const { data, error } = await supabase
        .from("scheduling")
        .select(`
          id,
          title,
          start_time,
          end_time,
          status,
          client_id
        `)
        .gte("start_time", dayStart.toISOString())
        .lt("start_time", dayEnd.toISOString())
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      
      // Format the data to match the BookingEvent type
      const formattedBookings: BookingEvent[] = (data || []).map(booking => ({
        id: booking.id,
        title: booking.title,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        client_id: booking.client_id,
        client: booking.client_id ? { company_name: '' } : null,
        date: format(new Date(booking.start_time), 'yyyy-MM-dd')
      }));
      
      setBookings(formattedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err as Error);
      toast.error("Falha ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarData = async () => {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
      
      const { data, error } = await supabase
        .from("scheduling")
        .select("start_time, status")
        .gte("start_time", startOfMonth.toISOString())
        .lte("start_time", endOfMonth.toISOString());
      
      if (error) throw error;
      
      // Group dates by status
      const available: string[] = [];
      const booked: string[] = [];
      
      data?.forEach(item => {
        const dateStr = format(new Date(item.start_time), 'yyyy-MM-dd');
        if (item.status === 'confirmed' || item.status === 'in-progress') {
          if (!booked.includes(dateStr)) booked.push(dateStr);
        } else {
          if (!available.includes(dateStr)) available.push(dateStr);
        }
      });
      
      setAvailableDates(available);
      setBookedDates(booked);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    }
  };

  const createBooking = async (bookingData: Omit<BookingEvent, 'id' | 'date'>) => {
    try {
      // Validate that all required fields are present
      if (!bookingData.title || !bookingData.start_time || !bookingData.end_time || !bookingData.status) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }
      
      // Parse and validate times
      const startTime = new Date(bookingData.start_time);
      const endTime = new Date(bookingData.end_time);
      
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("Data ou hora inválida");
      }
      
      if (startTime >= endTime) {
        throw new Error("O horário de término deve ser posterior ao horário de início");
      }
      
      const { data, error } = await supabase
        .from("scheduling")
        .insert([{
          title: bookingData.title,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          status: bookingData.status,
          client_id: bookingData.client_id
        }])
        .select();
      
      if (error) {
        // Check for known constraint violations
        if (error.message.includes('check_end_after_start')) {
          throw new Error("O horário de término deve ser posterior ao horário de início");
        } else if (error.message.includes('conflito com outro agendamento')) {
          throw new Error("Este horário já está reservado. Por favor, escolha outro horário");
        } else {
          throw error;
        }
      }
      
      fetchBookings();
      fetchCalendarData();
      return data[0];
    } catch (err: any) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      if (!id || !status) {
        throw new Error("ID e status são obrigatórios");
      }
      
      const { error } = await supabase
        .from("scheduling")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Status atualizado com sucesso");
      fetchBookings();
      fetchCalendarData();
      return true;
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
