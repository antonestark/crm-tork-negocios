import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DateRange } from 'react-day-picker';

export const useDashboardData = (range?: DateRange) => {
  const [data, setData] = useState({
    leads: [],
    demands: [],
    users: [],
    checklistItems: [],
    metrics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filters = (query: any) => {
          if (range?.from) {
            query = query.gte('created_at', range.from.toISOString());
          }
          if (range?.to) {
            query = query.lte('created_at', range.to.toISOString());
          }
          return query;
        };

        const { data: leads } = await filters(supabase.from('leads').select('*'));
        const { data: demands } = await filters(supabase.from('demands').select('*'));
        const { data: users } = await supabase.from('users').select('*'); // usuários geralmente não são filtrados por data
        const { data: checklistItems } = await filters(supabase.from('checklist_items').select('*'));
        const { data: metrics } = await filters(supabase.from('service_reports').select('*'));

        setData({
          leads,
          demands,
          users,
          checklistItems,
          metrics,
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading, error };
};
