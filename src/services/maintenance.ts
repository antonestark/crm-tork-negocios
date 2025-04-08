import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define a type for the maintenance record to include all properties
type MaintenanceRecord = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  frequency: string | null;
  assigned_to: string | null;
  scheduled_date: string;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
  area_id: string | null;
  service_areas: { name: string } | null;
  user?: { id: string; name: string }; // Make user optional with proper typing
};

export const fetchMaintenances = async () => {
  try {
    // Modified query to avoid joining the users table directly since there's no relationship defined
    const { data, error } = await supabase
      .from("maintenance_records")
      .select('id, title, type, frequency, scheduled_date, status, area_id, assigned_to, service_areas(name)');
    
    if (error) {
      toast.error("Erro ao carregar manutenções");
      throw error;
    }
    
    const fetched = data || [];
    
    // If we have assigned users, fetch them separately
    if (fetched.length > 0) {
      // Extract all non-null assigned_to IDs
      const userIds = fetched
        .map(record => record.assigned_to)
        .filter((id): id is string => id !== null);
      
      // If we have user IDs, fetch the user data
      if (userIds.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name")
          .in("id", userIds);
          
        if (!userError && userData) {
          // Create a map of user IDs to user objects for easy lookup
          const userMap: Record<string, { id: string; name: string }> = {};
          userData.forEach(user => {
            userMap[user.id] = user;
          });
          
          // Add user data to each maintenance record
          fetched.forEach(record => {
            if (record.assigned_to && userMap[record.assigned_to]) {
              // Add the user property to each record
              (record as any).user = userMap[record.assigned_to];
            }
          });
        }
      }
    }
    
    // Cast the fetched data to MaintenanceRecord[] type
    return fetched as unknown as MaintenanceRecord[];
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
