
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const useScheduling = (date?: Date) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();

    const subscription = supabase
      .channel('scheduling_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scheduling' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [date]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scheduling')
        .select(`
          id,
          title,
          client_id,
          start_time,
          end_time,
          status,
          created_at,
          updated_at
        `);
      
      if (error) throw error;
      
      // Transform to match the expected type
      const formattedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        title: booking.title,
        client_id: booking.client_id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        client: booking.client_id ? { company_name: '' } : null
      }));
      
      setBookings(formattedBookings);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Falha ao carregar agendamentos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    fetchBookings
  };
};
