import { supabase } from '@/integrations/supabase/client';

/**
 * Busca todas as permissões efetivas do usuário, herdadas do departamento e específicas.
 * @param userId UUID do usuário autenticado
 * @returns Lista de permission_id (UUIDs)
 */
export async function getUserPermissionIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_effective_permissions')
    .select('permission_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao buscar permissões do usuário:', error);
    return [];
  }

  return data.map((row) => row.permission_id);
}
