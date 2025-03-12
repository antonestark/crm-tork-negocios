
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ServiceArea = {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  responsible_id?: string;
  task_count: number;
  pending_tasks: number;
  delayed_tasks: number;
};

export const useServiceAreasData = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchServiceAreas();
    
    // Set up a realtime subscription for area updates
    const subscription = supabase
      .channel('service_areas_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_areas' 
      }, () => {
        fetchServiceAreas();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchServiceAreas = async () => {
    try {
      setLoading(true);
      
      // Fetch service areas with task counts
      const { data, error } = await supabase
        .from("service_areas")
        .select(`
          *,
          services(
            id,
            status
          )
        `)
        .order("name", { ascending: true });
      
      if (error) throw error;
      
      // Process the data to include task counts
      const processedAreas: ServiceArea[] = data.map(area => {
        const services = area.services || [];
        const totalTasks = services.length;
        const pendingTasks = services.filter(s => s.status === 'pending').length;
        const delayedTasks = services.filter(s => s.status === 'delayed').length;
        
        return {
          id: area.id,
          name: area.name,
          type: area.type || 'common',
          description: area.description,
          status: area.status || 'active',
          responsible_id: area.responsible_id,
          task_count: totalTasks,
          pending_tasks: pendingTasks,
          delayed_tasks: delayedTasks
        };
      });
      
      setAreas(processedAreas);
    } catch (err) {
      console.error("Error fetching service areas:", err);
      setError(err as Error);
      toast.error("Erro ao carregar áreas de serviço");
    } finally {
      setLoading(false);
    }
  };

  const createServiceArea = async (areaData: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
    try {
      const { data, error } = await supabase
        .from("service_areas")
        .insert([{
          name: areaData.name,
          type: areaData.type,
          description: areaData.description,
          status: areaData.status,
          responsible_id: areaData.responsible_id
        }])
        .select();
      
      if (error) throw error;
      
      toast.success("Área de serviço criada com sucesso");
      fetchServiceAreas();
      return data[0];
    } catch (err) {
      console.error("Error creating service area:", err);
      toast.error("Falha ao criar área de serviço");
      throw err;
    }
  };

  const updateServiceArea = async (id: string, areaData: Partial<ServiceArea>) => {
    try {
      const { error } = await supabase
        .from("service_areas")
        .update({
          name: areaData.name,
          type: areaData.type,
          description: areaData.description,
          status: areaData.status,
          responsible_id: areaData.responsible_id
        })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Área de serviço atualizada com sucesso");
      fetchServiceAreas();
      return true;
    } catch (err) {
      console.error("Error updating service area:", err);
      toast.error("Falha ao atualizar área de serviço");
      return false;
    }
  };

  return {
    areas,
    loading,
    error,
    fetchServiceAreas,
    createServiceArea,
    updateServiceArea
  };
};
