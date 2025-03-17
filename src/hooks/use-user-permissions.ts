
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Permission, PermissionGroup } from '@/types/admin';
import { permissionAdapter, permissionGroupAdapter, userAdapter } from '@/integrations/supabase/adapters';

// Define interface for RPC results to address type errors
interface RpcFunctionParams {
  p_group_id: string;
  p_permission_id?: string;
  p_user_id?: string;
}

export const useUserPermissions = (user?: User, isOpen?: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

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

      setUsers(userAdapter(data || []));
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

      const processedPermissions = permissionAdapter(data || []);
      setPermissions(processedPermissions);
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
        .select('*, permissions:permissions(*)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const processedGroups = permissionGroupAdapter(data || []);
      setPermissionGroups(processedGroups);
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
      const { error } = await supabase.rpc('assign_permission_to_group', {
        p_group_id: groupId,
        p_permission_id: permissionId,
      } as RpcFunctionParams);

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
      const { error } = await supabase.rpc('remove_permission_from_group', {
        p_group_id: groupId,
        p_permission_id: permissionId,
      } as RpcFunctionParams);

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
      const { error } = await supabase.rpc('assign_user_to_group', {
        p_user_id: userId,
        p_group_id: groupId,
      } as RpcFunctionParams);

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
      const { error } = await supabase.rpc('remove_user_from_group', {
        p_user_id: userId,
        p_group_id: groupId,
      } as RpcFunctionParams);

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

  const fetchUserPermissions = useCallback(async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch user's direct permissions
      const { data: userPerms, error: permsError } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', userId);
      
      if (permsError) throw permsError;
      
      // Use user_groups instead of user_permission_groups
      const { data: userGroups, error: groupsError } = await supabase
        .from('user_groups')
        .select('group_id')
        .eq('user_id', userId);
      
      if (groupsError) throw groupsError;
      
      // Update selected permissions
      const permissionIds = (userPerms || []).map(p => p.permission_id);
      const groupIds = (userGroups || []).map(g => g.group_id);
      
      setSelectedPermissions(permissionIds);
      setSelectedGroups(groupIds);
      
      // Mark permissions and groups as selected
      setPermissions(prev => 
        prev.map(p => ({
          ...p,
          selected: permissionIds.includes(p.id)
        }))
      );
      
      setPermissionGroups(prev => 
        prev.map(g => ({
          ...g,
          selected: groupIds.includes(g.id)
        }))
      );
      
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao carregar permissões do usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, selected: checked } : p
      )
    );
  };

  const handleGroupChange = (groupId: string, checked: boolean) => {
    setPermissionGroups(prev =>
      prev.map(g =>
        g.id === groupId ? { ...g, selected: checked } : g
      )
    );
  };

  const saveUserPermissions = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setLoading(true);
      
      // Get selected permissions and groups
      const selectedPerms = permissions.filter(p => p.selected).map(p => p.id);
      const selectedGroupsIds = permissionGroups.filter(g => g.selected).map(g => g.id);
      
      // Update user permissions
      // First, remove all existing permissions
      await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
      
      // Then add selected permissions
      if (selectedPerms.length > 0) {
        const permInserts = selectedPerms.map(pid => ({
          user_id: userId,
          permission_id: pid
        }));
        
        const { error: insertError } = await supabase
          .from('user_permissions')
          .insert(permInserts);
          
        if (insertError) throw insertError;
      }
      
      // Update user groups - use user_groups table instead of user_permission_groups
      // First, remove all existing group assignments
      await supabase
        .from('user_groups')
        .delete()
        .eq('user_id', userId);
        
      // Then add selected groups
      if (selectedGroupsIds.length > 0) {
        const groupInserts = selectedGroupsIds.map(gid => ({
          user_id: userId,
          group_id: gid
        }));
        
        const { error: insertGroupError } = await supabase
          .from('user_groups')
          .insert(groupInserts);
          
        if (insertGroupError) throw insertGroupError;
      }
      
      toast.success('Permissões do usuário atualizadas com sucesso');
      return true;
    } catch (error) {
      console.error('Error saving user permissions:', error);
      setError(error as Error);
      toast.error('Erro ao salvar permissões do usuário');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load user permissions when a user is selected and dialog opens
  useEffect(() => {
    if (user?.id && isOpen) {
      fetchUserPermissions(user.id);
    }
  }, [user?.id, isOpen, fetchUserPermissions]);

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
    handlePermissionChange,
    handleGroupChange,
    saveUserPermissions,
    fetchUserPermissions
  };
};
