
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity,
  CheckCircle, 
  FileCheck, 
  Users 
} from 'lucide-react';

interface OverviewCardsProps {
  qualifiedLeads: number | string;
  totalLeads: number | string;
  pendingDemands: number | string;
  pendingChecklistItems: number | string;
  completionRate: number;
  loading: boolean;
}

export const OverviewCards = ({ 
  qualifiedLeads,
  totalLeads,
  pendingDemands,
  pendingChecklistItems,
  completionRate,
  loading,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/50 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-slate-900/0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">Leads Qualificados</CardTitle>
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
            <Users className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? <Skeleton className="h-8 w-16 bg-slate-800" /> : qualifiedLeads}
          </div>
          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            De um total de {loading ? "..." : totalLeads} leads
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/50 backdrop-blur-md border border-purple-900/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-slate-900/0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">Demandas Pendentes</CardTitle>
          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
            <FileCheck className="h-4 w-4 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? <Skeleton className="h-8 w-16 bg-slate-800" /> : pendingDemands}
          </div>
          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            Aguardando atendimento
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/50 backdrop-blur-md border border-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-slate-900/0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">Items do Checklist</CardTitle>
          <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? <Skeleton className="h-8 w-16 bg-slate-800" /> : pendingChecklistItems}
          </div>
          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            Pendentes de verificação
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/50 backdrop-blur-md border border-indigo-900/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-slate-900/0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">Taxa de Conclusão</CardTitle>
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors duration-300">
            <Activity className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? <Skeleton className="h-8 w-16 bg-slate-800" /> : `${completionRate}%`}
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full relative"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
