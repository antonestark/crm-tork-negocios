
import { toast } from '@/components/ui/use-toast';
import { User, Department } from '@/types/admin';
import { mockUserDepartmentRoleData } from '@/integrations/supabase/mockData';
import { userAdapter } from '@/integrations/supabase/adapters';
import { UserDepartmentRoleMember } from './DepartmentMembersList';

// Fetch department members
export const fetchDepartmentMembers = async (departmentId?: string): Promise<UserDepartmentRoleMember[]> => {
  try {
    // Since we don't have the actual table, we'll use mock data
    if (departmentId) {
      return mockUserDepartmentRoleData('', departmentId);
    }
    return [];
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

// Fetch available users
export const fetchAvailableUsers = async (): Promise<User[]> => {
  try {
    // For now, we'll just use mock data to simulate fetching users from Supabase
    const mockUsers = [{
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      profile_image_url: null,
      role: 'admin',
      department_id: null
    }, {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      profile_image_url: null,
      role: 'user',
      department_id: null
    }];
    
    return userAdapter(mockUsers);
  } catch (error) {
    console.error('Error fetching available users:', error);
    toast({
      title: 'Error',
      description: 'Failed to load users',
      variant: 'destructive',
    });
    return [];
  }
};

// Add a new member
export const addDepartmentMember = async (
  selectedUser: string, 
  department: Department,
  selectedRole: string,
  availableUsers: User[]
): Promise<UserDepartmentRoleMember | null> => {
  try {
    // Find the user to add
    const userToAdd = availableUsers.find(user => user.id === selectedUser);
    if (userToAdd) {
      const newMember = {
        id: `new-${Date.now()}`,
        user_id: selectedUser,
        department_id: department.id,
        role: selectedRole,
        start_date: new Date().toISOString(),
        end_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: userToAdd
      };
      
      toast({
        title: 'Success',
        description: 'Member added to department',
        variant: 'default',
      });
      
      return newMember;
    }
    return null;
  } catch (error) {
    console.error('Error adding member:', error);
    toast({
      title: 'Error',
      description: 'Failed to add member',
      variant: 'destructive',
    });
    return null;
  }
};

// Remove a member
export const removeDepartmentMember = async (userId: string): Promise<boolean> => {
  try {
    // Mock the API call
    toast({
      title: 'Success',
      description: 'Member removed from department',
      variant: 'default',
    });
    return true;
  } catch (error) {
    console.error('Error removing member:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove member',
      variant: 'destructive',
    });
    return false;
  }
};
