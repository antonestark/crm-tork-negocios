import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Permission, PermissionGroup } from '@/types/admin';

export const useUserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
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

      setUsers(data as User[]);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar usuários');
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

      setPermissions(data as Permission[]);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar permissões');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissionGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permission_groups')
        .select('*, permissions(id, name, code, description, module, resource_type, actions)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPermissionGroups(data as PermissionGroup[]);
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar grupos de permissões');
    } finally {
      setLoading(false);
    }
  }, []);

  const assignPermissionToGroup = async (groupId: string, permissionId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('assign_permission_to_group', {
        p_group_id: groupId,
        p_permission_id: permissionId,
      }) as { data: any, error: any };

      if (error) {
        throw error;
      }

      toast.success('Permissão atribuída ao grupo com sucesso');
      fetchPermissionGroups();
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao atribuir permissão ao grupo');
    } finally {
      setLoading(false);
    }
  };

  const removePermissionFromGroup = async (groupId: string, permissionId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('remove_permission_from_group', {
        p_group_id: groupId,
        p_permission_id: permissionId,
      }) as { data: any, error: any };

      if (error) {
        throw error;
      }

      toast.success('Permissão removida do grupo com sucesso');
      fetchPermissionGroups();
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao remover permissão do grupo');
    } finally {
      setLoading(false);
    }
  };

  const assignUserToGroup = async (userId: string, groupId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('assign_user_to_group', {
        p_user_id: userId,
        p_group_id: groupId,
      }) as { data: any, error: any };

      if (error) {
        throw error;
      }

      toast.success('Usuário atribuído ao grupo com sucesso');
      fetchUsers();
      fetchPermissionGroups();
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao atribuir usuário ao grupo');
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromGroup = async (userId: string, groupId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('remove_user_from_group', {
        p_user_id: userId,
        p_group_id: groupId,
      }) as { data: any, error: any };

      if (error) {
        throw error;
      }

      toast.success('Usuário removido do grupo com sucesso');
      fetchUsers();
      fetchPermissionGroups();
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao remover usuário do grupo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
    fetchPermissionGroups();
  }, [fetchUsers, fetchPermissions, fetchPermissionGroups]);

  return {
    users,
    permissions,
    permissionGroups,
    loading,
    error,
    fetchUsers,
    fetchPermissions,
    fetchPermissionGroups,
    assignPermissionToGroup,
    removePermissionFromGroup,
    assignUserToGroup,
    removeUserFromGroup,
  };
};
