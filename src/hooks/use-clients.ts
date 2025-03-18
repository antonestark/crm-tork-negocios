
import { useState, useEffect } from 'react';
import { Client } from '@/types/clients';
import { supabase } from '@/integrations/supabase/client';
import { clientAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

export interface ClientCreate extends Partial<Client> {
  company_name: string;  // Make company name required for new clients
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchClients();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'clients' 
      }, () => {
        fetchClients();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      console.log('Fetching clients from database...');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      
      console.log('Clients data fetched successfully:', data);
      const adaptedData = clientAdapter(data || []);
      setClients(adaptedData);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err as Error);
      toast.error('Falha ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: ClientCreate) => {
    try {
      // Check if company name exists
      if (!clientData.company_name) {
        throw new Error('Nome da empresa é obrigatório');
      }
      
      // Create properly typed client object for Supabase
      const clientDataForDb = {
        company_name: clientData.company_name,
        trading_name: clientData.trading_name,
        responsible: clientData.responsible,
        room: clientData.room,
        meeting_room_credits: clientData.meeting_room_credits || 0,
        status: clientData.status || 'active',
        contract_start_date: clientData.contract_start_date,
        contract_end_date: clientData.contract_end_date,
        cnpj: clientData.cnpj,
        address: clientData.address,
        email: clientData.email,
        phone: clientData.phone,
        monthly_value: clientData.monthly_value || 0,
        notes: clientData.notes
      };
      
      console.log('Adding new client with data:', clientDataForDb);
      
      // Check if company with same name already exists
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id, company_name')
        .eq('company_name', clientData.company_name)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking for existing client:', checkError);
      }
      
      if (existingClient) {
        throw new Error(`Cliente com nome ${clientData.company_name} já existe`);
      }
      
      // Insert into clients table
      const { data, error } = await supabase
        .from('clients')
        .insert(clientDataForDb)
        .select();
      
      if (error) {
        console.error('Error inserting client to database:', error);
        throw error;
      }
      
      console.log('Client added successfully to database:', data);
      const newClient = clientAdapter(data || [])[0];
      setClients(prev => [...prev, newClient]);
      
      toast.success('Cliente adicionado com sucesso');
      return true;
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error(`Falha ao adicionar cliente: ${err.message || 'Erro desconhecido'}`);
      return false;
    }
  };

  const updateClient = async (clientData: Client) => {
    try {
      const updateData = {
        company_name: clientData.company_name,
        trading_name: clientData.trading_name,
        responsible: clientData.responsible,
        room: clientData.room,
        meeting_room_credits: clientData.meeting_room_credits,
        status: clientData.status,
        contract_start_date: clientData.contract_start_date,
        contract_end_date: clientData.contract_end_date,
        cnpj: clientData.cnpj,
        address: clientData.address,
        email: clientData.email,
        phone: clientData.phone,
        monthly_value: clientData.monthly_value,
        notes: clientData.notes
      };
      
      console.log('Updating client with data:', updateData);
      
      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientData.id);
      
      if (error) throw error;
      
      console.log('Client updated successfully');
      setClients(prev => 
        prev.map(c => c.id === clientData.id ? { ...c, ...clientData } : c)
      );
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error(`Falha ao atualizar cliente: ${err.message || 'Erro desconhecido'}`);
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      console.log('Deleting client with ID:', id);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('Client deleted successfully');
      setClients(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error(`Falha ao excluir cliente: ${err.message || 'Erro desconhecido'}`);
      return false;
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
};
