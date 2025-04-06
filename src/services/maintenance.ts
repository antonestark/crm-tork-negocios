
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const fetchMaintenances = async () => {
  try {
    // Modified query to avoid joining the users table directly since there's no relationship defined
    const { data, error } = await supabase
      .from("maintenance_records")
      .select(`
        *,
        service_areas(name)
      `)
      .order("scheduled_date", { ascending: true });
    
    if (error) {
      toast.error("Erro ao carregar manutenções");
      throw error;
    }
    
    // If we have assigned users, fetch them separately
    if (data && data.length > 0) {
      // Extract all non-null assigned_to IDs
      const userIds = data
        .map(record => record.assigned_to)
        .filter(id => id !== null);
      
      // If we have user IDs, fetch the user data
      if (userIds.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name")
          .in("id", userIds);
          
        if (!userError && userData) {
          // Create a map of user IDs to names for easy lookup
          const userMap = userData.reduce((map, user) => {
            map[user.id] = user;
            return map;
          }, {});
          
          // Add user data to each maintenance record
          data.forEach(record => {
            if (record.assigned_to && userMap[record.assigned_to]) {
              record.users = userMap[record.assigned_to];
            }
          });
        }
      }
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error);
    throw error;
  }
};

export const fetchAreas = async () => {
  try {
    console.log("Fetching service areas for maintenance form...");
    
    const { data, error } = await supabase
      .from("service_areas")
      .select("id, name")
      .eq("status", "active")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Error fetching service areas:", error);
      throw error;
    }
    
    console.log("Service areas fetched successfully:", data);
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    // Return empty array instead of throwing to avoid breaking the UI
    return [];
  }
};

export const createMaintenance = async (maintenanceData: any) => {
  try {
    const { error } = await supabase
      .from("maintenance_records")
      .insert(maintenanceData);
      
    if (error) {
      console.error("Error creating maintenance:", error);
      toast.error("Falha ao criar manutenção");
      throw error;
    }
    
    toast.success("Manutenção agendada com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao criar manutenção:", error);
    throw error;
  }
};
