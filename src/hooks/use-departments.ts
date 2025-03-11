
import { useState, useEffect } from 'react';
import { Department } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { departmentAdapter } from '@/integrations/supabase/adapters';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      
      const adaptedData = departmentAdapter(data || []);
      // Add _memberCount property to each department
      const departmentsWithCount = adaptedData.map(dept => ({
        ...dept,
        _memberCount: 0 // Default value, will be calculated later
      }));
      
      setDepartments(departmentsWithCount);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department: Department) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: department.name,
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
      return false;
    }
  };

  const updateDepartment = async (department: Department) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update({
          name: department.name,
          // Add other properties as needed
        })
        .eq('id', department.id);
      
      if (error) throw error;
      
      setDepartments(prev => 
        prev.map(d => d.id === department.id ? { ...d, ...department } : d)
      );
      return true;
    } catch (err) {
      console.error('Error updating department:', err);
      return false;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDepartments(prev => prev.filter(d => d.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting department:', err);
      return false;
    }
  };

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
