
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useLeads } from '@/hooks/use-leads';
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const LeadsPage = () => {
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
  
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
    // Log the number of leads for debugging
    console.log("Initial leads count:", leads.length);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);
      console.log("Fetching users...");
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching users:', error);
        setUsersError(error);
        throw error;
      }
      
      console.log("Users data:", data);
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError(err as Error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing leads data...");
    fetchLeads();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Leads</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm h-[calc(100vh-200px)]">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar leads</AlertTitle>
              <AlertDescription>
                {error.message}
                <div className="mt-2">
                  <button 
                    onClick={handleRefresh}
                    className="text-sm underline hover:text-primary"
                  >
                    Tentar novamente
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {usersError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar usuários</AlertTitle>
              <AlertDescription>
                {usersError.message}
                <div className="mt-2">
                  <button 
                    onClick={fetchUsers}
                    className="text-sm underline hover:text-primary"
                  >
                    Tentar novamente
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <LeadsKanban 
            leads={leads}
            users={users}
            loading={loading || loadingUsers}
            onAddLead={addLead}
            onUpdateLead={updateLead}
            onUpdateLeadStatus={updateLeadStatus}
            onDeleteLead={deleteLead}
            onRefresh={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
};

export default LeadsPage;
