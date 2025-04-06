
import { Department, User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { UserDepartmentRoleMember } from './DepartmentMembersList';

// Mock user data for testing
const mockUsers = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    profile_image_url: null,
    role: 'admin',
    department_id: 1,
    phone: '123-456-7890',
    active: true,
    status: 'active',
    last_login: null,
    settings: {},
    metadata: {},
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_image_url: null,
    role: 'user',
    department_id: 2,
    phone: '987-654-3210',
    active: true,
    status: 'active',
    last_login: null,
    settings: {},
    metadata: {},
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
  }
];

// Mock department members
const mockDepartmentMembers: UserDepartmentRoleMember[] = [
  {
    id: '101',
    user_id: '1',
    department_id: '1',
    role: 'admin',
    start_date: '2023-01-01T00:00:00Z',
    end_date: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    user: mockUsers[0] as User
  },
  {
    id: '102',
    user_id: '2',
    department_id: '1',
    role: 'member',
    start_date: '2023-01-01T00:00:00Z',
    end_date: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    user: mockUsers[1] as User
  }
];

// Fetch department members
export const fetchDepartmentMembers = async (departmentId: string): Promise<UserDepartmentRoleMember[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('department_id', departmentId);

  if (error) {
    console.error('Error fetching department members:', error);
    return [];
  }

  return data.map(user => ({
    id: user.id,
    user_id: user.id,
    department_id: departmentId,
    role: user.role || 'member',
    start_date: null,
    end_date: null,
    created_at: user.created_at,
    updated_at: user.updated_at,
    user: user
  }));
};

// Fetch available users
export const fetchAvailableUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching available users:', error);
    return [];
  }

  return data;
};

// Add a member to a department
export const addDepartmentMember = async (
  userId: string,
  department: Department,
  role: string,
  availableUsers: any[]
): Promise<UserDepartmentRoleMember | null> => {
  console.log(`Adding user ${userId} to department ${department.id} as ${role}`);
  
  // Find user from available users
  const user = availableUsers.find(u => u.id === userId);
  if (!user) return null;
  
  // Create new member object
  const newMember: UserDepartmentRoleMember = {
    id: `${Date.now()}`, // Generate a unique ID
    user_id: userId,
      department_id: department.id.toString(),
    role: role,
    start_date: new Date().toISOString(),
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image_url: user.profile_image_url,
      role: user.role,
      department_id: Number(department.id),
      phone: user.phone,
      active: user.active,
      status: user.status,
      last_login: user.last_login,
      settings: user.settings || {},
      metadata: user.metadata || {},
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
  
  return newMember;
};

// Remove a member from a department
export const removeDepartmentMember = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .update({ department_id: null })
    .eq('id', userId);

  if (error) {
    console.error('Error removing department member:', error);
    return false;
  }

  return true;
};
