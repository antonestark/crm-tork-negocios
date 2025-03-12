
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
    fetchDepartments();

    // Set up a realtime subscription
    const subscription = supabase
      .channel('departments_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'departments' 
      }, () => {
        fetchDepartments();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:users(id, name)
        `);
      
      if (error) throw error;
      
      const adaptedData = departmentAdapter(data || []);
      
      // Get member counts for each department
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('department_id');
        
      if (!userError) {
        // Count members per department
        const counts: Record<string, number> = {};
        userData?.forEach(user => {
          if (user.department_id) {
            const deptId = user.department_id.toString();
            counts[deptId] = (counts[deptId] || 0) + 1;
          }
        });
        
        // Add member counts to departments
        const departmentsWithCount = adaptedData.map(dept => ({
          ...dept,
          _memberCount: counts[dept.id] || 0
        }));
        
        setDepartments(departmentsWithCount);
      } else {
        // If we can't get member counts, just use the adapted data
        setDepartments(adaptedData);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err as Error);
      toast.error('Falha ao carregar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department: Partial<Department>) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: department.name,
          description: department.description,
          // Add other properties as needed
        }])
        .select();
      
      if (error) throw error;
      
      const newDepartment = departmentAdapter(data || [])[0];
      newDepartment._memberCount = 0;
      
      setDepartments(prev => [...prev, newDepartment]);
      return true;
    } catch (err) {
      console.error('Error adding department:', err);
      toast.error('Falha ao adicionar departamento');
      return false;
    }
  };

  const updateDepartment = async (department: Department) => {
    try {
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
      
      if (error) throw error;
      
      setDepartments(prev => 
        prev.map(d => d.id === department.id ? { ...d, ...department } : d)
      );
      toast.success('Departamento atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Error updating department:', err);
      toast.error('Falha ao atualizar departamento');
      return false;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      // Convert id to number if it's a string
      const departmentId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);
      
      if (error) throw error;
      
      setDepartments(prev => prev.filter(d => d.id !== id));
      toast.success('Departamento excluído com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error('Falha ao excluir departamento');
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
