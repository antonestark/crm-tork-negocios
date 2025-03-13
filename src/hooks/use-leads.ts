
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
      const processedLeads = data.map((lead: any) => {
        // Split the name field from the user if it exists
        let assignedUser = null;
        if (lead.assignedUser) {
          try {
            const nameParts = (lead.assignedUser.name || '').split(' ');
            assignedUser = {
              ...lead.assignedUser,
              first_name: nameParts[0] || '',
              last_name: nameParts.slice(1).join(' ') || '',
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
            // Provide a fallback if assignedUser cannot be processed
            assignedUser = {
              id: lead.assigned_to,
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
          }
        }

        return {
          ...lead,
          assignedUser
        };
      });
      
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

  const addLead = async (lead: NewLead) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select();
      
      if (error) throw error;
      
      await logLeadActivity(data[0].id, 'created', { leadName: lead.name });
      
      setLeads(prev => [data[0], ...prev]);
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
      const { error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', lead.id);
      
      if (error) throw error;

      await logLeadActivity(lead.id, 'updated', { changes: lead });
      
      setLeads(prev => 
        prev.map(l => l.id === lead.id ? { ...l, ...lead } : l)
      );
      
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
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;

      await logLeadActivity(id, 'status_changed', { status });
      
      setLeads(prev => 
        prev.map(l => l.id === id ? { ...l, status } : l)
      );
      
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
      
      if (error) throw error;
      
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
