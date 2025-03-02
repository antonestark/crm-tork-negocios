
// This file contains mock data functions for development and testing
import type { User, UserStatus, Department, Permission, PermissionGroup } from '@/types/admin';

// Add enhanced mockPermissionData function to match both Permission and UserPermission types
export const mockPermissionData = (): Permission[] => {
  return [
    {
      id: '1',
      code: 'users:read',
      name: 'View Users',
      description: 'Can view user list and details',
      module: 'users',
      resource_type: 'user',
      actions: ['read'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '2',
      code: 'users:write',
      name: 'Edit Users',
      description: 'Can edit user details',
      module: 'users',
      resource_type: 'user',
      actions: ['write'],
      created_at: new Date().toISOString(),
      selected: false
    }
  ];
};

// Add enhanced mockUserPermissionData with complete shape
export const mockUserPermissionData = (userId = '1') => {
  const permissions = mockPermissionData();
  return permissions.map(permission => ({
    id: `up-${permission.id}`,
    user_id: userId,
    permission_id: permission.id,
    granted_by: null,
    valid_until: null,
    created_at: new Date().toISOString(),
    permission: permission
  }));
};

// Mocking DepartmentTreeView props data
export const mockDepartmentTreeViewProps = () => {
  return {
    departments: [],
    onEdit: (department: any) => {},
    onDelete: (department: any) => {},
    onViewMembers: (department: any) => {},
    loading: false
  };
};

// Mock data functions for tables that don't exist yet
export const mockPermissionGroupData = (): PermissionGroup[] => {
  return [
    {
      id: '1',
      name: 'User Management',
      description: 'Permissions for managing users',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected: false,
      permissions: []
    },
    {
      id: '2',
      name: 'Department Management',
      description: 'Permissions for managing departments',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected: false,
      permissions: []
    }
  ];
};

export const mockUserDepartmentRoleData = (userId?: string, departmentId?: string) => {
  return [
    {
      id: '1',
      user_id: userId || '1',
      department_id: departmentId || '1',
      role: 'member',
      start_date: new Date().toISOString(),
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: userId || '1',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        active: true,
        status: 'active' as UserStatus,
        last_login: null,
        profile_image_url: null,
        phone: null,
        department_id: departmentId || '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        settings: {},
        metadata: {}
      }
    }
  ];
};

// Mock user data function that includes all required fields with correct types
export const mockUserData = (): User[] => {
  return [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      department_id: '1',
      phone: '123-456-7890',
      profile_image_url: null,
      active: true,
      status: 'active' as UserStatus,
      last_login: new Date().toISOString(),
      settings: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'user',
      department_id: '2',
      phone: '987-654-3210',
      profile_image_url: null,
      active: true,
      status: 'active' as UserStatus,
      last_login: new Date().toISOString(),
      settings: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
