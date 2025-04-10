
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DepartmentUser } from "../types/departmentUserTypes";
import { fetchDepartmentUsers } from "./departmentUsersFetcher";

/**
 * Fetches users who are available to be added to a department
 * @param departmentId - Optional ID of the department to exclude its users
 * @returns Promise with available users
 */
export const fetchAvailableUsers = async (departmentId?: number): Promise<DepartmentUser[]> => {
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
