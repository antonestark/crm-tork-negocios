import { ResourcePage, ActionType, Permission } from '../types/permissions';
import { useUserAccess } from '../providers/UserAccessProvider';

/**
 * Hook para verificar se o usuário atual tem permissão para uma ação em uma página
 * @param page Página/Recurso
 * @param action Ação desejada
 * @returns boolean
 */
export function usePermission(page: ResourcePage, action: ActionType): boolean {
  const { role, permissions } = useUserAccess();

  if (!permissions) {
    return false;
  }

  // Se o usuário for da Administração, liberar tudo
  if (role === 'admin') {
    return true;
  }

  const permission = (permissions as Permission[]).find((p) => p.page === page);

  if (!permission) {
    return false;
  }

  return !!permission.actions[action];
}
