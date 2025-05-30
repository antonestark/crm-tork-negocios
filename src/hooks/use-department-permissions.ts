
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DepartmentPermission {
  id: string;
  department_id: number;
  permission_id: string;
  created_at: string;
}

export const useDepartmentPermissions = (departmentId?: number) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentPermissions();
    } else {
      setPermissions([]);
      setLoading(false);
    }
  }, [departmentId]);

  const fetchDepartmentPermissions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('department_permissions')
        .select('permission_id')
        .eq('department_id', departmentId);
      
      if (error) throw error;

      // Safely handle the data
      if (Array.isArray(data)) {
        // Map the permission IDs only if valid data exists
        const permissionIds = data
          .filter(item => item && typeof item === 'object' && item.permission_id)
          .map(item => item.permission_id);
          
        setPermissions(permissionIds);
      } else {
        console.log('Data is not an array:', data);
        setPermissions([]);
      }
    } catch (err) {
      console.error('Error fetching department permissions:', err);
      setError(err as Error);
      toast.error('Falha ao carregar permissões do departamento');
    } finally {
      setLoading(false);
    }
  };

  const updateDepartmentPermissions = async (permissionIds: string[]) => {
    if (!departmentId) return false;
    
    try {
      // First, delete all existing permissions for this department
      const { error: deleteError } = await supabase
        .from('department_permissions')
        .delete()
        .eq('department_id', departmentId);
      
      if (deleteError) throw deleteError;
      
      // Then, add the new permissions
      if (permissionIds.length > 0) {
        const permissionsToInsert = permissionIds.map(permissionId => ({
          department_id: departmentId,
          permission_id: permissionId
        }));
        
        const { error: insertError } = await supabase
          .from('department_permissions')
          .insert(permissionsToInsert);
        
        if (insertError) throw insertError;
      }
      
      setPermissions(permissionIds);
      toast.success('Permissões do departamento atualizadas com sucesso');
      return true;
    } catch (err) {
      console.error('Error updating department permissions:', err);
      toast.error('Falha ao atualizar permissões do departamento');
      return false;
    }
  };

  return {
    permissions,
    loading,
    error,
    updateDepartmentPermissions,
    fetchDepartmentPermissions
  };
};
