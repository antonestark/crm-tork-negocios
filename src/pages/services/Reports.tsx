
import { Header } from "@/components/layout/Header";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AreaMetrics } from "@/components/services/AreaMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const ReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    completed: 0,
    pending: 0,
    delayed: 0,
    averageTime: 0
  });

  useEffect(() => {
    fetchReports();
    fetchMetrics();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_reports")
        .select(`
          *,
          service_areas(name),
          users:created_by(first_name, last_name)
        `)
        .order("report_date", { ascending: false });
      
      if (error) throw error;
      
      setReports(data || []);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Buscar estatísticas para o dashboard
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) throw servicesError;
      
      // Contar por status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Buscar tempo médio dos serviços
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
      console.error("Erro ao buscar métricas:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <h2 className="text-3xl font-bold tracking-tight mb-6">Relatórios</h2>
        <ServicesMetrics metrics={metrics} />
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Área</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <AreaMetrics reports={reports} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
