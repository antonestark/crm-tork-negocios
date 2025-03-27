
export interface Company {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  settings: CompanySettings;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  user_limit?: number;
  connection_limit?: number;
  api_token?: string;
  [key: string]: any;
}

export interface CompanyUser {
  id: string;
  company_id: string;
  user_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}
