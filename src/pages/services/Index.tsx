
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
  const [metrics, setMetrics] = useState({
    completed: 0,
    pending: 0,
    delayed: 0,
    averageTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Set up a realtime subscription for service_areas
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
      // Fetch service areas with task counts
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
      
      // Process areas to include task counts
      const processedAreas = areasData?.map(area => ({
        ...area,
        task_count: area.services?.[0]?.count || 0
      })) || [];
      
      setAreas(processedAreas);
      
      // Fetch service statistics for metrics
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) {
        console.error("Error fetching services:", servicesError);
        toast.error("Erro ao carregar métricas de serviço");
        throw servicesError;
      }
      
      // Count by status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Get average completion time
      const { data: reportsData, error: reportsError } = await supabase
        .from("service_reports")
        .select("average_completion_time")
        .order("report_date", { ascending: false })
        .limit(1);
      
      if (reportsError) {
        console.error("Error fetching reports:", reportsError);
        toast.error("Erro ao carregar tempo médio de conclusão");
        throw reportsError;
      }
      
      const averageTime = reportsData && reportsData.length > 0 
        ? reportsData[0].average_completion_time 
        : 45;
      
      setMetrics({
        completed,
        pending,
        delayed,
        averageTime
      });
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
          <ServicesMetrics metrics={metrics} />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <ServiceAreas areasData={areas} loading={loading} />
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default ServicesIndex;
