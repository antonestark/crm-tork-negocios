
import { useState, useEffect } from 'react';
import { ActivityLog } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { activityLogsAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('activity_logs_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activity_logs' 
      }, () => {
        fetchLogs();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Use the adapter to ensure type compatibility
      const adaptedLogs = activityLogsAdapter(data || []);
      setLogs(adaptedLogs);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err as Error);
      toast.error('Falha ao carregar registros de auditoria');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters to logs
  const filteredLogs = logs.filter(log => {
    // Apply search filter
    const matchesSearch = searchQuery 
      ? (log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         log.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         log.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Apply severity filter
    const matchesSeverity = severityFilter 
      ? log.severity === severityFilter 
      : true;
    
    // Apply category filter
    const matchesCategory = categoryFilter 
      ? log.category === categoryFilter 
      : true;
    
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  return {
    logs,
    filteredLogs,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    severityFilter,
    setSeverityFilter,
    categoryFilter,
    setCategoryFilter,
    fetchLogs
  };
};
