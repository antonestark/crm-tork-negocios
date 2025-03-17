
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Export the ServiceArea type so it can be used in other files
export interface ServiceArea {
  id: string;
  name: string;
  description: string | null;
  responsible_id?: string | null;
  status: string | null;
  type: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  task_count: number;
  pending_tasks: number;
  delayed_tasks: number;
}

// Add a type for the RPC result to fix TypeScript errors
interface CountServicesByAreaResult {
  area_id: string;
  count: number;
}

export const useServiceAreasData = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (sessionError) {
        console.warn("Auth session error:", sessionError);
      }
      
      // Fetch service areas
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select(`*`)
        .eq("status", "active")
        .order("name", { ascending: true });
      
      if (areasError) {
        console.error("Error fetching areas:", areasError);
        toast.error("Erro ao carregar áreas de serviço");
        throw areasError;
      }
      
      // Use a direct function call to count services by area with type assertion to fix TypeScript errors
      const { data: servicesCountData, error: servicesCountError } = await supabase
        .rpc('count_services_by_area', {}) as { data: CountServicesByAreaResult[] | null, error: any };
      
      if (servicesCountError) {
        console.error("Error counting services:", servicesCountError);
      }
      
      // Process data to create ServiceArea objects
      const serviceCountArray = Array.isArray(servicesCountData) ? servicesCountData : [];
      const processedAreas: ServiceArea[] = (areasData || []).map(area => {
        const areaCount = serviceCountArray.find(s => s.area_id === area.id);
        
        return {
          id: area.id,
          name: area.name,
          description: area.description || null,
          responsible_id: area.responsible_id,
          type: area.type || "standard",
          status: area.status || "active",
          created_at: area.created_at,
          updated_at: area.updated_at,
          task_count: areaCount ? Number(areaCount.count) : 0,
          pending_tasks: 0,  // Will be updated with real data
          delayed_tasks: 0   // Will be updated with real data
        };
      });
      
      setAreas(processedAreas);
    } catch (error) {
      console.error("Error fetching service areas data:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const createServiceArea = async (areaData: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Authentication required to create service area");
      }
      
      const { data, error } = await supabase
        .from("service_areas")
        .insert({
          name: areaData.name,
          description: areaData.description,
          type: areaData.type,
          status: areaData.status
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh data after creating new area
      fetchData();
      return data;
    } catch (error) {
      console.error("Error creating service area:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
    
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

  return { areas, loading, error, refreshData: fetchData, createServiceArea, isAuthenticated };
};
