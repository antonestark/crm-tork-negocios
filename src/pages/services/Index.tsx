import { Header } from "@/components/layout/Header";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { TaskPanel } from "@/components/services/TaskPanel";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ServicesIndex = () => {
  const [areas, setAreas] = useState<any[]>([]);
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
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select(`
          *,
          services(count)
        `)
        .eq("status", "active")
        .order("name", { ascending: true });
      
      if (areasError) {
        console.error("Error fetching areas:", areasError);
        toast.error("Erro ao carregar áreas de serviço");
        throw areasError;
      }
      
      const processedAreas = areasData?.map(area => ({
        ...area,
        task_count: area.services?.[0]?.count || 0
      })) || [];
      
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
          <ServiceAreas areas={areas} loading={loading} />
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default ServicesIndex;
