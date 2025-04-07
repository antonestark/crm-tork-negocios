
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
  loading: boolean;
}

export const DashboardTabs = ({
  leads,
  demands,
  users,
  loading,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4 animate-fade-in">
      <TabsList className="bg-slate-900/70 backdrop-blur-md p-1 border border-blue-900/40 rounded-lg overflow-hidden">
        <TabsTrigger 
          value="overview" 
          className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
        >
          <span className="relative z-10">Visão Geral</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
        </TabsTrigger>
        <TabsTrigger 
          value="tasks"
          className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
        >
          <span className="relative z-10">Tarefas</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
        </TabsTrigger>
        <TabsTrigger 
          value="calendar"
          className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
        >
          <span className="relative z-10">Calendário</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
        </TabsTrigger>
        <TabsTrigger 
          value="demands" 
          className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
        >
          <span className="relative z-10">Demandas</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
            <LeadsOverview leads={leads} loading={loading} />
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
            <DemandsOverview demands={demands} loading={loading} />
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-4">
        <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden flex-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
          <TaskPanel />
        </Card>
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-4">
        <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden flex-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
          <BookingCalendar />
        </Card>
      </TabsContent>

      <TabsContent value="demands" className="space-y-4">
        <DemandsTab 
          demands={demands} 
          users={users} 
          loading={loading} 
        />
      </TabsContent>
    </Tabs>
  );
};
