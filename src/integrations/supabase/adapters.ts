
import { User, Department, Permission, PermissionGroup, ActivityLog } from "@/types/admin";
import { Client } from "@/types/clients";
import { Json } from "@/integrations/supabase/types";

export const userAdapter = (data: any): User[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    first_name: item.name ? item.name.split(' ')[0] : "",
    last_name: item.name ? item.name.split(' ').slice(1).join(' ') : "",
    profile_image_url: item.profile_image_url || null,
    role: item.role || "user",
    department_id: item.department_id || null,
    phone: item.phone || null,
    active: item.active !== undefined ? item.active : true,
    status: item.status || "active",
    last_login: item.last_login || null,
    settings: item.settings || {},
    metadata: item.metadata || {},
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    department: item.department || null
  }));
};

export const clientAdapter = (data: any): Client[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    company_name: item.company_name || item.name || "",
    trading_name: item.trading_name || "",
    responsible: item.responsible || "",
    room: item.room || "",
    meeting_room_credits: item.meeting_room_credits ? parseInt(item.meeting_room_credits) : 0,
    status: item.status || "active",
    contract_start_date: item.contract_start_date || new Date().toISOString().split('T')[0],
    contract_end_date: item.contract_end_date || new Date().toISOString().split('T')[0],
    cnpj: item.cnpj || "",
    address: item.address || "",
    email: item.email || "",
    phone: item.phone || "",
    monthly_value: item.monthly_value || 0,
    notes: item.notes || "",
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString()
  }));
};

export const departmentAdapter = (data: any): Department[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    name: item.name || "",
    description: item.description || "",
    path: item.path || "/",
    level: item.level || 0,
    parent_id: item.parent_id || null,
    manager_id: item.manager_id || null,
    settings: item.settings || {},
    metadata: item.metadata || {},
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    _memberCount: item._memberCount || 0,
    manager: item.manager || null
  }));
};

export const permissionAdapter = (data: any): Permission[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    name: item.name || "",
    code: item.code || "",
    description: item.description || "",
    module: item.module || "",
    resource_type: item.resource_type || "",
    actions: item.actions || [],
    created_at: item.created_at || new Date().toISOString(),
    selected: item.selected || false
  }));
};

export const permissionGroupAdapter = (data: any): PermissionGroup[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    name: item.name || "",
    description: item.description || "",
    is_system: item.is_system || false,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    permissions: item.permissions || [],
    selected: item.selected || false
  }));
};

export const activityLogsAdapter = (data: any): ActivityLog[] => {
  if (!data) return [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  
  return data.map(item => ({
    id: item.id || "",
    user_id: item.user_id || null,
    entity_type: item.entity_type || "",
    entity_id: item.entity_id || null,
    action: item.action || "",
    details: item.details || null,
    ip_address: item.ip_address || null,
    severity: item.severity || "info",
    category: item.category || "system",
    created_at: item.created_at || new Date().toISOString(),
    user: item.user || null
  }));
};
