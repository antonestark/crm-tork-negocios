import React, { useState } from 'react';
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react'; // Added Loader2
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import { 
  fetchLeads as fetchLeadsService, 
  addLead as addLeadService,
  updateLead as updateLeadService,
  updateLeadStatus as updateLeadStatusService,
  deleteLead as deleteLeadService,
  NewLead
} from '@/services/leads-service'; // Import service functions directly
import { LeadFormDialog } from '@/components/leads/LeadFormDialog'; 
import { Lead } from '@/types/admin'; 
import { toast } from 'sonner'; 
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ResourcePage, ActionType } from '@/types/permissions';

const Leads = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null); 
  
  const queryClient = useQueryClient();

  // --- Fetch Leads Query ---
  const { data: leads = [], isLoading: loading, error } = useQuery<Lead[], Error>({
    queryKey: ['leads'], // Define query key
    queryFn: fetchLeadsService, // Use the service function directly
  });

  // --- Add Lead Mutation ---
  const addLeadMutation = useMutation({
    mutationFn: addLeadService,
    onSuccess: (newLead) => {
      if (newLead) {
        queryClient.invalidateQueries({ queryKey: ['leads'] }); // Invalidate on success
        toast.success('Lead adicionado com sucesso');
        setIsDialogOpen(false); // Close dialog
        setSelectedLead(null); // Reset selection
      } else {
         toast.error('Erro ao adicionar lead'); 
      }
    },
    onError: (err) => {
      console.error("Error adding lead:", err);
      toast.error('Erro ao adicionar lead');
    }
  });

  // --- Update Lead Mutation ---
  const updateLeadMutation = useMutation({
    mutationFn: (updatedData: Partial<Lead>) => {
       if (!selectedLead?.id) throw new Error("No lead selected for update");
       // Assuming updateLeadService takes partial data with id
       return updateLeadService({ ...selectedLead, ...updatedData }); 
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        toast.success('Lead atualizado com sucesso');
        setIsDialogOpen(false);
        setSelectedLead(null);
      } else {
         toast.error('Erro ao atualizar lead');
      }
    },
    onError: (err) => {
      console.error("Error updating lead:", err);
      toast.error('Erro ao atualizar lead');
    }
  });
  
   // --- Update Lead Status Mutation ---
  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateLeadStatusService(id, status),
    onSuccess: (success, variables) => { // variables contains { id, status }
      if (success) {
        // Optimistic update (optional but good UX)
        queryClient.setQueryData(['leads'], (oldData: Lead[] | undefined) => 
           oldData ? oldData.map(lead => lead.id === variables.id ? { ...lead, status: variables.status } : lead) : []
        );
        // Invalidate to ensure consistency eventually
        queryClient.invalidateQueries({ queryKey: ['leads'] }); 
        toast.success('Status do lead atualizado');
      } else {
        toast.error('Erro ao atualizar status');
      }
    },
     onError: (err) => {
      console.error("Error updating lead status:", err);
      toast.error('Erro ao atualizar status');
    }
  });

  // --- Delete Lead Mutation ---
   const deleteLeadMutation = useMutation({
    mutationFn: deleteLeadService,
    onSuccess: (success, variables) => { // variables contains the id
      if (success) {
         // Optimistic update
         queryClient.setQueryData(['leads'], (oldData: Lead[] | undefined) => 
           oldData ? oldData.filter(lead => lead.id !== variables) : []
         );
        // Invalidate to ensure consistency eventually
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        toast.success('Lead removido com sucesso');
      } else {
         toast.error('Erro ao remover lead');
      }
    },
     onError: (err) => {
      console.error("Error deleting lead:", err);
      toast.error('Erro ao remover lead');
    }
  });

  // Mock users array - TODO: Fetch this properly
  const users = [
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'Support Team' }
  ];

  // Function to handle opening the dialog for editing
  const handleEditLeadRequest = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  // Function to handle form submission (calls the appropriate mutation)
  const handleFormSubmit = async (data: Partial<Lead>): Promise<boolean> => {
    if (selectedLead) {
      updateLeadMutation.mutate(data); 
    } else {
      if (!data.name) { 
        toast.error('O nome do lead é obrigatório.');
        return false; 
      }
      // Correct the assigned_to value before mutating
      const dataToMutate = {
        ...data,
        assigned_to: (data.assigned_to === 'unassigned') ? null : data.assigned_to
      };
      addLeadMutation.mutate(dataToMutate as NewLead);
    }
    // Return true optimistically - React Query handles UI updates via callbacks
    return true; 
  };

  // Handler for status update from Kanban
  const handleUpdateStatus = (id: string, status: string) => {
    updateLeadStatusMutation.mutate({ id, status });
  };

  // Handler for delete from Kanban
  const handleDeleteLead = (id: string) => {
     if (window.confirm('Tem certeza que deseja excluir este lead?')) {
       deleteLeadMutation.mutate(id);
     }
  };

  return (
    <PermissionGuard page={ResourcePage.LEADS} action={ActionType.VIEW}>
      <BaseLayout>
        <div className="py-6"> 
          <div className="flex justify-between items-center mb-6 animate-fade-in px-4"> 
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
              Leads
            </h2>
            <PermissionGuard page={ResourcePage.LEADS} action={ActionType.CREATE}>
              <Button 
                className="group border border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  setSelectedLead(null); 
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Novo Lead</span>
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </PermissionGuard>
          </div>
          <div className="animate-fade-in px-4"> 
            {loading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )}
            {error && (
              <div className="text-center text-red-500 py-4">
                Erro ao carregar leads: {error.message}
              </div>
            )}
            {!loading && !error && (
              <LeadsKanban 
                leads={leads} 
                users={users} // Pass mock users
                // Pass mutation functions or handlers
                onUpdateLeadStatus={handleUpdateStatus} 
                onDeleteLead={handleDeleteLead}
                onEditLead={handleEditLeadRequest} // Pass edit handler
                // Remove props related to direct data manipulation from useLeads
                // loading={loading} - Handled above
                // onAddLead - Handled by dialog submit
                // onUpdateLead - Handled by dialog submit
                // onRefresh - Handled by React Query invalidate/refetch
              />
            )}
          </div>
        </div>
        
        <LeadFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          lead={selectedLead}
          users={users} // Pass mock users to dialog
          // Pass mutation loading states if needed for form feedback
          isSaving={addLeadMutation.isPending || updateLeadMutation.isPending}
        />
      </BaseLayout>
    </PermissionGuard>
  );
};

export default Leads;
