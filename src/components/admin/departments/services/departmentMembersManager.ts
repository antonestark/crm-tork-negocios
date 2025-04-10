
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DepartmentUser, DepartmentMember } from "../types/departmentUserTypes";

/**
 * Adds a user to a department
 * @param userId - ID of the user to add
 * @param department - Department object to add the user to
 * @param role - Role of the user in the department
 * @param availableUsers - List of available users to find user details
 * @returns Promise with the new department member or null if failed
 */
export const addDepartmentMember = async (
  userId: string, 
  department: any, 
  role: string, 
  availableUsers: DepartmentUser[]
): Promise<DepartmentMember | null> => {
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
    const newMember: DepartmentMember = {
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

/**
 * Removes a user from a department
 * @param userId - ID of the user to remove
 * @returns Promise with boolean indicating success
 */
export const removeDepartmentMember = async (userId: string): Promise<boolean> => {
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
