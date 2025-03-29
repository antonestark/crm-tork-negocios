
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/admin';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsOverviewProps {
  leads: Lead[];
  loading: boolean;
}

export const LeadsOverview = ({ leads, loading }: LeadsOverviewProps) => {
  // Prepare data for pie chart
  const statusCounts = React.useMemo(() => {
    const counts = {
      qualificado: 0,
      neutro: 0, 
      'não qualificado': 0
    };
    
    if (!loading && leads.length) {
      leads.forEach(lead => {
        const status = lead.status.toLowerCase();
        if (status === 'qualificado') {
          counts.qualificado++;
        } else if (status === 'não qualificado' || status.includes('não qualificado')) {
          counts['não qualificado']++;
        } else {
          counts.neutro++;
        }
      });
    }
    
    return [
      { name: 'Qualificados', value: counts.qualificado, color: '#22d3ee' },
      { name: 'Neutros', value: counts.neutro, color: '#94a3b8' },
      { name: 'Não Qualificados', value: counts['não qualificado'], color: '#f43f5e' },
    ];
  }, [leads, loading]);

  return (
    <Card className="col-span-1 bg-transparent border-0">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold text-lg flex items-center">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Conversão de Leads
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full bg-slate-800/80" />
          </div>
        ) : leads.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                    }
                    className="drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} leads`, '']} 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm mt-4">
              {statusCounts.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}` 
                    }}
                  ></div>
                  <span className="text-slate-300">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
            <p>Nenhum lead cadastrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
