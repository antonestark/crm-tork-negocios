export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  profile_image_url: string | null;
  role: string;
  department_id: number | null;
  phone: string | null;
  active: boolean;
  status: string;
  last_login: string | null;
  settings: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  department?: Department | null;
  // Added client fields
  company_name?: string;
  trading_name?: string;
  responsible?: string;
  room?: string;
  meeting_room_credits?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  cnpj?: string;
  address?: string;
  monthly_value?: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  path: string;
  level: number;
  parent_id: string | null;
  manager_id: string | null;
  settings: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  _memberCount: number;
  manager?: {
    first_name: string;
    last_name: string;
  } | null;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  resource_type: string;
  actions: string[];
  created_at: string;
  selected: boolean;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
  selected: boolean;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  details: Record<string, any> | null;
  ip_address: string | null;
  severity: string;
  category: string;
  created_at: string;
  user?: User | null;
}

export interface Booking {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  client_id?: string;
  client?: { company_name: string } | null;
  user_id?: string; // Add user_id for referencing users instead of clients
  user?: User | null; // Add user reference
}

export interface ServiceArea {
  id: string;
  name: string;
  description: string | null;
  responsible_id: string | null;
  status: string | null;
  type: string | null;
  created_at: string | null;
  updated_at: string | null;
  responsible?: User | null;
}

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending';

export type LeadStatus = 'qualificado' | 'neutro' | 'não qualificado';

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  notes: string | null;
  status: LeadStatus | string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  assignedUser?: User;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string | null;
  action: string;
  details: Record<string, any> | null;
  created_at: string;
  user?: User | null;
}
