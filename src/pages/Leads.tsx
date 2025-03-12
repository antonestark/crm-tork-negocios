
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useLeads } from '@/hooks/use-leads';
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { supabase } from '@/integrations/supabase/client';

const LeadsPage = () => {
  const { 
    leads, 
    loading, 
    fetchLeads,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead
  } = useLeads();
  
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Leads</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm h-[calc(100vh-200px)]">
          <LeadsKanban 
            leads={leads}
            users={users}
            loading={loading || loadingUsers}
            onAddLead={addLead}
            onUpdateLead={updateLead}
            onUpdateLeadStatus={updateLeadStatus}
            onDeleteLead={deleteLead}
            onRefresh={fetchLeads}
          />
        </div>
      </main>
    </div>
  );
};

export default LeadsPage;
