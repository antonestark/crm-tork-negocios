
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/admin";
import { toast } from "sonner";

// Type definitions
export type NewLead = Partial<Lead> & { name: string };

// Function to fetch all leads with their assigned users
export const fetchLeads = async (): Promise<Lead[]> => {
  try {
    console.log("Fetching leads from database...");
    
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        assignedUser:assigned_to(id, email, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    console.log("Leads data from database:", data);
    
    // Process the data to match the Lead interface
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
    
    return processedLeads;
  } catch (err) {
    console.error('Error in fetchLeads:', err);
    throw err;
  }
};

// Add a new lead to the database
export const addLead = async (lead: NewLead): Promise<Lead | null> => {
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
    
    return data[0];
  } catch (err) {
    console.error('Error adding lead:', err);
    return null;
  }
};

// Update an existing lead in the database
export const updateLead = async (lead: Partial<Lead>): Promise<boolean> => {
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
    
    return true;
  } catch (err) {
    console.error('Error updating lead:', err);
    return false;
  }
};

// Update the status of a lead
export const updateLeadStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const normalizedStatus = normalizeStatus(status);
    
    const { error } = await supabase
      .from('leads')
      .update({ status: normalizedStatus })
      .eq('id', id);
    
    if (error) throw error;

    await logLeadActivity(id, 'status_changed', { status: normalizedStatus });
    
    return true;
  } catch (err) {
    console.error('Error updating lead status:', err);
    return false;
  }
};

// Delete a lead from the database
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error deleting lead:', err);
    return false;
  }
};

// Log lead activity to the database
export const logLeadActivity = async (
  leadId: string, 
  action: string, 
  details: Record<string, any> = {}
): Promise<boolean> => {
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

// Helper function to normalize status values
export const normalizeStatus = (status: string): string => {
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
export const createDefaultUser = (userId: string | null) => {
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
