
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Permission, PermissionGroup } from '@/types/admin';
import { permissionAdapter, permissionGroupAdapter, userAdapter } from '@/integrations/supabase/adapters';

export const usePermissionFetchers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*, department:department_id(*)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return userAdapter(data || []);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar usuários');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return permissionAdapter(data || []);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar permissões');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissionGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permission_groups')
        .select('*, permissions:permissions(*)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return permissionGroupAdapter(data || []);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar grupos de permissões');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchUsers,
    fetchPermissions,
    fetchPermissionGroups,
    loading,
    error
  };
};
