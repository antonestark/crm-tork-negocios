
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RpcFunctionParams } from './types';

export const useGroupOperations = (
  fetchPermissionGroups: () => Promise<any>,
  fetchUsers: () => Promise<any>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignPermissionToGroup = async (groupId: string, permissionId: string) => {
    try {
      setLoading(true);
      const params: RpcFunctionParams = {
        p_group_id: groupId,
        p_permission_id: permissionId,
      };
      
      // To fix TypeScript errors, we need to cast the entire expression
      const { error } = await (supabase.rpc(
        'assign_permission_to_group', 
        params
      ) as any);

      if (error) {
        throw error;
      }

      toast.success('Permissão atribuída ao grupo com sucesso');
      fetchPermissionGroups();
      return true;
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao atribuir permissão ao grupo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePermissionFromGroup = async (groupId: string, permissionId: string) => {
    try {
      setLoading(true);
      const params: RpcFunctionParams = {
        p_group_id: groupId,
        p_permission_id: permissionId,
      };
      
      // To fix TypeScript errors, we need to cast the entire expression
      const { error } = await (supabase.rpc(
        'remove_permission_from_group', 
        params
      ) as any);

      if (error) {
        throw error;
      }

      toast.success('Permissão removida do grupo com sucesso');
      fetchPermissionGroups();
      return true;
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao remover permissão do grupo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignUserToGroup = async (userId: string, groupId: string) => {
    try {
      setLoading(true);
      const params: RpcFunctionParams = {
        p_user_id: userId,
        p_group_id: groupId,
      };
      
      // To fix TypeScript errors, we need to cast the entire expression
      const { error } = await (supabase.rpc(
        'assign_user_to_group', 
        params
      ) as any);

      if (error) {
        throw error;
      }

      toast.success('Usuário atribuído ao grupo com sucesso');
      fetchUsers();
      fetchPermissionGroups();
      return true;
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao atribuir usuário ao grupo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromGroup = async (userId: string, groupId: string) => {
    try {
      setLoading(true);
      const params: RpcFunctionParams = {
        p_user_id: userId,
        p_group_id: groupId,
      };
      
      // To fix TypeScript errors, we need to cast the entire expression
      const { error } = await (supabase.rpc(
        'remove_user_from_group', 
        params
      ) as any);

      if (error) {
        throw error;
      }

      toast.success('Usuário removido do grupo com sucesso');
      fetchUsers();
      fetchPermissionGroups();
      return true;
    } catch (error) {
      setError(error as Error);
      toast.error('Erro ao remover usuário do grupo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignPermissionToGroup,
    removePermissionFromGroup,
    assignUserToGroup,
    removeUserFromGroup,
    loading,
    error
  };
};
