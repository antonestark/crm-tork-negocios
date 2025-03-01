
export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  company_name: string;
  trading_name?: string;
  responsible?: string;
  room?: string;
  meeting_room_credits: number;
  status: string;
  contract_start_date: string;
  contract_end_date: string;
  cnpj?: string;
  address?: string;
  email?: string;
  phone?: string;
  monthly_value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditUsage {
  id: string;
  client_id: string;
  date: string;
  duration: number;
  purpose?: string;
  participants?: string;
  created_at: string;
}
