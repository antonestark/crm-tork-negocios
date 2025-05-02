import { supabase } from '@/integrations/supabase/client';
import { BookingEvent, BookingRequest, SchedulingSettings, WeeklyAvailabilityRule } from '@/types/scheduling'; // Adicionar tipos
import { format, startOfDay, endOfDay, getDay, parse, addHours, addDays, isBefore, isAfter } from 'date-fns'; // Adicionar funções date-fns

// --- Funções para buscar configurações ---

export const fetchSchedulingSettings = async () => {
  const { data, error } = await (supabase as any)
    .from('scheduling_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching scheduling settings:", error);
    return {
      id: 0,
      slot_duration_minutes: 60,
      min_advance_booking_hours: 4,
      max_advance_booking_days: 60,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  return data || {
    id: 0,
    slot_duration_minutes: 60,
    min_advance_booking_hours: 4,
    max_advance_booking_days: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const fetchWeeklyAvailability = async () => {
  const { data, error } = await (supabase as any)
    .from('weekly_availability')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching weekly availability:", error);
    return [];
  }
  return data || [];
};

// --- Funções para ATUALIZAR configurações ---

export const updateSchedulingSettings = async (settings: Partial<Omit<SchedulingSettings, 'id' | 'created_at' | 'updated_at'>>) => {
  // Busca o ID da configuração existente (deve haver apenas 1)
  const { data: existing, error: fetchError } = await (supabase as any)
    .from('scheduling_settings')
    .select('id')
    .limit(1)
    .single();

  if (fetchError || !existing) {
    console.error("Error fetching existing settings ID:", fetchError);
    throw new Error("Não foi possível encontrar as configurações de agendamento existentes.");
  }

  const { error } = await (supabase as any)
    .from('scheduling_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', existing.id); // Atualiza a linha existente

  if (error) {
    console.error("Error updating scheduling settings:", error);
    throw error;
  }
  return true;
};

// Função para definir TODA a disponibilidade semanal (apaga as regras antigas e insere as novas)
// Isso simplifica a lógica, mas pode ser otimizado se necessário
export const setWeeklyAvailability = async (rules: Omit<WeeklyAvailabilityRule, 'id' | 'created_at' | 'updated_at'>[]) => {
  // 1. Apagar todas as regras existentes
  const { error: deleteError } = await (supabase as any)
    .from('weekly_availability')
    .delete()
    .neq('id', 0); // Condição para deletar tudo (ou use truncate se preferir e tiver permissão)

  if (deleteError) {
    console.error("Error deleting old weekly availability:", deleteError);
    throw deleteError;
  }

  // 2. Inserir as novas regras
  // Validar sobreposição aqui na aplicação antes de inserir
  // (Lógica de validação de sobreposição omitida por simplicidade, mas necessária em produção)
  const { error: insertError } = await (supabase as any)
    .from('weekly_availability')
    .insert(rules);

  if (insertError) {
    console.error("Error inserting new weekly availability:", insertError);
    throw insertError;
  }

  return true;
};


// --- Funções existentes ---

export const fetchBookingsForDate = async (filterDate: Date): Promise<BookingEvent[]> => {
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

// Function to generate a unique customer ID 
const generateCustomerId = async (): Promise<string> => {
  // Get the current highest customer ID
  const { data, error } = await supabase
    .from("scheduling")
    .select("customer_id")
    .order("customer_id", { ascending: false })
    .limit(1);
  
  if (error) {
    console.error("Error fetching customer IDs:", error);
    // Start from 1000 if we can't fetch existing IDs
    return "1000";
  }
  
  // If there are no existing customer IDs, start from 1000
  if (!data || data.length === 0 || !data[0].customer_id) {
    return "1000";
  }
  
  // Increment the highest customer ID by 1
  const highestId = parseInt(data[0].customer_id);
  return (highestId + 1).toString();
};

// Function to check for scheduling conflicts
const checkForConflicts = async (startTime: string, endTime: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("scheduling")
    .select("id")
    .lt("end_time", endTime)
    .gt("start_time", startTime)
    .or(`start_time.gte.${startTime},start_time.lt.${endTime}`)
    .or(`end_time.gt.${startTime},end_time.lte.${endTime}`)
    .not("status", "eq", "cancelled");
  
  if (error) {
    console.error("Error checking for conflicts:", error);
    return true; // Assume there's a conflict if we can't check
  }
  
  return data && data.length > 0;
};

// Now requires tenantId
export const createBookingInDb = async (bookingData: BookingRequest, tenantId: string) => {
   if (!tenantId) {
    console.error("Tenant ID is required to create a booking.");
    // Consider using toast here if available
    throw new Error("Erro: ID do inquilino não encontrado. Não é possível criar agendamento.");
  }

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
  
  // --- Validações Adicionais com Base nas Configurações ---
  const settings = await fetchSchedulingSettings();

  // 1. Validar Antecedência Mínima
  const minBookingTime = addHours(new Date(), settings.min_advance_booking_hours);
  if (isBefore(startTime, minBookingTime)) {
    throw new Error(`O agendamento deve ser feito com pelo menos ${settings.min_advance_booking_hours} horas de antecedência.`);
  }

  // 2. Validar Antecedência Máxima
  const maxBookingTime = addDays(new Date(), settings.max_advance_booking_days);
   if (isAfter(startTime, maxBookingTime)) {
     throw new Error(`O agendamento não pode ser feito com mais de ${settings.max_advance_booking_days} dias de antecedência.`);
   }

  // 3. Validar Disponibilidade Semanal (simplificado - verifica se o horário está dentro de algum intervalo do dia)
  // Idealmente, a busca de slots já filtraria isso, mas é bom ter uma checagem extra.
  const dayOfWeek = getDay(startTime); // 0 = Domingo, 1 = Segunda...
  const availabilityRules = await fetchWeeklyAvailability();
  const ruleForDay = availabilityRules.find(rule => rule.day_of_week === dayOfWeek && rule.is_available);

  if (!ruleForDay) {
      throw new Error("Não há disponibilidade configurada para este dia da semana.");
  }

  // Comparar apenas a parte de hora/minuto
  const bookingStartTimeStr = format(startTime, 'HH:mm:ss');
  const bookingEndTimeStr = format(endTime, 'HH:mm:ss');

  if (bookingStartTimeStr < ruleForDay.start_time || bookingEndTimeStr > ruleForDay.end_time) {
       throw new Error(`Horário fora do período de disponibilidade (${ruleForDay.start_time} - ${ruleForDay.end_time}) para este dia.`);
  }

  // 4. Check for scheduling conflicts (já existente)
  const hasConflict = await checkForConflicts(bookingData.start_time, bookingData.end_time);
  if (hasConflict) {
    throw new Error("Este horário já está reservado. Por favor, escolha outro horário.");
  }

  // Generate a customer ID if one wasn't provided (já existente)
  let customerId = bookingData.customer_id;
  if (!customerId) {
    customerId = await generateCustomerId();
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
    customer_id: customerId,
    email: bookingData.email,
    phone: bookingData.phone,
    tenant_id: tenantId // Add tenant_id
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
