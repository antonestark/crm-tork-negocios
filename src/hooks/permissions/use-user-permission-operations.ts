
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Permission, PermissionGroup } from '@/types/admin';

export const useUserPermissionOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserPermissions = useCallback(async (
    userId: string,
    setPermissions: (fn: (prev: Permission[]) =>  Permission[]) => void,
    setPermissionGroups: (fn: (prev: PermissionGroup[]) => PermissionGroup[]) => void,
    setSelectedPermissions: (permissions: string[]) => void,
    setSelectedGroups: (groups: string[]) => void
  ) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data: userPerms, error: permsError } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', userId);
      
      if (permsError) throw permsError;
      
      const { data: userGroups, error: groupsError } = await supabase
        .from('user_groups')
        .select('group_id')
        .eq('user_id', userId);
      
      if (groupsError) throw groupsError;
      
      const permissionIds = (userPerms || []).map(p => p.permission_id);
      const groupIds = (userGroups || []).map(g => g.group_id);
      
      setSelectedPermissions(permissionIds);
      setSelectedGroups(groupIds);
      
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

  const saveUserPermissions = async (
    userId: string,
    permissions: Permission[],
    permissionGroups: PermissionGroup[]
  ): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setLoading(true);

      // Verifica se o usuário ainda existe na tabela users
      const { data: userExists, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (userError) throw userError;

      if (!userExists) {
        toast.error('Usuário não encontrado. Atualize a página.');
        return false;
      }
      
      const selectedPerms = permissions.filter(p => p.selected).map(p => p.id);
      const selectedGroupsIds = permissionGroups.filter(g => g.selected).map(g => g.id);
      
      await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
      
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
      
      await supabase
        .from('user_groups')
        .delete()
        .eq('user_id', userId);
        
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

  return {
    fetchUserPermissions,
    saveUserPermissions,
    loading,
    error
  };
};
