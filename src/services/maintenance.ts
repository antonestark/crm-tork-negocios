
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const fetchMaintenances = async () => {
  try {
    const { data, error } = await supabase
      .from("maintenance_records")
      .select(`
        *,
        service_areas(name),
        users:assigned_to(name)
      `)
      .order("scheduled_date", { ascending: true });
    
    if (error) {
      toast.error("Erro ao carregar manutenções");
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error);
    throw error;
  }
};

export const fetchAreas = async () => {
  try {
    const { data, error } = await supabase
      .from("service_areas")
      .select("id, name")
      .eq("status", "active")
      .order("name", { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    throw error;
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
