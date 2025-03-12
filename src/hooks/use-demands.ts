
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Demand {
  id: string;
  title: string;
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: string; // Changed to string to match Supabase
  status?: string;
  created_at: string;
  updated_at: string;
  // Adding nested objects from join queries
  area?: { name: string } | null;
  assigned_user?: { first_name: string; last_name: string } | null;
  requester?: { first_name: string; last_name: string } | null;
}

export interface DemandCreate {
  id?: string;
  title: string; // Required field
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: Date | string; // Accept both Date and string
  status?: string;
}

export const useDemands = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDemands();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('demands_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands' 
      }, () => {
        fetchDemands();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDemands = async (statusFilter?: string | null) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("demands")
        .select(`
          *,
          area:service_areas(name),
          assigned_user:users!assigned_to(first_name, last_name),
          requester:users!requested_by(first_name, last_name)
        `)
        .order("updated_at", { ascending: false });
      
      // Apply status filter if set
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our Demand interface
      const formattedDemands: Demand[] = data?.map(item => ({
        ...item,
        area: item.area,
        assigned_user: item.assigned_user,
        requester: item.requester
      })) || [];
      
      setDemands(formattedDemands);
    } catch (err) {
      console.error('Error fetching demands:', err);
      setError(err as Error);
      toast.error("Falha ao carregar demandas");
    } finally {
      setLoading(false);
    }
  };

  const addDemand = async (demandData: DemandCreate): Promise<boolean> => {
    try {
      // Ensure date is in ISO format if provided as a Date object
      const formattedData = demandData.due_date instanceof Date
        ? { ...demandData, due_date: demandData.due_date.toISOString() } 
        : demandData;
        
      const { data, error } = await supabase
        .from('demands')
        .insert([formattedData])
        .select();
      
      if (error) throw error;
      
      toast.success('Demanda criada com sucesso');
      await fetchDemands(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error adding demand:', err);
      toast.error('Falha ao criar demanda');
      return false;
    }
  };

  const updateDemand = async (demandData: DemandCreate): Promise<boolean> => {
    if (!demandData.id) {
      console.error('Demand ID is required for update');
      return false;
    }

    try {
      // Ensure date is in ISO format if provided as a Date object
      const formattedData = demandData.due_date instanceof Date
        ? { ...demandData, due_date: demandData.due_date.toISOString() } 
        : demandData;
      
      // Remove id from update data
      const { id, ...updateData } = formattedData;
      
      const { error } = await supabase
        .from('demands')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Demanda atualizada com sucesso');
      await fetchDemands(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating demand:', err);
      toast.error('Falha ao atualizar demanda');
      return false;
    }
  };

  const deleteDemand = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('demands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDemands(prev => prev.filter(d => d.id !== id));
      toast.success('Demanda excluída com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting demand:', err);
      toast.error('Falha ao excluir demanda');
      return false;
    }
  };

  return {
    demands,
    loading,
    error,
    fetchDemands,
    addDemand,
    updateDemand,
    deleteDemand
  };
};
