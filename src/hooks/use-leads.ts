
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/admin';
import { toast } from 'sonner';

// Create a type that ensures name is required
type NewLead = Partial<Lead> & { name: string };

export const useLeads = () => {
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
      
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          assignedUser:assigned_to(id, email, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log("Leads data from API:", data);
      
      // Process the data to match our Lead interface
      const processedLeads = data?.map((lead: any) => {
        // Normalize lead status to ensure consistent case
        const normalizedStatus = normalizeStatus(lead.status);
        
        // Process assigned user data if available
        let assignedUser = null;
        if (lead.assignedUser) {
          try {
            assignedUser = {
              id: lead.assignedUser.id || lead.assigned_to,
              email: lead.assignedUser.email || null,
              name: lead.assignedUser.name || 'Unknown User',
              first_name: lead.assignedUser.name ? lead.assignedUser.name.split(' ')[0] : 'Unknown',
              last_name: lead.assignedUser.name ? 
                lead.assignedUser.name.split(' ').slice(1).join(' ') : 'User',
              profile_image_url: null,
              role: 'user',
              phone: null,
              active: true,
              status: 'active',
              last_login: null,
              settings: {},
              metadata: {},
            };
          } catch (err) {
            console.error('Error processing assignedUser:', err);
            assignedUser = createDefaultUser(lead.assigned_to);
          }
        }

        return {
          ...lead,
          status: normalizedStatus,
          assignedUser
        };
      }) || [];
      
      console.log("Processed leads:", processedLeads);
      setLeads(processedLeads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err as Error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize status values
  const normalizeStatus = (status: string): string => {
    if (!status) return 'neutro';
    
    status = status.toLowerCase();
    
    if (status.includes('qualificado') && status.includes('não')) {
      return 'não qualificado';
    } else if (status.includes('qualificado')) {
      return 'qualificado';
    } else {
      return 'neutro';
    }
  };

  // Helper function to create a default user object when data is missing
  const createDefaultUser = (userId: string | null) => {
    return {
      id: userId || '',
      email: null,
      name: 'Unknown User',
      first_name: 'Unknown',
      last_name: 'User',
      profile_image_url: null,
      role: 'user',
      phone: null,
      active: true,
      status: 'active',
      last_login: null,
      settings: {},
      metadata: {},
    };
  };

  const addLead = async (lead: NewLead) => {
    try {
      // Normalize status before saving
      const normalizedLead = {
        ...lead,
        status: normalizeStatus(lead.status || 'neutro')
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert([normalizedLead])
        .select();
      
      if (error) throw error;
      
      await logLeadActivity(data[0].id, 'created', { leadName: lead.name });
      
      // Fetch all leads to ensure consistency
      await fetchLeads();
      
      toast.success('Lead adicionado com sucesso');
      return data[0];
    } catch (err) {
      console.error('Error adding lead:', err);
      toast.error('Erro ao adicionar lead');
      return null;
    }
  };

  const updateLead = async (lead: Partial<Lead>) => {
    if (!lead.id) {
      console.error('Lead ID is required for update');
      return false;
    }

    try {
      // Normalize status before saving
      const normalizedLead = lead.status 
        ? { ...lead, status: normalizeStatus(lead.status) } 
        : lead;
      
      const { error } = await supabase
        .from('leads')
        .update(normalizedLead)
        .eq('id', lead.id);
      
      if (error) throw error;

      await logLeadActivity(lead.id, 'updated', { changes: normalizedLead });
      
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
      const normalizedStatus = normalizeStatus(status);
      
      const { error } = await supabase
        .from('leads')
        .update({ status: normalizedStatus })
        .eq('id', id);
      
      if (error) throw error;

      await logLeadActivity(id, 'status_changed', { status: normalizedStatus });
      
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
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error('Erro ao remover lead');
      return false;
    }
  };

  const logLeadActivity = async (leadId: string, action: string, details: Record<string, any> = {}) => {
    try {
      const { error } = await supabase
        .from('lead_activities')
        .insert([{
          lead_id: leadId,
          action,
          details
        }]);
      
      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error logging activity:', err);
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
