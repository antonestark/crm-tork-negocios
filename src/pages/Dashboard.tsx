
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useLeads } from '@/hooks/use-leads';
import { useDemands } from '@/hooks/use-demands';
import useUsers from '@/hooks/users';
import { useServiceChecklist } from '@/hooks/use-service-checklist';
import { useServiceReports } from '@/hooks/use-service-reports';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

const Dashboard = () => {
  const { leads, loading: leadsLoading } = useLeads();
  const { demands, loading: demandsLoading } = useDemands();
  const { users, loading: usersLoading } = useUsers();
  const { items: checklistItems, loading: checklistLoading } = useServiceChecklist();
  const { metrics, loading: metricsLoading } = useServiceReports();
  
  // Calculate overview stats
  const qualifiedLeads = leadsLoading ? '...' : leads.filter(lead => lead.status === 'qualificado').length;
  const pendingDemands = demandsLoading ? '...' : demands.filter(demand => demand.status === 'open').length;
  const pendingChecklistItems = checklistLoading ? '...' : checklistItems.filter(item => !item.completed).length;
  
  const totalTasksValue = metricsLoading ? 0 : (metrics.completed + metrics.pending + metrics.delayed);
  const completionRate = totalTasksValue > 0 ? Math.round((metrics.completed / totalTasksValue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-x-hidden no-scrollbar">
      <Header />
      <main className="py-6 px-4">
        <div className="flex flex-col gap-6 relative z-10">
          {/* Dashboard Header with Gradient Title */}
          <DashboardHeader />

          {/* Overview Cards with Glassmorphism Effect */}
          <OverviewCards 
            qualifiedLeads={qualifiedLeads}
            totalLeads={leads.length}
            pendingDemands={pendingDemands}
            pendingChecklistItems={pendingChecklistItems}
            completionRate={completionRate}
            leadsLoading={leadsLoading}
            demandsLoading={demandsLoading}
            checklistLoading={checklistLoading}
            metricsLoading={metricsLoading}
          />

          {/* Tabs with Futuristic Styling */}
          <DashboardTabs 
            leads={leads}
            demands={demands}
            users={users}
            leadsLoading={leadsLoading}
            demandsLoading={demandsLoading}
            usersLoading={usersLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
