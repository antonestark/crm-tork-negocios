import { useState, useEffect } from 'react';
import { ActivityLog } from '@/types/admin';
import { supabase, activityLogsAdapter } from '@/integrations/supabase/client';

interface UseAuditLogsProps {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
}

const defaultLimit = 20;

export const useAuditLogs = ({
  entityType,
  entityId,
  userId,
  action,
  orderBy = 'created_at',
  ascending = false,
  limit = defaultLimit,
}: UseAuditLogsProps = {}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('activity_logs')
          .select('*, user:users(name)')
          .order(orderBy, { ascending })
          .limit(limit);

        if (entityType) {
          query = query.eq('entity_type', entityType);
        }

        if (entityId) {
          query = query.eq('entity_id', entityId);
        }

        if (userId) {
          query = query.eq('user_id', userId);
        }

        if (action) {
          query = query.eq('action', action);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const adaptedLogs = activityLogsAdapter(data);
        setLogs(adaptedLogs);
      } catch (err: any) {
        setError(err);
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [entityType, entityId, userId, action, orderBy, ascending, limit]);

  return { logs, loading, error };
};
