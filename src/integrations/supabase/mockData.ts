
// This file contains mock data functions for development and testing
import type { User, UserStatus, Department, Permission, PermissionGroup } from '@/types/admin';

export const mockPermissionData = (): Permission[] => {
  return [
    {
      id: '1',
      code: 'users:read',
      name: 'Visualizar Usuários',
      description: 'Permite visualizar a lista de usuários e seus detalhes',
      module: 'users',
      resource_type: 'user',
      actions: ['read'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '2',
      code: 'users:write',
      name: 'Editar Usuários',
      description: 'Permite editar os detalhes dos usuários',
      module: 'users',
      resource_type: 'user',
      actions: ['write'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '3',
      code: 'departments:read',
      name: 'Visualizar Departamentos',
      description: 'Permite visualizar a estrutura de departamentos',
      module: 'departments',
      resource_type: 'department',
      actions: ['read'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '4',
      code: 'departments:write',
      name: 'Gerenciar Departamentos',
      description: 'Permite criar, editar e excluir departamentos',
      module: 'departments',
      resource_type: 'department',
      actions: ['write', 'create', 'delete'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '5',
      code: 'permissions:manage',
      name: 'Gerenciar Permissões',
      description: 'Permite controlar as permissões do sistema',
      module: 'security',
      resource_type: 'permission',
      actions: ['read', 'write', 'create', 'delete'],
      created_at: new Date().toISOString(),
      selected: false
    },
    {
      id: '6',
      code: 'reports:view',
      name: 'Visualizar Relatórios',
      description: 'Permite acessar os relatórios do sistema',
      module: 'reports',
      resource_type: 'report',
      actions: ['read'],
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
      name: 'Administradores',
      description: 'Grupo com todas as permissões administrativas',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected: false,
      permissions: mockPermissionData()
    },
    {
      id: '2',
      name: 'Gerentes de Departamento',
      description: 'Permissões para gerenciamento de departamentos específicos',
      is_system: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected: false,
      permissions: mockPermissionData().filter(p => p.module === 'departments')
    },
    {
      id: '3',
      name: 'Usuários Básicos',
      description: 'Permissões básicas para usuários comuns',
      is_system: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected: false,
      permissions: mockPermissionData().filter(p => p.actions.includes('read'))
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

// Mock activity logs data
export const mockActivityLogData = () => {
  return [
    {
      id: '1',
      user_id: '1',
      entity_type: 'user',
      entity_id: '2',
      action: 'update',
      details: { field: 'status', old: 'inactive', new: 'active' },
      ip_address: '192.168.1.1',
      created_at: new Date().toISOString(),
      severity: 'medium',
      category: 'security',
      metadata: { browser: 'Chrome', os: 'Windows' },
      user: { 
        first_name: 'John', 
        last_name: 'Doe', 
        profile_image_url: null 
      }
    },
    {
      id: '2',
      user_id: '1',
      entity_type: 'permission',
      entity_id: '3',
      action: 'create',
      details: { name: 'Novo Acesso', module: 'reports' },
      ip_address: '192.168.1.1',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      severity: 'low',
      category: 'system',
      metadata: { browser: 'Chrome', os: 'Windows' },
      user: { 
        first_name: 'John', 
        last_name: 'Doe', 
        profile_image_url: null 
      }
    },
    {
      id: '3',
      user_id: '2',
      entity_type: 'login',
      entity_id: null,
      action: 'login',
      details: { method: 'password' },
      ip_address: '192.168.1.2',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      severity: 'info',
      category: 'auth',
      metadata: { browser: 'Firefox', os: 'MacOS' },
      user: { 
        first_name: 'Jane', 
        last_name: 'Smith', 
        profile_image_url: null 
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
    },
    {
      id: '3',
      first_name: 'Robert',
      last_name: 'Johnson',
      role: 'manager',
      department_id: '1',
      phone: '555-123-4567',
      profile_image_url: null,
      active: true,
      status: 'active' as UserStatus,
      last_login: new Date(Date.now() - 2 * 86400000).toISOString(),
      settings: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
