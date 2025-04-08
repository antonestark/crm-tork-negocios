
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define User type for departmentMembersService
interface User {
  id: string;
  name: string;
  email?: string;
  department_id?: number;
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
    // We can perform this query since we know the table exists in the database schema
    const { data: departmentUsersData, error: departmentUsersError } = await supabase
      .rpc('get_department_users', { department_id: departmentId });

    if (departmentUsersError) {
      // If RPC function not available, use a workaround
      // We'll fetch all user IDs from department_users table then get user details
      console.error("Error with RPC call, falling back to manual joining:", departmentUsersError);
      
      // First get user IDs for this department
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
        
        usersFromRelation = usersData || [];
      }
      
      // Combine results
      const combinedUsers = [...(directUsers || [])];
      
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
    } else {
      // RPC call was successful, use its results
      return {
        department,
        users: departmentUsersData || []
      };
    }
  } catch (error) {
    console.error("Error fetching department users:", error);
    toast.error("Falha ao carregar usuários do departamento");
    return { department: null, users: [] };
  }
};

// Function to add user to department
export const addUserToDepartment = async (userId: string, departmentId: number) => {
  try {
    // Check if the relationship already exists
    const { data: existingRelation, error: checkError } = await supabase
      .from('department_users')
      .select('id')
      .eq('user_id', userId)
      .eq('department_id', departmentId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing relation:", checkError);
      throw checkError;
    }
    
    if (existingRelation) {
      // Already exists, no need to add
      toast.info("Usuário já pertence a este departamento");
      return true;
    }
    
    // Create the relation
    const { error: insertError } = await supabase
      .from('department_users')
      .insert({ user_id: userId, department_id: departmentId });
      
    if (insertError) {
      throw insertError;
    }
    
    toast.success("Usuário adicionado ao departamento com sucesso");
    return true;
  } catch (error) {
    console.error("Error adding user to department:", error);
    toast.error("Falha ao adicionar usuário ao departamento");
    return false;
  }
};

// Function to remove user from department
export const removeUserFromDepartment = async (userId: string, departmentId: number) => {
  try {
    // Remove the relation
    const { error } = await supabase
      .from('department_users')
      .delete()
      .eq('user_id', userId)
      .eq('department_id', departmentId);
      
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
