
import { supabase } from '@/integrations/supabase/client';
import { BookingEvent, BookingRequest } from '@/types/scheduling';
import { format, startOfDay, endOfDay } from 'date-fns';

export const fetchBookingsForDate = async (filterDate: Date) => {
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
      client_id,
      user_id,
      description,
      location,
      customer_id,
      email,
      phone
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
    user_id: booking.user_id,
    description: booking.description,
    location: booking.location,
    customer_id: booking.customer_id,
    email: booking.email,
    phone: booking.phone,
    client: booking.client_id ? { company_name: '' } : null,
    date: format(new Date(booking.start_time), 'yyyy-MM-dd')
  }));
  
  return formattedBookings;
};

export const fetchCalendarData = async () => {
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
  
  return { available, booked };
};

export const createBookingInDb = async (bookingData: BookingRequest) => {
  // Validate that all required fields are present
  if (!bookingData.title || !bookingData.start_time || !bookingData.end_time || !bookingData.status) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos");
  }
  
  // Validate that either email or phone is provided
  if (!bookingData.email && !bookingData.phone) {
    throw new Error("Email ou telefone deve ser informado");
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
  
  // Create the booking object
  const bookingObject: any = {
    title: bookingData.title,
    start_time: bookingData.start_time,
    end_time: bookingData.end_time,
    status: bookingData.status,
    client_id: bookingData.client_id,
    user_id: bookingData.user_id,
    description: bookingData.description,
    location: bookingData.location,
    customer_id: bookingData.customer_id,
    email: bookingData.email,
    phone: bookingData.phone
  };
  
  const { data, error } = await supabase
    .from("scheduling")
    .insert(bookingObject)
    .select();
  
  if (error) {
    // Check for known constraint violations
    if (error.message.includes('check_end_after_start')) {
      throw new Error("O horário de término deve ser posterior ao horário de início");
    } else if (error.message.includes('conflito com outro agendamento')) {
      throw new Error("Este horário já está reservado. Por favor, escolha outro horário");
    } else if (error.message.includes('validate_customer_id')) {
      throw new Error("ID do cliente inválido. Deve ser numérico");
    } else if (error.message.includes('Já existe um agendamento confirmado para este email')) {
      throw new Error("Já existe um agendamento confirmado para este email na mesma data");
    } else if (error.message.includes('Já existe um agendamento confirmado para este telefone')) {
      throw new Error("Já existe um agendamento confirmado para este telefone na mesma data");
    } else {
      throw error;
    }
  }
  
  return data[0];
};

export const updateBookingStatusInDb = async (id: string, status: string) => {
  if (!id || !status) {
    throw new Error("ID e status são obrigatórios");
  }
  
  if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
    throw new Error("Status inválido. Deve ser confirmed, cancelled ou pending");
  }
  
  const { error } = await supabase
    .from("scheduling")
    .update({ status })
    .eq("id", id);
  
  if (error) throw error;
  
  return true;
};
