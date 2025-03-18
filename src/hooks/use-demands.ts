
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DemandCreate } from '@/types/demands';

export interface Demand {
  id: string;
  title: string;
  description: string;
  area: string;
  area_id: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  assigned_user_name: string;
  requested_by: string | null;
  requester_name: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// Add null safety checks for assigned_user and requester
const mapDemandData = (d: any): Demand => ({
  id: d.id,
  title: d.title,
  description: d.description || '',
  area: d.area_name || 'General',
  area_id: d.area_id,
  priority: d.priority || 'medium',
  status: d.status || 'open',
  assigned_to: d.assigned_to || null,
  assigned_user_name: d.assigned_user ? d.assigned_user.name : 'Unassigned',
  requested_by: d.requested_by || null,
  requester_name: d.requester ? d.requester.name : 'Anonymous',
  due_date: d.due_date || null,
  created_at: d.created_at ? d.created_at : new Date().toISOString(),
  updated_at: d.updated_at ? d.updated_at : new Date().toISOString(),
});

export const useDemands = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDemands = async (statusFilter?: string | null) => {
    try {
      setLoading(true);
      
      // Modified query to use simple joins instead of foreign key hints
      let query = supabase
        .from('demands')
        .select(`
          *,
          service_areas (name)
        `)
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Additional query to get user names
      const userIds = data
        ?.filter(d => d.assigned_to || d.requested_by)
        .flatMap(d => [d.assigned_to, d.requested_by])
        .filter(Boolean) as string[];
      
      const uniqueUserIds = [...new Set(userIds)];
      
      let userMap: Record<string, string> = {};
      
      if (uniqueUserIds.length > 0) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', uniqueUserIds);
          
        if (userData) {
          userMap = userData.reduce((acc, user) => ({
            ...acc,
            [user.id]: user.name
          }), {});
        }
      }
      
      const mappedDemands = (data || []).map((demand: any) => {
        // Handle null service_areas
        const areaName = demand.service_areas ? demand.service_areas.name : 'Unknown Area';
        return mapDemandData({
          ...demand,
          area_name: areaName,
          assigned_user: demand.assigned_to ? { name: userMap[demand.assigned_to] || 'Unknown' } : null,
          requester: demand.requested_by ? { name: userMap[demand.requested_by] || 'Unknown' } : null
        });
      });
      
      setDemands(mappedDemands);
    } catch (err) {
      console.error('Error fetching demands:', err);
      setError(err as Error);
      toast.error('Error fetching demands');
    } finally {
      setLoading(false);
    }
  };

  const addDemand = async (data: DemandCreate): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Format due_date to string if it's a Date object
      const formattedDueDate = data.due_date instanceof Date 
        ? data.due_date.toISOString() 
        : data.due_date;
      
      const { error } = await supabase
        .from('demands')
        .insert({
          title: data.title,
          description: data.description,
          area_id: data.area_id,
          priority: data.priority,
          status: data.status || 'open',
          assigned_to: data.assigned_to,
          requested_by: data.requested_by,
          due_date: formattedDueDate,
        });
      
      if (error) throw error;
      
      toast.success('Demanda criada com sucesso');
      fetchDemands();
      return true;
    } catch (err) {
      console.error('Error adding demand:', err);
      toast.error('Error creating demand');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
    
    // Set up a real-time subscription to demands
    const subscription = supabase
      .channel('public:demands')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demands' }, () => {
        fetchDemands();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { demands, loading, error, fetchDemands, addDemand };
};
