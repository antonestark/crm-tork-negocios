
import { User, Department } from "@/types/admin";
import { Client } from "@/types/clients";
import { Json } from "@/integrations/supabase/types";

export const userAdapter = (data: any): User => {
  return {
    id: data.id || "",
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    profile_image_url: data.profile_image_url || null,
    role: data.role || "user",
    department_id: data.department_id || null,
    phone: data.phone || null,
    active: data.active !== undefined ? data.active : true,
    status: data.status || "active",
    last_login: data.last_login || null,
    settings: data.settings || {},
    metadata: data.metadata || {},
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    department: data.department || null
  };
};

export const clientAdapter = (data: any): Client => {
  return {
    id: data.id || "",
    company_name: data.name || "",
    trading_name: data.trading_name || "",
    responsible: data.responsible || "",
    room: data.room || "",
    meeting_room_credits: data.monthly_hours_limit ? parseInt(data.monthly_hours_limit) : 0,
    status: data.status || "active",
    contract_start_date: data.contract_start_date || new Date().toISOString().split('T')[0],
    contract_end_date: data.contract_end_date || new Date().toISOString().split('T')[0],
    cnpj: data.cnpj || "",
    address: data.address || "",
    email: data.email || "",
    phone: data.phone || "",
    monthly_value: data.monthly_value || 0,
    notes: data.notes || "",
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
