
import React from 'react';
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Leads = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <BaseLayout>
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Leads
          </h2>
          <Button 
            className="group border border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Novo Lead</span>
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 transition-all duration-300 group-hover:w-full"></span>
          </Button>
        </div>
        <div className="animate-fade-in">
          <LeadsKanban onOpenDialog={() => setIsDialogOpen(true)} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default Leads;
