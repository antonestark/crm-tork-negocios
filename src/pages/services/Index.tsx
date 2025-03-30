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

const ServicesDashboard = () => {
  // Hooks for data fetching
  const { metrics: reportMetrics, loading: reportsLoading } = useServiceReports();
  const { demands, loading: demandsLoading } = useDemands();
  const { items: checklistItems, loading: checklistLoading } = useServiceChecklist();
  const { areas: serviceAreas, loading: areasLoading } = useServiceAreasData();
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

          {/* Reused Area Metrics from Reports */}
          <div className="animate-fade-in delay-200 mb-6">
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
