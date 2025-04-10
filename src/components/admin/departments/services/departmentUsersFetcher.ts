
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DepartmentUser, DepartmentWithUsers } from "../types/departmentUserTypes";

/**
 * Fetches users who belong to a specific department
 * @param departmentId - The ID of the department
 * @returns Promise with department and its users
 */
export const fetchDepartmentUsers = async (departmentId: number): Promise<DepartmentWithUsers> => {
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

    // Fetch users who are in this department directly
    const { data: directUsers, error: directUsersError } = await supabase
      .from('users')
      .select('id, name, email, department_id')
      .eq('department_id', departmentId);

    if (directUsersError) {
      console.error("Error fetching direct users:", directUsersError);
    }

    // Get list of users who belong to the department via the department_users table
    const { data: departmentUserIds, error: departmentUserIdsError } = await supabase
      .from('department_users')
      .select('user_id')
      .eq('department_id', departmentId);
      
    if (departmentUserIdsError) {
      console.error("Failed to fetch department user IDs:", departmentUserIdsError);
      throw departmentUserIdsError;
    }
    
    // Fetch user details if we have any user IDs
    let usersFromRelation: DepartmentUser[] = [];
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
      
      // Make sure to handle optional email in the resulting data
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
