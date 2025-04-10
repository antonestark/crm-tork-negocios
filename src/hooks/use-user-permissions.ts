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

// Add function to fetch department permissions
export async function fetchDepartmentPermissions(departmentId: number | null | undefined) {
  if (!departmentId) {
    return [];
  }

  // Use the view we analyzed earlier, filtering by department_id
  const { data, error } = await supabase
    .from('department_permission_view')
    .select(`
      permission_id,
      code,
      title,
      description,
      resource,
      action
    `)
    .eq('department_id', departmentId)
    .eq('assigned', true); // Only fetch permissions actually assigned to the department

  if (error) {
    console.error('Erro ao buscar permissões do departamento:', error);
    return [];
  }

  // Map to a consistent permission object format if needed, 
  // using 'code' seems consistent with fetchUserGlobalPermissions format
  // Ensure the returned object matches the expected structure for permissions
  return data.map((item: any) => ({
    id: item.permission_id, // Use permission_id as the unique ID
    code: item.code,
    name: item.title, // Using title as name
    description: item.description,
    resource: item.resource, 
    action: item.action,
  }));
}


export function useUserPermissions(
  userId: string,
  role?: string | null,
  departmentId?: number | null
) {
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

    const [userPerms, deptPerms] = await Promise.all([
      fetchUserGlobalPermissions(userId),
      fetchDepartmentPermissions(departmentId),
    ]);

    // Combinar permissões removendo duplicatas pelo código
    const combinedMap = new Map<string, any>();
    userPerms.forEach((perm: any) => combinedMap.set(perm.code, perm));
    deptPerms.forEach((perm: any) => combinedMap.set(perm.code, perm));

    const combinedPermissions = Array.from(combinedMap.values());

    setPermissions(combinedPermissions);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchPermissions();
    }
  }, [userId, role, departmentId]);

  return { permissions, loading, reload: fetchPermissions };
}
