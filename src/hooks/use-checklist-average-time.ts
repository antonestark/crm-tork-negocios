import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChecklistAverageTime(daysBack: number = 7) {
  const [averageMinutes, setAverageMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverage = async () => {
      setLoading(true);
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysBack);
      const since = sinceDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('checklist_items')
        .select('start_date, end_date')
        .neq('start_date', null)
        .neq('end_date', null)
        .gte('end_date', `${since}T00:00:00`)
        .lte('end_date', `${new Date().toISOString().split('T')[0]}T23:59:59`);

      if (error) {
        console.error('Erro ao buscar tempos médios do checklist:', error);
        setAverageMinutes(null);
        setLoading(false);
        return;
      }

      const durations: number[] = [];
      data?.forEach((item: { start_date: string; end_date: string }) => {
        const start = new Date(item.start_date).getTime();
        const end = new Date(item.end_date).getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          const diffMinutes = (end - start) / (1000 * 60);
          durations.push(diffMinutes);
        }
      });

      if (durations.length === 0) {
        setAverageMinutes(0);
      } else {
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        setAverageMinutes(avg);
      }
      setLoading(false);
    };

    fetchAverage();
  }, [daysBack]);

  return { averageMinutes, loading };
}
