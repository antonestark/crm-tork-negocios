
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceTask {
  id: string;
  task: string;
  area: string;
  area_id: string;
  status: 'completed' | 'ongoing' | 'delayed';
  time: string;
  date: string;
}

export const useServiceTasks = () => {
  const [tasks, setTasks] = useState<ServiceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use Supabase RPC with type assertion to get recent services
      const { data, error: apiError } = await supabase
        .rpc('get_recent_services') as { data: any[], error: any };

      if (apiError) {
        throw apiError;
      }

      if (data) {
        // Format the tasks data
        const formattedTasks = data.map((item: any) => ({
          id: item.id,
          task: item.description || item.name || 'Unnamed Task',
          area: item.area_name || 'General',
          area_id: item.area_id,
          status: item.status || 'ongoing',
          time: item.updated_at ? new Date(item.updated_at).toLocaleTimeString() : 'Unknown time',
          date: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Unknown date',
        }));

        setTasks(formattedTasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err as Error);
      toast.error('Erro ao carregar atividades recentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('service_tasks_changes')
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

  return {
    tasks,
    loading,
    error,
    fetchTasks,
  };
};
