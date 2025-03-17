
import { Header } from "@/components/layout/Header";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { TaskPanel } from "@/components/services/TaskPanel";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServiceArea } from "@/hooks/use-service-areas-data";

// Define a local version of ServiceArea without the conflicting fields
// This avoids type conflicts with the imported ServiceArea type
interface LocalServiceArea {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status?: string;
  task_count: number;
  pending_tasks: number;
  delayed_tasks: number;
}

// Interface for RPC results
interface CountServicesByAreaResult {
  area_id: string;
  count: number;
}

const ServicesIndex = () => {
  const [areas, setAreas] = useState<LocalServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    const subscription = supabase
      .channel('services_changes')
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
      
      // Use a direct function call to count services by area with proper type assertion
      const { data: servicesCountData, error: servicesCountError } = await supabase
        .rpc('count_services_by_area') as unknown as { data: CountServicesByAreaResult[] | null, error: any };
      
      if (servicesCountError) {
        console.error("Error counting services:", servicesCountError);
      }
      
      // Process data to include task counts
      const servicesCountArray = Array.isArray(servicesCountData) ? servicesCountData : [];
      const processedAreas: LocalServiceArea[] = (areasData || []).map(area => {
        const areaServiceCount = servicesCountArray.find((item: any) => item?.area_id === area.id)?.count || 0;
        
        return {
          id: area.id,
          name: area.name,
          description: area.description,
          type: area.type,
          status: area.status,
          task_count: Number(areaServiceCount),
          pending_tasks: 0,  // Add missing properties to match ServiceArea type
          delayed_tasks: 0   // Add missing properties to match ServiceArea type
        };
      });
      
      setAreas(processedAreas);
      
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <ServicesHeader />
        <div className="mt-6">
          <ServicesMetrics />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <ServiceAreas areas={areas as unknown as ServiceArea[]} loading={loading} />
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default ServicesIndex;
