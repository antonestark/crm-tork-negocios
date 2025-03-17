
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
      
      // Use a direct SQL query or RPC function to get the service counts
      const { data: serviceStats, error: statsError } = await supabase
        .rpc('get_service_statistics');
      
      if (statsError) throw statsError;
      
      const serviceStatsObj = serviceStats?.[0] || {
        completed: 0,
        pending: 0,
        delayed: 0,
        avg_completion_time: 0
      };
      
      // Fetch service reports using a direct SQL query or RPC function
      const { data: reportsData, error: reportsError } = await supabase
        .rpc('get_service_reports');
      
      if (reportsError) throw reportsError;
      
      // Fetch service areas for names
      const { data: areasData, error: areasError } = await supabase
        .from('service_areas')
        .select('id, name');
        
      if (areasError) throw areasError;
      
      // Process the reports
      const processedReports: ServiceReport[] = (reportsData || []).map((report: any) => {
        // Look up area name from areas data
        const area = areasData?.find(a => a.id === report.area_id);
        
        return {
          id: report.id,
          report_date: report.report_date,
          area_id: report.area_id,
          area_name: area?.name,
          completed_tasks: serviceStatsObj.completed,
          pending_tasks: serviceStatsObj.pending,
          delayed_tasks: serviceStatsObj.delayed,
          average_completion_time: report.average_completion_time || 0,
          created_by: report.created_by,
          created_at: report.created_at || new Date().toISOString()
        };
      });
      
      setReports(processedReports);
      setMetrics({
        completed: serviceStatsObj.completed,
        pending: serviceStatsObj.pending,
        delayed: serviceStatsObj.delayed,
        averageTime: serviceStatsObj.avg_completion_time || 0
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
