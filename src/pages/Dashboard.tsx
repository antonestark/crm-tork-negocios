
import React, { useState } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { LeadsOverview } from '@/components/dashboard/LeadsOverview';
import { DemandsOverview } from '@/components/dashboard/DemandsOverview';
import { TaskPanel } from '@/components/dashboard/TaskPanel';
import { BookingCalendar } from '@/components/dashboard/Calendar/BookingCalendar';
import { DemandsTab } from '@/components/dashboard/DemandsTab';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import type { DateRange } from 'react-day-picker';

const Dashboard = () => {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const { data, loading } = useDashboardData(range);
  
  const qualifiedLeads = loading ? '...' : data.leads.filter(lead => lead.status === 'qualificado').length;
  const pendingDemands = loading ? '...' : data.demands.filter(demand => demand.status === 'open').length;
  const pendingChecklistItems = loading ? '...' : data.checklistItems.filter(item => !item.completed).length;
  
  const totalTasksValue = loading ? 0 : (data.metrics[0]?.completed_tasks + data.metrics[0]?.pending_tasks + data.metrics[0]?.delayed_tasks);
  const completionRate = totalTasksValue > 0 ? Math.round((data.metrics[0]?.completed_tasks / totalTasksValue) * 100) : 0;

  return (
    <BaseLayout>
      <main className="py-6 relative z-10"> 
        <div className="flex flex-col gap-6 px-4"> 
          <DashboardHeader range={range} setRange={setRange} />

          <OverviewCards 
            qualifiedLeads={qualifiedLeads}
            totalLeads={data.leads.length}
            pendingDemands={pendingDemands}
            pendingChecklistItems={pendingChecklistItems}
            completionRate={completionRate}
            loading={loading}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 p-4">
              <LeadsOverview leads={data.leads} loading={loading} />
            </div>
            <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 p-4">
              <DemandsOverview demands={data.demands} loading={loading} />
            </div>
          </div>

          <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden flex-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 p-4">
            <TaskPanel />
          </div>

          <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden flex-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 p-4">
            <BookingCalendar />
          </div>

          <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden flex-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 p-4">
            <DemandsTab demands={data.demands} users={data.users} loading={loading} />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Dashboard;
