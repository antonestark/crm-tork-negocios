
import { Header } from "@/components/layout/Header";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { TaskPanel } from "@/components/services/TaskPanel";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar áreas
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select("*")
        .order("name", { ascending: true });
      
      if (areasError) throw areasError;
      setAreas(areasData || []);
      
      // Buscar estatísticas para o dashboard
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) throw servicesError;
      
      // Contar por status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Obter tempo médio
      const { data: reportsData, error: reportsError } = await supabase
        .from("service_reports")
        .select("average_completion_time")
        .order("report_date", { ascending: false })
        .limit(1);
      
      if (reportsError) throw reportsError;
      
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
          <ServiceAreas areasData={areas} />
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default ServicesIndex;
