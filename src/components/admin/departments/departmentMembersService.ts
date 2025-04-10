import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatUserFromDatabase } from "@/utils/user-formatter";
import { User } from "@/types/admin";

// Define User type for departmentMembersService
interface User {
  id: string;
  name: string;
  email: string;  // Making email required here
  department_id?: number | null;  // Making department_id optional
}

// Function to fetch department users
export const fetchDepartmentUsers = async (departmentId: number) => {
  try {
    // First get the department
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (deptError) {
      throw deptError;
    }

    // Fetch users who are in this department
    // Directly from the users table first
    const { data: directUsers, error: directUsersError } = await supabase
      .from('users')
      .select('id, name, email, department_id')
      .eq('department_id', departmentId);

    if (directUsersError) {
      console.error("Error fetching direct users:", directUsersError);
    }

    // Get list of users who belong to the department via the department_users table
    // We can't use RPC since the function doesn't exist, so use a manual join approach
    const { data: departmentUserIds, error: departmentUserIdsError } = await supabase
      .from('department_users')
      .select('user_id')
      .eq('department_id', departmentId);
      
    if (departmentUserIdsError) {
      console.error("Failed to fetch department user IDs:", departmentUserIdsError);
      throw departmentUserIdsError;
    }
    
    // Fetch user details if we have any user IDs
    let usersFromRelation: User[] = [];
    if (departmentUserIds && departmentUserIds.length > 0) {
      const userIds = departmentUserIds.map(item => item.user_id);
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, department_id')
        .in('id', userIds);
        
      if (usersError) {
        console.error("Error fetching user details:", usersError);
        throw usersError;
      }
      
      // Make sure to handle optional email in the resulting data - always provide empty string
      usersFromRelation = (usersData || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email || '',  // Ensure email is always a string
        department_id: user.department_id
      }));
    }
    
    // Combine results - make sure all users have email as string
    const combinedUsers = (directUsers || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || '',  // Ensure email is always a string
      department_id: user.department_id || null  // Allow department_id to be null
    }));
    
    // Add users from relation table, avoiding duplicates
    for (const user of usersFromRelation) {
      if (!combinedUsers.some(u => u.id === user.id)) {
        combinedUsers.push(user);
      }
    }
    
    return {
      department,
      users: combinedUsers
    };
  } catch (error) {
    console.error("Error fetching department users:", error);
    toast.error("Falha ao carregar usuários do departamento");
    return { department: null, users: [] };
  }
};

// Function to fetch available users (those not in the department)
export const fetchAvailableUsers = async (departmentId?: number) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, department_id')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    // Ensure all users have the email property as a non-optional string
    const usersWithEmail = (data || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || '',  // Ensure email is always a string, never undefined
      department_id: user.department_id
    }));
    
    // If we have a department ID, filter out users already in that department
    if (departmentId) {
      const departmentResult = await fetchDepartmentUsers(departmentId);
      const deptUserIds = departmentResult.users.map(user => user.id);
      return usersWithEmail.filter(user => !deptUserIds.includes(user.id)) || [];
    }
    
    return usersWithEmail || [];
  } catch (error) {
    console.error("Error fetching available users:", error);
    toast.error("Falha ao carregar usuários disponíveis");
    return [];
  }
};

// Update the addDepartmentMember function to handle optional department_id
export const addDepartmentMember = async (userId: string, department: any, role: string, availableUsers: User[]) => {
  try {
    // Convert department.id to number if it's a string
    const departmentId = typeof department.id === 'string' ? parseInt(department.id, 10) : department.id;
    
    const { error: insertError } = await supabase
      .from('department_users')
      .insert({ 
        user_id: userId, 
        department_id: departmentId 
      });
      
    if (insertError) {
      throw insertError;
    }
    
    // Find the user in available users to return complete data
    const user = availableUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found in available users");
    }
    
    // Create member object with required fields
    const newMember = {
      id: crypto.randomUUID(),
      user_id: userId,
      department_id: department.id.toString(),
      role: role,
      start_date: new Date().toISOString(),
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: user.id,
        first_name: user.name?.split(' ')[0] || '',
        last_name: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email
      }
    };
    
    toast.success("Membro adicionado ao departamento com sucesso");
    return newMember;
  } catch (error) {
    console.error("Error adding member to department:", error);
    toast.error("Falha ao adicionar membro ao departamento");
    return null;
  }
};

// Remove department member
export const removeDepartmentMember = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('department_users')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    toast.success("Usuário removido do departamento com sucesso");
    return true;
  } catch (error) {
    console.error("Error removing user from department:", error);
    toast.error("Falha ao remover usuário do departamento");
    return false;
  }
};
