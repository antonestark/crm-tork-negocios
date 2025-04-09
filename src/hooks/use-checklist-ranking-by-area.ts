import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AreaRanking = {
  area_name: string;
  completed_count: number;
};

export function useChecklistRankingByArea(daysBack: number = 7) {
  const [ranking, setRanking] = useState<AreaRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysBack);
      const since = sinceDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('checklist_items')
        .select('end_date, service_areas(name)')
        .neq('end_date', null)
        .gte('end_date', `${since}T00:00:00`)
        .lte('end_date', `${new Date().toISOString().split('T')[0]}T23:59:59`);

      if (error) {
        console.error('Erro ao buscar ranking por área:', error);
        setRanking([]);
        setLoading(false);
        return;
      }

      const counts: Record<string, number> = {};
      data?.forEach((item: { end_date: string; service_areas: { name: string } | null }) => {
        const area = item.service_areas?.name || 'Sem área';
        counts[area] = (counts[area] || 0) + 1;
      });

      const result: AreaRanking[] = Object.entries(counts)
        .map(([area_name, completed_count]) => ({ area_name, completed_count }))
        .sort((a, b) => b.completed_count - a.completed_count);

      setRanking(result);
      setLoading(false);
    };

    fetchRanking();
  }, [daysBack]);

  return { ranking, loading };
}
