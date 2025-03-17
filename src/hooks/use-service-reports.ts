
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceReport {
  id: string;
  report_date: string;
  area_id: string;
  area_name: string;
  completed: number;
  pending: number;
  delayed: number;
  completion_rate: number;
  completed_tasks: number;
  pending_tasks: number;
  delayed_tasks: number;
}

export interface ServicesMetricsData {
  completed: number;
  pending: number;
  delayed: number;
  averageTime: number;
}

export const useServiceReports = () => {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<ServicesMetricsData>({
    completed: 0,
    pending: 0,
    delayed: 0,
    averageTime: 0,
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest service reports for each area
      // Use type assertion for the Supabase call since service_reports is in the database
      const { data: reportsData, error: reportsError } = await supabase
        .from('service_reports' as any)
        .select('*, service_areas(name)')
        .order('report_date', { ascending: false })
        .limit(10);

      if (reportsError) throw reportsError;

      // Format the reports data
      const formattedReports = reportsData.map((report: any) => ({
        id: report.id,
        report_date: report.report_date,
        area_id: report.area_id,
        area_name: report.service_areas?.name || 'Unknown Area',
        completed: report.completed_services || 0,
        pending: report.pending_services || 0,
        delayed: report.delayed_services || 0,
        completion_rate: report.completion_rate || 0,
        completed_tasks: report.completed_services || 0,
        pending_tasks: report.pending_services || 0,
        delayed_tasks: report.delayed_services || 0,
      }));

      setReports(formattedReports);

      // Get overall metrics
      // Use type assertion for RPC call
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_service_statistics' as any) as { data: any, error: any };

      if (metricsError) {
        console.error('Error fetching reports:', metricsError);
        throw metricsError;
      }

      if (metricsData) {
        setMetrics({
          completed: metricsData.completed || 0,
          pending: metricsData.pending || 0,
          delayed: metricsData.delayed || 0,
          averageTime: metricsData.avg_completion_time || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err as Error);
      toast.error('Erro ao carregar relatórios de serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('service_reports_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_reports' 
      }, () => {
        fetchReports();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    reports,
    loading,
    error,
    metrics,
    fetchReports,
  };
};
