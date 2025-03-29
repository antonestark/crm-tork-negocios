import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  Users, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';
import { TaskPanel } from '@/components/dashboard/TaskPanel';
import { BookingCalendar } from '@/components/dashboard/Calendar/BookingCalendar';
import { useLeads } from '@/hooks/use-leads';
import { useDemands } from '@/hooks/use-demands';
import useUsers from '@/hooks/users'; // Adicionado
import { useServiceChecklist } from '@/hooks/use-service-checklist';
import { useServiceReports } from '@/hooks/use-service-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadsOverview } from '@/components/dashboard/LeadsOverview';
import { DemandsOverview } from '@/components/dashboard/DemandsOverview';
import { DemandsTab } from '@/components/dashboard/DemandsTab'; // Adicionado

const Dashboard = () => {
  const { leads, loading: leadsLoading } = useLeads();
  const { demands, loading: demandsLoading } = useDemands();
  const { users, loading: usersLoading } = useUsers(); // Adicionado
  const { items: checklistItems, loading: checklistLoading } = useServiceChecklist();
  const { metrics, loading: metricsLoading } = useServiceReports();
  
  // Calculate overview stats
  const qualifiedLeads = leadsLoading ? '...' : leads.filter(lead => lead.status === 'qualificado').length;
  const pendingDemands = demandsLoading ? '...' : demands.filter(demand => demand.status === 'open').length;
  const pendingChecklistItems = checklistLoading ? '...' : checklistItems.filter(item => !item.completed).length;
  
  const totalTasksValue = metricsLoading ? 0 : (metrics.completed + metrics.pending + metrics.delayed);
  const completionRate = totalTasksValue > 0 ? Math.round((metrics.completed / totalTasksValue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-x-hidden">
      <Header />
      <main className="py-6 px-4">
        <div className="flex flex-col gap-6 relative z-10">
          {/* Dashboard Header with Gradient Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Dashboard</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="border border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-full w-full md:w-auto"
            >
              Atualizar dados
            </Button>
          </div>

          {/* Overview Cards with Glassmorphism Effect */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Leads Qualificados</CardTitle>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {leadsLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : qualifiedLeads}
                </div>
                <p className="text-xs text-slate-400">
                  De um total de {leadsLoading ? "..." : leads.length} leads
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Demandas Pendentes</CardTitle>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {demandsLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : pendingDemands}
                </div>
                <p className="text-xs text-slate-400">
                  Aguardando atendimento
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Items do Checklist</CardTitle>
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {checklistLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : pendingChecklistItems}
                </div>
                <p className="text-xs text-slate-400">
                  Pendentes de verificação
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Taxa de Conclusão</CardTitle>
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {metricsLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : `${completionRate}%`}
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full mt-1">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs with Futuristic Styling */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-slate-800/60 backdrop-blur-sm p-1 border-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-white text-slate-400"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="tasks"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-white text-slate-400"
              >
                Tarefas
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-white text-slate-400"
              >
                Calendário
              </TabsTrigger>
              <TabsTrigger 
                value="demands" // Adicionado
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-white text-slate-400"
              >
                Demandas 
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
                  <LeadsOverview leads={leads} loading={leadsLoading} />
                </Card>
                <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
                  <DemandsOverview demands={demands} loading={demandsLoading} />
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg flex-1">
                <TaskPanel />
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <Card className="bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg flex-1">
                <CardHeader>
                  <CardTitle className="text-white">Agendamentos</CardTitle>
                  <CardDescription className="text-slate-400">
                    Visão mensal de todos os agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingCalendar />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demands" className="space-y-4"> // Adicionado
              <DemandsTab 
                demands={demands} 
                users={users} 
                loading={demandsLoading || usersLoading} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
