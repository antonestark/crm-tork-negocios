
import { useState, useEffect } from 'react';
import { Company } from '@/types/companies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCompanies();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('companies_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'companies' 
      }, () => {
        fetchCompanies();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure it matches our Company type
      const transformedData: Company[] = data?.map(item => ({
        ...item,
        settings: typeof item.settings === 'string' 
          ? JSON.parse(item.settings) 
          : item.settings as CompanySettings
      })) || [];
      
      setCompanies(transformedData);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err as Error);
      toast.error('Falha ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: Company): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform the new data to match our Company type
      const transformedData: Company = {
        ...data,
        settings: typeof data.settings === 'string'
          ? JSON.parse(data.settings)
          : data.settings as CompanySettings
      };
      
      setCompanies(prev => [transformedData, ...prev]);
      return true;
    } catch (err) {
      console.error('Error adding company:', err);
      toast.error(`Falha ao adicionar empresa: ${(err as Error).message}`);
      return false;
    }
  };

  const updateCompany = async (companyData: Partial<Company>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', companyData.id);
      
      if (error) throw error;
      
      setCompanies(prev => 
        prev.map(c => c.id === companyData.id ? { ...c, ...companyData } : c)
      );
      return true;
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error(`Falha ao atualizar empresa: ${(err as Error).message}`);
      return false;
    }
  };

  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCompanies(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error(`Falha ao excluir empresa: ${(err as Error).message}`);
      return false;
    }
  };

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany
  };
};

// Add missing CompanySettings type here for local use
type CompanySettings = {
  user_limit?: number;
  connection_limit?: number;
  api_token?: string;
  [key: string]: any;
};
