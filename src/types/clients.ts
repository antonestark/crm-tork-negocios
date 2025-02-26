
export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  company: string;
  responsible: string;
  room: string;
  credits: number;
  status: ClientStatus;
  contract_date: string;
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
