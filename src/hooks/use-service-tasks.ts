
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ServiceTask = {
  id: string;
  area: string;
  task: string;
  status: "completed" | "ongoing" | "delayed";
  time: string;
};

// Define interface for RPC results
interface RecentServicesResult {
  id?: string | number;
  area_id?: string;
  title?: string;
  status?: string;
  updated_at?: string;
}

export const useServiceTasks = () => {
  const [tasks, setTasks] = useState<ServiceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTasks();
    
    // Set up a realtime subscription for service updates
    const subscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, () => {
        fetchTasks();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Use a direct SQL query to fetch the latest services with type assertion
      const { data: servicesData, error: servicesError } = await supabase
        .rpc('get_recent_services') as unknown as { data: RecentServicesResult[] | null, error: any };
      
      if (servicesError) throw servicesError;
      
      // Handle empty data case safely
      const servicesArray = Array.isArray(servicesData) ? servicesData : [];
      if (servicesArray.length === 0) {
        setTasks([]);
        return;
      }
      
      // Fetch areas to get names
      const { data: areasData, error: areasError } = await supabase
        .from('service_areas')
        .select('id, name');
      
      if (areasError) throw areasError;
      
      // Process the data to match our ServiceTask interface with safe type handling
      const areasArray = areasData && Array.isArray(areasData) ? areasData : [];
      const processedTasks: ServiceTask[] = servicesArray.map((item: any) => {
        // Find the area name
        const area = areasArray.find(a => a.id === item?.area_id);
        
        // Map database status to our component status with defaults
        let taskStatus: "completed" | "ongoing" | "delayed" = "ongoing";
        if (item?.status === 'completed') taskStatus = "completed";
        if (item?.status === 'delayed') taskStatus = "delayed";
        
        // Format the time with a fallback
        const updatedAt = new Date(item?.updated_at || new Date());
        const formattedTime = updatedAt.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        // Ensure string ID
        const stringId = typeof item?.id === 'number' ? String(item.id) : item?.id || '';
        
        return {
          id: stringId,
          area: area?.name || 'Área não especificada',
          task: item?.title || 'Tarefa sem título',
          status: taskStatus,
          time: formattedTime
        };
      });
      
      setTasks(processedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err as Error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks
  };
};
