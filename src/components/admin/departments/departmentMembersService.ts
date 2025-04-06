
import { Department, User, UserDepartmentRoleMember } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

// Fetch department members
export const fetchDepartmentMembers = async (departmentId: string): Promise<UserDepartmentRoleMember[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('department_id', departmentId);

    if (error) {
      console.error('Error fetching department members:', error);
      return [];
    }

    return data.map(user => ({
      id: `${user.id}-${departmentId}`, // Create a composite ID
      user_id: user.id,
      department_id: departmentId,
      role: user.role || 'member',
      start_date: null,
      end_date: null,
      created_at: user.created_at,
      updated_at: user.updated_at,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_image_url: user.profile_image_url,
        role: user.role,
        department_id: user.department_id,
        status: user.status
      }
    }));
  } catch (error) {
    console.error('Unexpected error fetching department members:', error);
    return [];
  }
};

// Fetch available users
export const fetchAvailableUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching available users:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching available users:', error);
    return [];
  }
};

// Add a member to a department
export const addDepartmentMember = async (
  userId: string,
  department: Department,
  role: string,
  availableUsers: User[]
): Promise<UserDepartmentRoleMember | null> => {
  console.log(`Adding user ${userId} to department ${department.id} as ${role}`);
  
  try {
    // Find user from available users
    const user = availableUsers.find(u => u.id === userId);
    if (!user) return null;
    
    // Update the user's department_id
    const { error } = await supabase
      .from('users')
      .update({ 
        department_id: Number(department.id),
        role: role 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error adding member to department:', error);
      return null;
    }
    
    // Create new member object
    const newMember: UserDepartmentRoleMember = {
      id: `${userId}-${department.id}`, // Create a composite ID
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
        role: role,
        department_id: Number(department.id),
        status: user.status
      }
    };
    
    return newMember;
  } catch (error) {
    console.error('Unexpected error adding department member:', error);
    return null;
  }
};

// Remove a member from a department
export const removeDepartmentMember = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ department_id: null })
      .eq('id', userId);

    if (error) {
      console.error('Error removing department member:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error removing department member:', error);
    return false;
  }
};
