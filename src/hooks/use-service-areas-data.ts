
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceArea {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  status: 'active' | 'inactive';
  type?: string;
  services_count: number;
  pending_services: number;
  task_count: number;
  created_at: string;
}

interface ServiceAreasResult {
  areas: ServiceArea[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useServiceAreasData = (): ServiceAreasResult => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service areas
      const { data: areasData, error: areasError } = await supabase
        .from('service_areas')
        .select('*')
        .order('name');

      if (areasError) throw areasError;

      // Get service counts for each area
      // Use type assertion with any to bypass TypeScript errors completely
      const { data: countData, error: countError } = await (supabase.rpc as any)(
        'count_services_by_area'
      );

      if (countError) {
        console.error('Error counting services:', countError);
        throw countError;
      }

      // Map counts to areas
      const areasWithCounts = areasData.map((area: any) => {
        const countInfo = countData?.find(
          (item: any) => item.area_id === area.id
        ) || { total: 0, pending: 0 };

        return {
          ...area,
          services_count: countInfo.total || 0,
          pending_services: countInfo.pending || 0,
          task_count: countInfo.total || 0, // Add task_count property
        };
      });

      setAreas(areasWithCounts);
    } catch (err) {
      console.error('Error fetching service areas:', err);
      setError(err as Error);
      toast.error('Erro ao carregar áreas de serviço');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('service_areas_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_areas' 
      }, () => {
        fetchData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { areas, loading, error, refresh: fetchData };
};
