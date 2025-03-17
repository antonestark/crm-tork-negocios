
// Add type exports if not already present
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Create and export the ServiceReport interface
export interface ServiceReport {
  area_name: string;
  area_id: string;
  completed_tasks: number;
  pending_tasks: number;
  delayed_tasks: number;
  total_tasks: number;
  completion_rate: number;
}

// Interface for RPC result
interface ServiceStatisticsResult {
  area_name: string;
  area_id: string;
  completed_tasks: number;
  pending_tasks: number;
  delayed_tasks: number;
}

export const useServiceReports = () => {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchReports();
    
    // Set up a realtime subscription
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Use proper type assertion for RPC calls
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_service_statistics') as { data: ServiceStatisticsResult[] | null, error: any };
      
      if (statsError) throw statsError;
      
      // Process the data to match our ServiceReport interface with proper type safety
      const processedReports: ServiceReport[] = [];
      
      if (statsData && Array.isArray(statsData)) {
        for (const stat of statsData) {
          const totalTasks = (stat.completed_tasks || 0) + (stat.pending_tasks || 0) + (stat.delayed_tasks || 0);
          const completionRate = totalTasks > 0 ? ((stat.completed_tasks || 0) / totalTasks * 100) : 0;
          
          processedReports.push({
            area_name: stat.area_name || '',
            area_id: stat.area_id || '',
            completed_tasks: stat.completed_tasks || 0,
            pending_tasks: stat.pending_tasks || 0,
            delayed_tasks: stat.delayed_tasks || 0,
            total_tasks: totalTasks,
            completion_rate: completionRate
          });
        }
      }
      
      setReports(processedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err as Error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports
  };
};
