
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Demand } from '@/hooks/use-demands';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DemandsOverviewProps {
  demands: Demand[];
  loading: boolean;
}

export const DemandsOverview = ({ demands, loading }: DemandsOverviewProps) => {
  // Group demands by status and priority
  const demandStats = React.useMemo(() => {
    if (loading || !demands.length) return [];
    
    const statusMap: Record<string, { [key: string]: number }> = {
      'open': { high: 0, medium: 0, low: 0 },
      'in-progress': { high: 0, medium: 0, low: 0 },
      'completed': { high: 0, medium: 0, low: 0 }
    };
    
    demands.forEach(demand => {
      const status = demand.status || 'open';
      const priority = demand.priority || 'medium';
      
      if (!statusMap[status]) {
        statusMap[status] = { high: 0, medium: 0, low: 0 };
      }
      
      statusMap[status][priority]++;
    });
    
    // Convert to array for chart
    return [
      { name: 'Abertas', ...statusMap['open'], total: Object.values(statusMap['open']).reduce((a, b) => a + b, 0) },
      { name: 'Em Progresso', ...statusMap['in-progress'], total: Object.values(statusMap['in-progress']).reduce((a, b) => a + b, 0) },
      { name: 'Concluídas', ...statusMap['completed'], total: Object.values(statusMap['completed']).reduce((a, b) => a + b, 0) }
    ];
  }, [demands, loading]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Demandas por Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : demands.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demandStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'high') return [`${value} alta`, 'Prioridade'];
                  if (name === 'medium') return [`${value} média`, 'Prioridade'];
                  if (name === 'low') return [`${value} baixa`, 'Prioridade'];
                  return [value, ''];
                }} />
                <Bar dataKey="high" stackId="a" name="Alta" fill="#EF4444" />
                <Bar dataKey="medium" stackId="a" name="Média" fill="#F59E0B" />
                <Bar dataKey="low" stackId="a" name="Baixa" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <p>Nenhuma demanda cadastrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
