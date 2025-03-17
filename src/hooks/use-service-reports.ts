
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
      
      // First, fetch the count of services by status
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) throw servicesError;
      
      // Count by status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Fetch service reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("service_reports")
        .select("*");
      
      if (reportsError) throw reportsError;
      
      // Fetch service areas for names
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select("id, name");
        
      if (areasError) throw areasError;
      
      // Process the reports
      const processedReports: ServiceReport[] = (reportsData || []).map(report => {
        // Look up area name from areas data
        const area = areasData?.find(a => a.id === report.area_id);
        
        return {
          id: report.id,
          report_date: report.report_date,
          area_id: report.area_id,
          area_name: area?.name,
          completed_tasks: completed,
          pending_tasks: pending,
          delayed_tasks: delayed,
          average_completion_time: report.average_completion_time || 0,
          created_by: report.created_by,
          created_at: report.created_at || new Date().toISOString()
        };
      });
      
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
