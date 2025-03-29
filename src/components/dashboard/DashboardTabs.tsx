
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { TaskPanel } from '@/components/dashboard/TaskPanel';
import { BookingCalendar } from '@/components/dashboard/Calendar/BookingCalendar';
import { LeadsOverview } from '@/components/dashboard/LeadsOverview';
import { DemandsOverview } from '@/components/dashboard/DemandsOverview';
import { DemandsTab } from '@/components/dashboard/DemandsTab';
import { Lead } from '@/types/admin';
import { Demand } from '@/hooks/use-demands';
import { User } from '@/types/admin';

interface DashboardTabsProps {
  leads: Lead[];
  demands: Demand[];
  users: User[];
  leadsLoading: boolean;
  demandsLoading: boolean;
  usersLoading: boolean;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  leads,
  demands,
  users,
  leadsLoading,
  demandsLoading,
  usersLoading
}) => {
  return (
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
          value="demands" 
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
          <BookingCalendar />
        </Card>
      </TabsContent>

      <TabsContent value="demands" className="space-y-4">
        <DemandsTab 
          demands={demands} 
          users={users} 
          loading={demandsLoading || usersLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};
