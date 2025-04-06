
import { useState, useEffect } from 'react';
import { Department } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { departmentAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('useDepartments: Initializing hook');
    fetchDepartments();

    // Set up a realtime subscription
    const subscription = supabase
      .channel('departments_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'departments' 
      }, () => {
        console.log('Department data changed, refreshing...');
        fetchDepartments();
      })
      .subscribe();
      
    return () => {
      console.log('useDepartments: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments from Supabase...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *
          // Removed manager:users(id, name) - Causes error due to missing FK
        `)
        .order('name');
      
      if (error) {
        console.error('Supabase error fetching departments:', error);
        throw new Error(`Failed to fetch departments: ${error.message}`);
      }
      
      console.log('Departments raw data received:', data?.length || 0, 'records');
      const adaptedData = departmentAdapter(data || []);

      // TESTE: Remover busca de contagem de membros para simplificar
      setDepartments(adaptedData.map(dept => ({ ...dept, _memberCount: 0 }))); // Define _memberCount como 0 temporariamente
      console.log('Departments processed (sem contagem):', adaptedData.length);
    } catch (err) {
      console.error('Error in fetchDepartments:', err);
      setError(err as Error);
      toast.error('Falha ao carregar departamentos', {
        description: (err as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department: Partial<Department>) => {
    try {
      console.log('Adding new department:', department.name);
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: department.name,
          description: department.description,
          // Add other properties as needed
        }])
        .select();
      
      if (error) {
        console.error('Error adding department:', error);
        throw new Error(`Failed to add department: ${error.message}`);
      }
      
      const newDepartment = departmentAdapter(data || [])[0];
      newDepartment._memberCount = 0;
      
      setDepartments(prev => [...prev, newDepartment]);
      console.log('Department added successfully:', newDepartment.name);
      return true;
    } catch (err) {
      console.error('Error in addDepartment:', err);
      toast.error('Falha ao adicionar departamento', {
        description: (err as Error).message
      });
      return false;
    }
  };

  const updateDepartment = async (department: Department) => {
    try {
      console.log('Updating department:', department.id, department.name);
      // Convert department.id to number if it's a string
      const departmentId = typeof department.id === 'string' ? parseInt(department.id, 10) : department.id;
      
      const { error } = await supabase
        .from('departments')
        .update({
          name: department.name,
          description: department.description,
          // Add other properties as needed
        })
        .eq('id', departmentId);
      
      if (error) {
        console.error('Error updating department:', error);
        throw new Error(`Failed to update department: ${error.message}`);
      }
      
      setDepartments(prev => 
        prev.map(d => d.id === department.id ? { ...d, ...department } : d)
      );
      toast.success('Departamento atualizado com sucesso');
      console.log('Department updated successfully:', department.name);
      return true;
    } catch (err) {
      console.error('Error in updateDepartment:', err);
      toast.error('Falha ao atualizar departamento', {
        description: (err as Error).message
      });
      return false;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      console.log('Deleting department:', id);
      // Convert id to number if it's a string
      const departmentId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);
      
      if (error) {
        console.error('Error deleting department:', error);
        throw new Error(`Failed to delete department: ${error.message}`);
      }
      
      setDepartments(prev => prev.filter(d => d.id !== id));
      toast.success('Departamento excluído com sucesso');
      console.log('Department deleted successfully');
      return true;
    } catch (err) {
      console.error('Error in deleteDepartment:', err);
      toast.error('Falha ao excluir departamento', {
        description: (err as Error).message
      });
      return false;
    }
  };

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    fetchDepartments
  };
};
