
import React from 'react';
import { Button } from '@/components/ui/button';

export const DashboardHeader = () => {
  return (
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
  );
};
