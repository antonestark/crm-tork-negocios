
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceReport {
  id: string;
  report_date: string;
  area_id: string;
  area_name: string;
  completion_rate: number;
  completed_tasks: number;
  pending_tasks: number;
  delayed_tasks: number;
  average_completion_time: number;
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
    averageTime: 0
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch reports with area information - use type assertion
      const { data, error: reportsError } = await (supabase
        .from('service_reports')
        .select(`
          *,
          service_areas (name)
        `)
        .order('report_date', { ascending: false })
        .limit(10) as unknown as Promise<{ 
          data: Array<any>,
          error: any 
        }>);

      if (reportsError) throw reportsError;

      // Fetch aggregated metrics - use type assertion
      const { data: metricsData, error: metricsError } = await (supabase
        .rpc('get_service_metrics') as unknown as Promise<{ 
          data: { 
            completed: number,
            pending: number,
            delayed: number,
            avg_completion_time: number
          }, 
          error: any 
        }>);

      if (metricsError) throw metricsError;

      if (data) {
        const formattedReports = data.map((report: any) => ({
          id: report.id,
          report_date: report.report_date,
          area_id: report.area_id,
          area_name: report.service_areas?.name || 'Unknown Area',
          completion_rate: report.completion_rate || 0,
          completed_tasks: report.completed_tasks || 0,
          pending_tasks: report.pending_tasks || 0,
          delayed_tasks: report.delayed_tasks || 0,
          average_completion_time: report.average_completion_time || 0
        }));

        setReports(formattedReports);
      }

      if (metricsData) {
        setMetrics({
          completed: metricsData.completed || 0,
          pending: metricsData.pending || 0,
          delayed: metricsData.delayed || 0,
          averageTime: Math.round(metricsData.avg_completion_time || 0)
        });
      }
    } catch (err) {
      console.error('Error fetching service reports:', err);
      setError(err as Error);
      toast.error('Erro ao carregar relatórios de serviço');
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

  return { reports, loading, error, metrics, fetchReports };
};
