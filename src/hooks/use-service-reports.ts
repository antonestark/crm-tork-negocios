
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

  useEffect(() => {
    fetchReports();
    fetchMetrics();
    
    // Set up a realtime subscription for report updates
    const subscription = supabase
      .channel('reports_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_reports' 
      }, () => {
        fetchReports();
        fetchMetrics();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, () => {
        fetchMetrics();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("service_reports")
        .select(`
          *,
          service_areas(name),
          users:created_by(first_name, last_name)
        `)
        .order("report_date", { ascending: false });
      
      if (error) throw error;
      
      // Process the data
      const processedReports: ServiceReport[] = data.map(report => ({
        id: report.id,
        report_date: report.report_date,
        area_id: report.area_id,
        area_name: report.service_areas?.name,
        completed_tasks: report.completed_tasks || 0,
        pending_tasks: report.pending_tasks || 0,
        delayed_tasks: report.delayed_tasks || 0,
        average_completion_time: report.average_completion_time || 0,
        created_by: report.created_by,
        created_at: report.created_at
      }));
      
      setReports(processedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err as Error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Fetch services statistics
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("status");
      
      if (servicesError) throw servicesError;
      
      // Count by status
      const completed = servicesData?.filter(s => s.status === 'completed').length || 0;
      const pending = servicesData?.filter(s => s.status === 'pending').length || 0;
      const delayed = servicesData?.filter(s => s.status === 'delayed').length || 0;
      
      // Get average completion time from latest report
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
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(err as Error);
    }
  };

  return {
    reports,
    metrics,
    loading,
    error,
    fetchReports,
    fetchMetrics
  };
};
