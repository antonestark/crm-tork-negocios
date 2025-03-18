
import { useState, useEffect } from 'react';
import { Client } from '@/types/clients';
import { supabase } from '@/integrations/supabase/client';
import { clientAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

// Define interface for client creation
export interface ClientCreate extends Partial<Client> {
  company_name: string;  // Make company_name required for new clients
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
      // Check if company_name exists
      if (!clientData.company_name) {
        throw new Error('Nome da empresa é obrigatório');
      }
      
      console.log('Adding new client with data:', clientData);
      
      // Insert into clients table
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
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
      console.log('Updating client with data:', clientData);
      
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientData.id);
      
      if (error) throw error;
      
      console.log('Client updated successfully');
      setClients(prev => 
        prev.map(c => c.id === clientData.id ? { ...c, ...clientData } : c)
      );
      toast.success('Cliente atualizado com sucesso');
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
      toast.success('Cliente excluído com sucesso');
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
