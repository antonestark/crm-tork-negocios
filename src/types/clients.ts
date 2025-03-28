export type ClientStatus = 'active' | 'inactive' | 'pending'; // Added 'pending' based on ClientsTable usage

export interface Client {
  id: string;
  company_name: string; // Nome Fantasia
  razao_social?: string; // Novo: Razão Social
  trading_name?: string;
  responsible?: string;
  room?: string;
  meeting_room_credits: number;
  status: string; // Should match ClientStatus ideally
  contract_start_date: string;
  contract_end_date: string;
  document?: string; // Novo: CNPJ/CPF/CAEPF
  birth_date?: string; // Novo: Data Nascimento (PF) - Consider using Date type if appropriate
  address?: string;
  email?: string;
  phone?: string;
  monthly_value?: number;
  notes?: string;
  tags?: string[]; // Novo: Tags
  created_at: string;
  updated_at: string;
}

export interface CreditUsage { // Manter esta interface inalterada
  id: string;
  client_id: string;
  date: string;
  duration: number;
  purpose?: string;
  participants?: string;
  created_at: string;
}
