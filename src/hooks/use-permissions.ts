
import { useState, useEffect } from 'react';
import { Permission } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module');
          
      if (error) throw error;
      
      setPermissions(data?.map(p => ({...p, selected: false})) || []);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const createPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .insert({
          name: permission.name,
          description: permission.description,
          module: permission.module,
          code: permission.code,
          resource_type: permission.resource_type,
          actions: permission.actions
        })
        .select();
      
      if (error) throw error;
      
      setPermissions(prev => [...prev, {...data[0], selected: false}]);
      toast.success("Permissão criada com sucesso");
      return true;
    } catch (err) {
      console.error('Error creating permission:', err);
      toast.error("Erro ao criar permissão");
      return false;
    }
  };
  
  const updatePermission = async (permission: Permission): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('permissions')
        .update({
          name: permission.name,
          description: permission.description,
          module: permission.module,
          resource_type: permission.resource_type,
          actions: permission.actions
        })
        .eq('id', permission.id);
      
      if (error) throw error;
      
      setPermissions(prev => 
        prev.map(p => p.id === permission.id ? {...permission, selected: p.selected} : p)
      );
      toast.success("Permissão atualizada com sucesso");
      return true;
    } catch (err) {
      console.error('Error updating permission:', err);
      toast.error("Erro ao atualizar permissão");
      return false;
    }
  };
  
  const deletePermission = async (permissionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', permissionId);
      
      if (error) throw error;
      
      setPermissions(prev => prev.filter(p => p.id !== permissionId));
      toast.success("Permissão excluída com sucesso");
      return true;
    } catch (err) {
      console.error('Error deleting permission:', err);
      toast.error("Erro ao excluir permissão");
      return false;
    }
  };

  return { 
    permissions, 
    loading, 
    error, 
    deletePermission, 
    createPermission, 
    updatePermission,
    fetchPermissions
  };
};
