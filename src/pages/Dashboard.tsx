
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
import { useServiceChecklist } from '@/hooks/use-service-checklist';
import { useServiceReports } from '@/hooks/use-service-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadsOverview } from '@/components/dashboard/LeadsOverview';
import { DemandsOverview } from '@/components/dashboard/DemandsOverview';

const Dashboard = () => {
  const { leads, loading: leadsLoading } = useLeads();
  const { demands, loading: demandsLoading } = useDemands();
  const { items: checklistItems, loading: checklistLoading } = useServiceChecklist();
  const { metrics, loading: metricsLoading } = useServiceReports();
  
  // Calculate overview stats
  const qualifiedLeads = leadsLoading ? '...' : leads.filter(lead => lead.status === 'qualificado').length;
  const pendingDemands = demandsLoading ? '...' : demands.filter(demand => demand.status === 'open').length;
  const pendingChecklistItems = checklistLoading ? '...' : checklistItems.filter(item => !item.completed).length;
  
  const totalTasksValue = metricsLoading ? 0 : (metrics.completed + metrics.pending + metrics.delayed);
  const completionRate = totalTasksValue > 0 ? Math.round((metrics.completed / totalTasksValue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Atualizar dados
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leadsLoading ? <Skeleton className="h-8 w-16" /> : qualifiedLeads}
                </div>
                <p className="text-xs text-muted-foreground">
                  De um total de {leadsLoading ? "..." : leads.length} leads
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandas Pendentes</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {demandsLoading ? <Skeleton className="h-8 w-16" /> : pendingDemands}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aguardando atendimento
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items do Checklist</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {checklistLoading ? <Skeleton className="h-8 w-16" /> : pendingChecklistItems}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pendentes de verificação
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricsLoading ? <Skeleton className="h-8 w-16" /> : `${completionRate}%`}
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <LeadsOverview leads={leads} loading={leadsLoading} />
                <DemandsOverview demands={demands} loading={demandsLoading} />
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <TaskPanel />
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Agendamentos</CardTitle>
                  <CardDescription>
                    Visão mensal de todos os agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingCalendar />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
