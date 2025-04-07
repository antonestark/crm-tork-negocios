
import React from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useDashboardData } from '@/hooks/use-dashboard-data';

const Dashboard = () => {
  const { data, loading } = useDashboardData();
  
  // Calculate overview stats
  const qualifiedLeads = loading ? '...' : data.leads.filter(lead => lead.status === 'qualificado').length;
  const pendingDemands = loading ? '...' : data.demands.filter(demand => demand.status === 'open').length;
  const pendingChecklistItems = loading ? '...' : data.checklistItems.filter(item => !item.completed).length;
  
  const totalTasksValue = loading ? 0 : (data.metrics[0]?.completed_tasks + data.metrics[0]?.pending_tasks + data.metrics[0]?.delayed_tasks);
  const completionRate = totalTasksValue > 0 ? Math.round((data.metrics[0]?.completed_tasks / totalTasksValue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-x-hidden no-scrollbar relative">
      {/* Animated Particles/Grid Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </div>
      
      <Header />
      {/* Removed px-4 from main */}
      <main className="py-6 relative z-10"> 
        {/* Removed max-w-7xl, mx-auto and added px-4 to inner div */}
        <div className="flex flex-col gap-6 px-4"> 
          {/* Dashboard Header with Gradient Title */}
          <DashboardHeader />

          {/* Overview Cards with Glassmorphism Effect */}
          <OverviewCards 
            qualifiedLeads={qualifiedLeads}
            totalLeads={data.leads.length}
            pendingDemands={pendingDemands}
            pendingChecklistItems={pendingChecklistItems}
            completionRate={completionRate}
            loading={loading}
          />

          {/* Tabs with Futuristic Styling */}
          <DashboardTabs 
            leads={data.leads}
            demands={data.demands}
            users={data.users}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
