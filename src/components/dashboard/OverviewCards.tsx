
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity,
  CheckCircle, 
  FileCheck, 
  Skeleton, 
  Users 
} from 'lucide-react';

interface OverviewCardsProps {
  qualifiedLeads: number | string;
  totalLeads: number | string;
  pendingDemands: number | string;
  pendingChecklistItems: number | string;
  completionRate: number;
  leadsLoading: boolean;
  demandsLoading: boolean;
  checklistLoading: boolean;
  metricsLoading: boolean;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ 
  qualifiedLeads,
  totalLeads,
  pendingDemands,
  pendingChecklistItems,
  completionRate,
  leadsLoading,
  demandsLoading,
  checklistLoading,
  metricsLoading
}) => {
  return (
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
            De um total de {leadsLoading ? "..." : totalLeads} leads
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
  );
};
