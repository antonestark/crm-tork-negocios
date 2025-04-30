import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Department } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth
import { departmentAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

// --- Service Functions (could be moved to services/departments-service.ts) ---

const fetchDepartmentsService = async (): Promise<Department[]> => {
  console.log('Fetching departments from Supabase...');
  const { data, error } = await supabase
    .from('departments')
    .select(`*`) // Select all columns
    .order('name');
  
  if (error) {
    console.error('Supabase error fetching departments:', error);
    throw new Error(`Failed to fetch departments: ${error.message}`);
  }
  
  console.log('Departments raw data received:', data?.length || 0, 'records');
  const adaptedData = departmentAdapter(data || []);
  // Temporarily setting member count to 0 as in original hook
  // Assuming departmentAdapter handles potential type differences (like id string -> number)
  // If not, ensure the adapter converts id and parent_id to numbers here.
  return adaptedData.map(dept => ({ ...dept, id: Number(dept.id), parent_id: dept.parent_id ? Number(dept.parent_id) : null, _memberCount: 0 })); 
};

// Ensure the input type matches the expected partial structure based on the corrected Department type
const addDepartmentService = async (department: Partial<Omit<Department, 'id'>>): Promise<Department | null> => {
  console.log('Adding new department:', department.name);
  const { data, error } = await supabase
    .from('departments')
    .insert([{
      name: department.name,
      description: department.description,
      // Add other insertable properties here
    }])
    .select()
    .single(); // Expect one row back
  
  if (error) {
    console.error('Error adding department:', error);
    throw new Error(`Failed to add department: ${error.message}`);
  }
  
  const newDepartment = departmentAdapter(data ? [data] : [])[0];
  if (newDepartment) {
     newDepartment._memberCount = 0; // Add temporary count
  }
  console.log('Department added successfully via service:', newDepartment?.name);
  return newDepartment || null;
};

const updateDepartmentService = async (department: Partial<Department> & { id: string | number }): Promise<boolean> => {
  console.log('Updating department via service:', department.id, department.name);
  // ID should already be a number based on the corrected Department type
  if (typeof department.id !== 'number') {
      throw new Error("Invalid department ID type for update.");
  }
  const departmentId = department.id;
  
  // Exclude non-updatable fields and ensure parent_id is number or null
  const { id, created_at, updated_at, _memberCount, manager, ...updateDataBase } = department;
  const updateData = {
      ...updateDataBase,
      parent_id: updateDataBase.parent_id ? Number(updateDataBase.parent_id) : null
  };


  const { error } = await supabase
    .from('departments')
    .update(updateData) // Pass only updatable fields
    .eq('id', departmentId);
  
  if (error) {
    console.error('Error updating department:', error);
    throw new Error(`Failed to update department: ${error.message}`);
  }
  console.log('Department updated successfully via service:', department.name);
  return true;
};

const deleteDepartmentService = async (id: string | number): Promise<boolean> => {
  console.log('Deleting department via service:', id);
  // ID should be number
  if (typeof id !== 'number') {
     throw new Error("Invalid department ID type for delete.");
  }
  const departmentId = id;
  
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', departmentId);
  
  if (error) {
    console.error('Error deleting department:', error);
    throw new Error(`Failed to delete department: ${error.message}`);
  }
  console.log('Department deleted successfully via service');
  return true;
};


// --- React Query Hook ---

export const useDepartments = () => {
  const queryClient = useQueryClient();
  const { session, isLoading: isAuthLoading } = useAuth(); // Get auth state
  const queryKey = ['departments'];

  // --- Query ---
  const { data: departments = [], isLoading: loading, error } = useQuery<Department[], Error>({
    queryKey: queryKey,
    queryFn: fetchDepartmentsService,
    enabled: !!session && !isAuthLoading, // Enable only when authenticated
  });

  // --- Mutations ---
  const addMutation = useMutation({
    mutationFn: addDepartmentService,
    onSuccess: (newDepartment) => {
      if (newDepartment) {
        // Optimistic update or invalidate
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Departamento adicionado com sucesso');
      } else {
         toast.error('Erro ao adicionar departamento');
      }
    },
    onError: (err) => {
      toast.error('Falha ao adicionar departamento', { description: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartmentService,
    onSuccess: (success, variables) => {
      if (success) {
        // Optimistic update or invalidate
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Departamento atualizado com sucesso');
      } else {
         toast.error('Erro ao atualizar departamento');
      }
    },
    onError: (err) => {
      toast.error('Falha ao atualizar departamento', { description: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartmentService,
    onSuccess: (success, variables) => { // variables is the id
      if (success) {
        // Optimistic update or invalidate
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Departamento excluído com sucesso');
      } else {
         toast.error('Erro ao excluir departamento');
      }
    },
    onError: (err) => {
      toast.error('Falha ao excluir departamento', { description: err.message });
    },
  });

  // --- Realtime Subscription ---
  useEffect(() => {
    const channel = supabase
      .channel('departments_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'departments' 
      }, (payload) => {
        console.log('Department data changed (realtime), invalidating query...', payload);
        queryClient.invalidateQueries({ queryKey: queryKey });
      })
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') console.log('Realtime channel for departments subscribed.');
         if (status === 'CHANNEL_ERROR') console.error('Realtime channel error (departments):', err);
         if (status === 'TIMED_OUT') console.warn('Realtime channel subscription timed out (departments).');
      });
      
    return () => {
      console.log('useDepartments: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey]); // queryKey included for stability if it changes

  return {
    departments,
    loading,
    error,
    addDepartment: addMutation.mutate,
    updateDepartment: updateMutation.mutate,
    deleteDepartment: deleteMutation.mutate,
    // fetchDepartments is handled by useQuery, no need to expose unless manual refresh is desired
  };
};
