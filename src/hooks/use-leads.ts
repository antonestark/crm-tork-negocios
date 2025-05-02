
import { useState, useEffect } from 'react';
import { Lead } from '@/types/admin';
import { toast } from 'sonner';
import { 
  fetchLeads as fetchLeadsService, 
  addLead as addLeadService,
  updateLead as updateLeadService,
  updateLeadStatus as updateLeadStatusService,
  deleteLead as deleteLeadService,
  NewLead
} from '@/services/leads-service';
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth

export const useLeads = () => {
  const { tenantId } = useAuth(); // Get tenantId from auth context
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching leads...");
      
      const data = await fetchLeadsService();
      console.log("Processed leads:", data);
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err as Error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (lead: NewLead) => {
    if (!tenantId) {
      toast.error("Erro: ID do inquilino não encontrado.");
      return null;
    }
    try {
      const newLead = await addLeadService(lead, tenantId); // Pass tenantId

      if (!newLead) {
        toast.error('Erro ao adicionar lead');
        return null;
      }
      
      // Fetch all leads to ensure consistency
      await fetchLeads();
      
      toast.success('Lead adicionado com sucesso');
      return newLead;
    } catch (err) {
      console.error('Error adding lead:', err);
      toast.error('Erro ao adicionar lead');
      return null;
    }
  };

  const updateLead = async (lead: Partial<Lead>) => {
    try {
      const success = await updateLeadService(lead);
      
      if (!success) {
        toast.error('Erro ao atualizar lead');
        return false;
      }
      
      // Fetch all leads to ensure consistency
      await fetchLeads();
      
      toast.success('Lead atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error('Erro ao atualizar lead');
      return false;
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const success = await updateLeadStatusService(id, status);
      
      if (!success) {
        toast.error('Erro ao atualizar status');
        return false;
      }
      
      // Fetch all leads to ensure consistency
      await fetchLeads();
      
      toast.success('Status do lead atualizado');
      return true;
    } catch (err) {
      console.error('Error updating lead status:', err);
      toast.error('Erro ao atualizar status');
      return false;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const success = await deleteLeadService(id);
      
      if (!success) {
        toast.error('Erro ao remover lead');
        return false;
      }
      
      // Update local state instead of fetching again
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error('Erro ao remover lead');
      return false;
    }
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead
  };
};
