
import { Department, User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface UserDepartmentRoleMember {
  user_id: string;
  user_name: string;
  role: string;
  department_id: string;
  department_name: string;
  joined_at: string;
}

// Mock data function to use until we have real backend implementation
const mockUserDepartmentRoleData = (): UserDepartmentRoleMember[] => [
  {
    user_id: "1",
    user_name: "John Doe",
    role: "manager",
    department_id: "1",
    department_name: "Engineering",
    joined_at: new Date().toISOString()
  },
  {
    user_id: "2",
    user_name: "Jane Smith",
    role: "member",
    department_id: "1",
    department_name: "Engineering",
    joined_at: new Date().toISOString()
  }
];

export const fetchDepartmentMembers = async (departmentId: string): Promise<UserDepartmentRoleMember[]> => {
  try {
    // For now, return mock data
    // In a real implementation, we would fetch from Supabase
    return mockUserDepartmentRoleData().filter(member => member.department_id === departmentId);
  } catch (error) {
    console.error('Error fetching department members:', error);
    toast({
      title: 'Error',
      description: 'Failed to load department members',
      variant: 'destructive',
    });
    return [];
  }
};

export const fetchAvailableUsers = async (): Promise<User[]> => {
  try {
    // In a real implementation, we would fetch users who aren't already in the department
    // For now, return mock data
    return [{
      id: "3",
      first_name: "Bob",
      last_name: "Johnson",
      role: "user",
      department_id: null,
      email: "bob@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }];
  } catch (error) {
    console.error('Error fetching available users:', error);
    toast({
      title: 'Error',
      description: 'Failed to load available users',
      variant: 'destructive',
    });
    return [];
  }
};

export const addDepartmentMember = async (
  userId: string, 
  department: Department, 
  role: string, 
  availableUsers: any[]
): Promise<UserDepartmentRoleMember | null> => {
  try {
    // Find the user in the available users list
    const user = availableUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, we would add the user to the department in Supabase
    
    // Return the new member object
    return {
      user_id: userId,
      user_name: `${user.first_name} ${user.last_name}`,
      role: role,
      department_id: department.id,
      department_name: department.name,
      joined_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding department member:', error);
    toast({
      title: 'Error',
      description: 'Failed to add member to department',
      variant: 'destructive',
    });
    return null;
  }
};

export const removeDepartmentMember = async (userId: string): Promise<boolean> => {
  try {
    // In a real implementation, we would remove the user from the department in Supabase
    
    return true;
  } catch (error) {
    console.error('Error removing department member:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove member from department',
      variant: 'destructive',
    });
    return false;
  }
};
