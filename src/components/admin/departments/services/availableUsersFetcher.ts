
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DepartmentUser } from "../types/departmentUserTypes";
import { fetchDepartmentUsers } from "./departmentUsersFetcher";

export const fetchAvailableUsers = async (departmentId?: number): Promise<DepartmentUser[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, department_id')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    const usersWithEmail = (data || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || '',
      department_id: user.department_id
    }));
    
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
