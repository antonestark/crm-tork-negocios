
// This file contains adapter functions to convert database responses to proper typed objects
import type { Json } from './types';
import type { User, UserStatus, Department } from '@/types/admin';

// Helper function to handle the additional fields from activity_logs
export const activityLogsAdapter = (data: any[]) => {
  return data.map(log => ({
    ...log,
    severity: log.severity || 'low',
    category: log.category || 'system',
    metadata: log.metadata || {}
  }));
};

// Helper function to adapt user data from database to match the User interface
export const userAdapter = (data: any[]): User[] => {
  return data.map(user => ({
    ...user,
    status: (user.status || 'active') as UserStatus,
    last_login: user.last_login || null,
    settings: user.settings || {},
    metadata: user.metadata || {}
  })) as User[];
};

// Helper function to adapt department data
export const departmentAdapter = (data: any[]): Department[] => {
  return data.map(dept => ({
    ...dept,
    path: dept.path || null,
    level: dept.level || 0,
    parent_id: dept.parent_id || null,
    manager_id: dept.manager_id || null,
    settings: dept.settings || {},
    metadata: dept.metadata || {},
    manager: Array.isArray(dept.manager) && dept.manager.length > 0 
      ? dept.manager[0] 
      : { first_name: '', last_name: '' }
  })) as Department[];
};

// Helper function to adapt user department roles
export const userDepartmentRoleAdapter = (data: any[]) => {
  return data.map(role => ({
    id: role.id || '',
    user_id: role.user_id || '',
    department_id: role.department_id || '',
    role: role.role || 'member',
    start_date: role.start_date || null,
    end_date: role.end_date || null,
    created_at: role.created_at || new Date().toISOString(),
    updated_at: role.updated_at || new Date().toISOString(),
    user: role.user ? {
      ...role.user,
      status: role.user.status || 'active',
      last_login: role.user.last_login || null,
      settings: role.user.settings || {},
      metadata: role.user.metadata || {}
    } : null
  }));
};

// Helper function to adapt permission data
export const permissionAdapter = (data: any[]) => {
  return data.map(perm => ({
    id: perm.id || '',
    code: perm.code || '',
    name: perm.name || '',
    description: perm.description || null,
    module: perm.module || '',
    resource_type: perm.resource_type || '',
    actions: perm.actions || [],
    created_at: perm.created_at || new Date().toISOString(),
    selected: perm.selected || false
  }));
};

// Helper function to adapt permission group data
export const permissionGroupAdapter = (data: any[]) => {
  return data.map(group => ({
    id: group.id || '',
    name: group.name || '',
    description: group.description || null,
    is_system: group.is_system || false,
    created_at: group.created_at || new Date().toISOString(),
    updated_at: group.updated_at || new Date().toISOString(),
    selected: group.selected || false,
    permissions: group.permissions || []
  }));
};

// Helper function to adapt user permission data
export const userPermissionAdapter = (data: any[]) => {
  return data.map(up => ({
    id: up.id || '',
    user_id: up.user_id || '',
    permission_id: up.permission_id || '',
    granted_by: up.granted_by || null,
    valid_until: up.valid_until || null,
    created_at: up.created_at || new Date().toISOString(),
    permission: up.permission ? {
      id: up.permission.id || '',
      code: up.permission.code || '',
      name: up.permission.name || '',
      description: up.permission.description || null,
      module: up.permission.module || '',
      resource_type: up.permission.resource_type || '',
      actions: up.permission.actions || [],
      created_at: up.permission.created_at || new Date().toISOString()
    } : null
  }));
};

// Helper function to adapt user permission group data
export const userPermissionGroupAdapter = (data: any[]) => {
  return data.map(upg => ({
    id: upg.id || '',
    user_id: upg.user_id || '',
    group_id: upg.group_id || '',
    created_at: upg.created_at || new Date().toISOString(),
    group: upg.group || null
  }));
};
