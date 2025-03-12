
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ServiceReport = {
  id: string;
  report_date: string;
  area_id?: string;
  area_name?: string;
  completed_tasks: number;
  pending_tasks: number;
  delayed_tasks: number;
  average_completion_time: number;
  created_by?: string;
  created_at: string;
};

export type ServiceMetrics = {
  completed: number;
  pending: number;
  delayed: number;
  averageTime: number;
};

export const useServiceReports = () => {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    completed: 0,
    pending: 0,
    delayed: 0,
    averageTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Primeiro, buscar a contagem de serviços por status
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) throw servicesError;
      
      // Contar por status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Buscar relatórios com dados da área
      const { data: reportsData, error: reportsError } = await supabase
        .from("service_reports")
        .select(`
          *,
          service_areas (name)
        `)
        .order("report_date", { ascending: false });
      
      if (reportsError) throw reportsError;
      
      // Processar os relatórios
      const processedReports: ServiceReport[] = (reportsData || []).map(report => ({
        id: report.id,
        report_date: report.report_date,
        area_id: report.area_id,
        area_name: report.service_areas?.name,
        completed_tasks: completed,
        pending_tasks: pending,
        delayed_tasks: delayed,
        average_completion_time: report.average_completion_time || 0,
        created_by: report.created_by,
        created_at: report.created_at
      }));
      
      setReports(processedReports);
      setMetrics({
        completed,
        pending,
        delayed,
        averageTime: processedReports[0]?.average_completion_time || 0
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err as Error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    
    const subscription = supabase
      .channel('reports_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_reports' 
      }, fetchReports)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, fetchReports)
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    reports,
    metrics,
    loading,
    error,
    fetchReports
  };
};
