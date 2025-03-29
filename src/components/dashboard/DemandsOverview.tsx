
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
    <Card className="col-span-1 bg-transparent border-0">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold text-lg flex items-center">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
            Demandas por Status
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full bg-slate-800/80" />
        ) : demands.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demandStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(59, 130, 246, 0.1)" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'high') return [`${value} alta`, 'Prioridade'];
                    if (name === 'medium') return [`${value} média`, 'Prioridade'];
                    if (name === 'low') return [`${value} baixa`, 'Prioridade'];
                    return [value, ''];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="high" 
                  stackId="a" 
                  name="Alta" 
                  fill="#f43f5e" 
                  radius={[4, 4, 0, 0]} 
                  className="drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                />
                <Bar 
                  dataKey="medium" 
                  stackId="a" 
                  name="Média" 
                  fill="#fb923c" 
                  radius={[4, 4, 0, 0]} 
                  className="drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]"
                />
                <Bar 
                  dataKey="low" 
                  stackId="a" 
                  name="Baixa" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]} 
                  className="drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
            <p>Nenhuma demanda cadastrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
