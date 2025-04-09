import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ChecklistStats = {
  date: string; // YYYY-MM-DD
  completedCount: number;
};

export function useChecklistStats(daysBack: number = 7) {
  const [stats, setStats] = useState<ChecklistStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysBack);
      const since = sinceDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('checklist_completions')
        .select('completed_at')
        .gte('completed_at', `${since}T00:00:00`)
        .order('completed_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar estatísticas do checklist:', error);
        setStats([]);
        setLoading(false);
        return;
      }

      // Agrupar por dia
      const counts: Record<string, number> = {};
      data?.forEach((item: { completed_at: string }) => {
        const date = item.completed_at.split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      // Preencher todos os dias no intervalo, mesmo com zero
      const result: ChecklistStats[] = [];
      for (let i = daysBack - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        result.push({
          date: dateStr,
          completedCount: counts[dateStr] || 0,
        });
      }

      setStats(result);
      setLoading(false);
    };

    fetchStats();
  }, [daysBack]);

  return { stats, loading };
}
