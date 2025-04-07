import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [data, setData] = useState({
    leads: [],
    demands: [],
    users: [],
    checklistItems: [],
    metrics: {
      completed: 0,
      pending: 0,
      delayed: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: leads, error: leadsError } = await supabase.from('leads').select('*');
        const { data: demands, error: demandsError } = await supabase.from('demands').select('*');
        const { data: users, error: usersError } = await supabase.from('users').select('*');
        const { data: checklistItems, error: checklistError } = await supabase.from('checklist_items').select('*');
        const { data: metrics, error: metricsError } = await supabase.from('service_reports').select('*');

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
  }, []);

  return { data, loading, error };
};
