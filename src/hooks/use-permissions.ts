
import { useState, useEffect } from 'react';
import { Permission } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { permissionAdapter } from '@/integrations/supabase/adapters';
import { toast } from '@/components/ui/use-toast';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module');

      if (error) {
        throw error;
      }

      const adaptedPermissions = permissionAdapter(data || []);
      setPermissions(adaptedPermissions);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar permissões",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', permissionId);

      if (error) {
        throw error;
      }

      setPermissions(permissions.filter(p => p.id !== permissionId));
      toast({
        title: "Sucesso",
        description: "Permissão excluída com sucesso",
      });
    } catch (error) {
      console.error('Failed to delete permission:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir permissão",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    deletePermission,
    refreshPermissions: fetchPermissions
  };
}
