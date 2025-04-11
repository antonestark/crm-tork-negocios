
export type BookingEvent = {
  id: string;
  title: string;
  client?: { company_name: string } | null;
  client_id?: string | null;
  start_time: string;
  end_time: string;
  status: string;
  date: string;
  user_id?: string | null;
  user_name?: string | null;
  description?: string | null;
  location?: string | null;
  customer_id?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type BookingRequest = Omit<BookingEvent, 'id' | 'date'>;

// Tipos para as novas tabelas de configuração
export type SchedulingSettings = {
  id: number;
  slot_duration_minutes: number;
  min_advance_booking_hours: number;
  max_advance_booking_days: number;
  created_at: string;
  updated_at: string;
};

export type WeeklyAvailabilityRule = {
  id: number;
  day_of_week: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  start_time: string; // Formato HH:MM:SS
  end_time: string; // Formato HH:MM:SS
  is_available: boolean;
  created_at: string;
  updated_at: string;
};
