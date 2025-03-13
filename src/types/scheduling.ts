
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
