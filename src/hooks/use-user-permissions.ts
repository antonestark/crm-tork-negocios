import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export async function fetchUserGlobalPermissions(userId: string) {
  const { data, error } = await supabase
    .from('user_permissions')
    .select(`
      permission_id,
      permissions:permissions (
        id,
        code,
        name,
        description
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao buscar permissões globais:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.permissions.id,
    code: item.permissions.code,
    name: item.permissions.name,
    description: item.permissions.description,
  }));
}

export async function addGlobalPermissionToUser(userId: string, permissionId: string) {
  const { error } = await supabase
    .from('user_permissions')
    .insert({
      user_id: userId,
      permission_id: permissionId,
    });

  if (error) {
    console.error('Erro ao adicionar permissão global:', error);
    throw error;
  }
}

export async function removeGlobalPermissionFromUser(userId: string, permissionId: string) {
  const { error } = await supabase
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('permission_id', permissionId);

  if (error) {
    console.error('Erro ao remover permissão global:', error);
    throw error;
  }
}

export function useUserPermissions(userId: string, role?: string | null) {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    setLoading(true);

    if (role === 'super_admin') {
      // Super admin tem todas as permissões
      setPermissions([{ code: 'ALL_PERMISSIONS' }]);
      setLoading(false);
      return;
    }

    const perms = await fetchUserGlobalPermissions(userId);
    setPermissions(perms);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchPermissions();
    }
  }, [userId, role]);

  return { permissions, loading, reload: fetchPermissions };
}
