import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceArea } from '@/types/admin';

// Add a type for the RPC result to fix TypeScript errors
interface CountServicesByAreaResult {
  area_id: string;
  count: number;
}

export const useServiceAreasData = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
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
      
      // Use a direct function call to count services by area
      const { data: servicesCountData, error: servicesCountError } = await supabase
        .rpc('count_services_by_area') as { data: CountServicesByAreaResult[] | null, error: any };
      
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
          description: area.description || "",
          type: area.type || "standard",
          status: area.status || "active",
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

  return { areas, loading, error, refreshData: fetchData };
};
