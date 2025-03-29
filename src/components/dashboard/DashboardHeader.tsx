
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
        Dashboard
      </h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.reload()}
        className="group border border-cyan-500/50 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-950/30 rounded-full w-full md:w-auto transition-all duration-300 relative overflow-hidden"
      >
        <RefreshCw className="h-4 w-4 mr-2 group-hover:animate-spin" />
        <span className="relative z-10">Atualizar dados</span>
        <span className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transition-all duration-300 group-hover:w-full"></span>
      </Button>
    </div>
  );
};
