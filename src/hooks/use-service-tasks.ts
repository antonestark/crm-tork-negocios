
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
      
      // Fetch services with their area names
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          title,
          status,
          updated_at,
          area:service_areas(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Process the data to match our ServiceTask interface
      const processedTasks: ServiceTask[] = data.map(item => {
        // Map database status to our component status
        let taskStatus: "completed" | "ongoing" | "delayed" = "ongoing";
        if (item.status === 'completed') taskStatus = "completed";
        if (item.status === 'delayed') taskStatus = "delayed";
        
        // Format the time
        const updatedAt = new Date(item.updated_at);
        const formattedTime = updatedAt.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        return {
          id: item.id,
          area: item.area?.name || 'Área não especificada',
          task: item.title,
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
