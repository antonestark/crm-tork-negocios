
import { useState, useEffect } from 'react';
import { ActivityLog } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { activityLogsAdapter } from '@/integrations/supabase/adapters';
import { toast } from '@/components/ui/use-toast';

export function useAuditLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:users(first_name, last_name, profile_image_url)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const adaptedLogs = activityLogsAdapter(data || []);
        setLogs(adaptedLogs);
        setFilteredLogs(adaptedLogs);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar logs de atividade",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = logs;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        (log.user?.first_name?.toLowerCase().includes(query) ||
        log.user?.last_name?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.entity_type?.toLowerCase().includes(query))
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, severityFilter, categoryFilter, logs]);

  return {
    logs,
    filteredLogs,
    loading,
    searchQuery,
    setSearchQuery,
    severityFilter,
    setSeverityFilter,
    categoryFilter,
    setCategoryFilter
  };
}
