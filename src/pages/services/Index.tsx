import { BaseLayout } from "@/components/layout/BaseLayout";
import { ServicesNav } from "@/components/services/ServicesNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesMetrics } from "@/components/services/ServicesMetrics"; // Reused from Reports
import { AreaMetrics } from "@/components/services/AreaMetrics"; // Reused from Reports
import { useServiceReports } from "@/hooks/use-service-reports";
import { useDemands } from "@/hooks/use-demands";
import { useServiceChecklist } from "@/hooks/use-service-checklist";
import { useServiceAreasData } from "@/hooks/use-service-areas-data";
// TODO: Import hook for maintenance data (e.g., useMaintenances or adapt fetchMaintenances)
// import { useMaintenances } from "@/hooks/use-maintenances"; 

import { Skeleton } from "@/components/ui/skeleton";
import { FileCheck, Wrench, ClipboardCheck, Map } from "lucide-react"; // Icons for KPIs

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChecklistStats } from '@/hooks/use-checklist-stats';
import { useChecklistAverageTime } from '@/hooks/use-checklist-average-time';
import { useChecklistRankingByArea } from '@/hooks/use-checklist-ranking-by-area';

const ServicesDashboard = () => {
  // Hooks for data fetching
  const { metrics: reportMetrics, loading: reportsLoading } = useServiceReports();
  const { demands, loading: demandsLoading } = useDemands();
  const { items: checklistItems, loading: checklistLoading } = useServiceChecklist();
  const { areas: serviceAreas, loading: areasLoading } = useServiceAreasData();
  const { stats: checklistStats, loading: checklistStatsLoading } = useChecklistStats(7); // últimos 7 dias
  const { averageMinutes, loading: avgTimeLoading } = useChecklistAverageTime(7);
  const { ranking: areaRanking, loading: rankingLoading } = useChecklistRankingByArea(7);
  // TODO: Fetch maintenance data
  // const { maintenances, loading: maintenanceLoading } = useMaintenances(); 
  const maintenanceLoading = true; // Placeholder
  const maintenances = []; // Placeholder

  // Calculate KPIs
  const openDemands = demandsLoading ? '...' : (demands || []).filter(d => d.status === 'open').length;
  const pendingMaintenance = maintenanceLoading ? '...' : (maintenances || []).filter(m => m.status === 'pending').length; // Adjust status field if needed
  const pendingChecklist = checklistLoading ? '...' : (checklistItems || []).filter(item => !item.completed).length;
  const totalAreas = areasLoading ? '...' : (serviceAreas || []).length;

  return (
    <BaseLayout>
      <main className="py-6">
        <div className="px-4">
          <ServicesNav />
        </div>

        <div className="px-4 mt-6">
          <h2 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Dashboard de Serviços
          </h2>

          {/* KPIs Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6 animate-fade-in">
            {/* Open Demands KPI */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Demandas Abertas</CardTitle>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {demandsLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : openDemands}
                </div>
              </CardContent>
            </Card>
            {/* Pending Maintenance KPI */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Manutenções Pendentes</CardTitle>
                 <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                   <Wrench className="h-4 w-4 text-orange-400" />
                 </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {maintenanceLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : pendingMaintenance}
                </div>
              </CardContent>
            </Card>
             {/* Pending Checklist KPI */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Checklist Pendente</CardTitle>
                 <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                   <ClipboardCheck className="h-4 w-4 text-cyan-400" />
                 </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {checklistLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : pendingChecklist}
                </div>
              </CardContent>
            </Card>
            {/* Tempo Médio Checklist */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Tempo Médio</CardTitle>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {avgTimeLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : `${Math.round(averageMinutes || 0)} min`}
                </div>
                <p className="text-slate-400 text-xs mt-1">Tempo médio para concluir um item</p>
              </CardContent>
            </Card>
             {/* Total Areas KPI */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-lime-500/5 hover:shadow-lime-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Áreas de Serviço</CardTitle>
                 <div className="w-8 h-8 bg-lime-500/20 rounded-full flex items-center justify-center">
                   <Map className="h-4 w-4 text-lime-400" />
                 </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {areasLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : totalAreas}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reused Metrics from Reports */}
          <div className="animate-fade-in delay-100 mb-6">
            <ServicesMetrics metrics={reportMetrics} loading={reportsLoading} />
          </div>

          {/* Gráfico de tarefas concluídas por dia */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Tarefas Concluídas nos Últimos 7 Dias</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={checklistStats.map(s => ({ date: s.date.slice(5), concluídas: s.completedCount }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="concluídas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reused Area Metrics from Reports */}
          <div className="animate-fade-in delay-200 mb-6">
            <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden mb-6">
              <CardHeader className="border-b border-blue-900/40">
                <CardTitle className="text-slate-100">Ranking de Áreas (últimos 7 dias)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {rankingLoading ? (
                  <Skeleton className="h-8 w-full bg-slate-700" />
                ) : areaRanking.length === 0 ? (
                  <p className="text-slate-400">Nenhuma tarefa concluída nas áreas.</p>
                ) : (
                  <ul className="space-y-2">
                    {areaRanking.map((area) => (
                      <li key={area.area_name} className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-200">{area.area_name}</span>
                        <span className="text-slate-300">{area.completed_count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-blue-900/40">
                <CardTitle className="text-slate-100">Desempenho por Área</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AreaMetrics />
              </CardContent>
            </Card>
          </div>

          {/* TODO: Add summary tables/charts */}
          {/* 
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in delay-300">
            <Card> <CardHeader><CardTitle>Próximas Manutenções</CardTitle></CardHeader> <CardContent>...</CardContent> </Card>
            <Card> <CardHeader><CardTitle>Demandas Recentes</CardTitle></CardHeader> <CardContent>...</CardContent> </Card>
          </div> 
          */}

        </div>
      </main>
    </BaseLayout>
  );
};

export default ServicesDashboard;
