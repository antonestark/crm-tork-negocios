import React, { useState } from 'react'; // Import useState
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLeads } from '@/hooks/use-leads';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog'; // Import LeadFormDialog
import { Lead } from '@/types/admin'; // Import Lead type
import { NewLead } from '@/services/leads-service'; // Import NewLead type
import { toast } from 'sonner'; // Import toast for feedback
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ResourcePage, ActionType } from '@/types/permissions';

const Leads = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null); // State for editing
  
  const { 
    leads, 
    loading, 
    error,
    fetchLeads, 
    addLead, 
    updateLead, 
    updateLeadStatus, 
    deleteLead 
  } = useLeads();

  // Mock users array for the leads form dropdown
  // In a real application, you would fetch this from an API
  const users = [
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'Support Team' }
  ];

  // Function to handle opening the dialog for editing
  // This needs to be passed down to LeadCard eventually
  const handleEditLeadRequest = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  // Function to handle form submission (Create or Update)
  const handleFormSubmit = async (data: Partial<Lead>): Promise<boolean> => { // Ensure return type is boolean
    try {
      let success = false;
      if (selectedLead) {
        // Update existing lead
        success = await updateLead({ ...selectedLead, ...data });
        if (success) toast.success('Lead atualizado com sucesso');
      } else {
        // Add new lead
        // Ensure name is present for addLead (required by NewLead type)
        if (!data.name) {
          toast.error('O nome do lead é obrigatório.');
          return false; 
        }
        // Call addLead only once with type assertion
        const newLeadResult = await addLead(data as NewLead); 
        success = !!newLeadResult;
        if (success) toast.success('Lead adicionado com sucesso');
      }
      
      if (success) {
        setIsDialogOpen(false); // Close dialog on success
        setSelectedLead(null); // Reset selected lead
      } else {
         toast.error(selectedLead ? 'Erro ao atualizar lead' : 'Erro ao adicionar lead');
      }
      return success; // Return boolean for form state
    } catch (err) {
      console.error("Error saving lead:", err);
      toast.error("Ocorreu um erro inesperado.");
      return false;
    }
  };


  return (
    <PermissionGuard page={ResourcePage.LEADS} action={ActionType.VIEW}>
      <BaseLayout>
        {/* Removed px-4, max-w-7xl, mx-auto */}
        <div className="py-6"> 
          <div className="flex justify-between items-center mb-6 animate-fade-in px-4"> {/* Added px-4 here */}
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
              Leads
            </h2>
            {/* This button now correctly controls the dialog state */}
            <PermissionGuard page={ResourcePage.LEADS} action={ActionType.CREATE}>
              <Button 
                className="group border border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  setSelectedLead(null); // Ensure we are creating, not editing
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Novo Lead</span>
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </PermissionGuard>
          </div>
          {/* Added px-4 here */}
          <div className="animate-fade-in px-4"> 
            <LeadsKanban 
              leads={leads || []} 
              users={users}
              loading={loading}
              onAddLead={addLead} // Still pass addLead if needed elsewhere
              onUpdateLead={updateLead} // Still pass updateLead if needed elsewhere
              onUpdateLeadStatus={updateLeadStatus}
              onDeleteLead={deleteLead}
              onRefresh={fetchLeads}
              // Pass the edit request handler down
              // onEditLead={handleEditLeadRequest} // TODO: Pass this down through Kanban -> Column -> Card
            />
          </div>
        </div>
        
        {/* Render the LeadFormDialog here, controlled by local state */}
        <LeadFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          lead={selectedLead}
          users={users}
        />
      </BaseLayout>
    </PermissionGuard>
  );
};

export default Leads;
