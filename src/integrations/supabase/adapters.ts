// This file contains adapters for converting data from the Supabase database to the app's types

import { User, Department, Permission, PermissionGroup, ActivityLog } from "@/types/admin";
import { Client } from "@/types/clients";

export const userAdapter = (data: any[]): User[] => {
  return data.map(item => ({
    id: item.id,
    first_name: item.name?.split(' ')[0] || '',
    last_name: item.name?.split(' ').slice(1).join(' ') || '',
    profile_image_url: item.profile_image_url || null,
    role: item.role,
    department_id: item.department_id,
    phone: item.phone || null,
    email: item.email || '', 
    active: item.active || false,
    status: item.status || 'inactive',
    last_login: item.last_login,
    settings: item.settings || {},
    metadata: item.metadata || {},
    created_at: item.created_at,
    updated_at: item.updated_at,
    department: item.department ? departmentAdapter([item.department])[0] : null,
  }));
};

export const clientAdapter = (data: any[]): Client[] => {
  return data.map(item => ({
    id: item.id,
    company_name: item.company_name || '',
    trading_name: item.trading_name || '',
    responsible: item.responsible || '',
    room: item.room || '',
    meeting_room_credits: item.meeting_room_credits || 0,
    status: item.status || 'active',
    contract_start_date: item.contract_start_date || '',
    contract_end_date: item.contract_end_date || '',
    cnpj: item.cnpj || '',
    address: item.address || '',
    email: item.email || '',
    phone: item.phone || '',
    monthly_value: item.monthly_value || 0,
    notes: item.notes || '',
    created_at: item.created_at || '',
    updated_at: item.updated_at || ''
  }));
};

export const departmentAdapter = (data: any[]): Department[] => {
  return data.map(item => ({
    id: item.id?.toString() || '',
    name: item.name || '',
    description: item.description || '',
    path: item.path || '',
    level: item.level || 0,
    parent_id: item.parent_id,
    manager_id: item.manager_id,
    settings: item.settings || {},
    metadata: item.metadata || {},
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    _memberCount: item._memberCount || 0,
    manager: item.manager ? {
      first_name: item.manager.first_name || item.manager.name?.split(' ')[0] || '',
      last_name: item.manager.last_name || item.manager.name?.split(' ').slice(1).join(' ') || ''
    } : null
  }));
};

export const permissionAdapter = (data: any[]): Permission[] => {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    description: item.description || '',
    module: item.module,
    resource_type: item.resource_type,
    actions: item.actions,
    created_at: item.created_at,
    selected: false
  }));
};

export const permissionGroupAdapter = (data: any[]): PermissionGroup[] => {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    is_system: item.is_system || false,
    created_at: item.created_at,
    updated_at: item.updated_at,
    permissions: item.permissions ? permissionAdapter(item.permissions) : [],
    selected: false
  }));
};

export const activityLogsAdapter = (data: any[]): ActivityLog[] => {
  return data.map(item => ({
    id: item.id,
    user_id: item.user_id,
    entity_type: item.entity_type,
    entity_id: item.entity_id,
    action: item.action,
    details: item.details || {},
    ip_address: item.ip_address,
    severity: item.severity || 'info',
    category: item.category || 'system',
    created_at: item.created_at,
    user: item.user ? userAdapter([item.user])[0] : null
  }));
};
