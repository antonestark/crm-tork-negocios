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

  // Se o usuário for admin, liberar tudo
  if (role === 'admin') {
    console.log(`[usePermission] Access granted for role: ${role} on page: ${page}, action: ${action}`);
    return true;
  }

  // O hook useUserPermissions agora retorna um mapa: Record<string, { view: boolean; edit: boolean; delete: boolean }>
  // A chave do mapa é o page_code (string)
  // O valor do enum ResourcePage (ex: ResourcePage.LEADS) é a string 'leads'

  // Usar o valor do enum diretamente como a chave para o mapa de permissões
  const pageKey = page as string; // O valor do enum já é a string correta (ex: 'leads')

  // Verificar as permissões do departamento (permissions já é do tipo correto vindo do context)
  const pagePermissions = permissions[pageKey];

  if (!pagePermissions) {
    console.log(`[usePermission] No department permissions found for page key: ${pageKey}`);
    return false;
  }

  let hasActionPermission = false;
  switch (action) {
    case ActionType.VIEW:
      hasActionPermission = pagePermissions.view;
      break;
    case ActionType.CREATE: // Assumindo que 'edit' cobre 'create'
    case ActionType.EDIT:
      hasActionPermission = pagePermissions.edit;
      break;
    case ActionType.DELETE:
      hasActionPermission = pagePermissions.delete;
      break;
    default:
      hasActionPermission = false;
  }

  console.log(`[usePermission] Checking permission for page: ${pageKey}, action: ${action}. Allowed: ${hasActionPermission}`);

  return hasActionPermission;

  /* Lógica anterior baseada em array de strings (removida)
  // Construir o código da permissão esperada (ex: 'LEADS.VIEW')
  const requiredPermissionCode = `${page}.${action}`; 
  
  // Verificar se o array de permissões (strings) inclui o código necessário
  const hasExplicitPermission = permissions.includes(requiredPermissionCode);

  console.log(`[usePermission] Checking for permission: ${requiredPermissionCode}. Found: ${hasExplicitPermission}`);

  return hasExplicitPermission;
  */

  /* Lógica anterior baseada em objeto Permission (manter comentado caso necessário)
  const permission = (permissions as Permission[]).find((p) => p.code.startsWith(page + '.')); // Ajuste para encontrar pelo início do código

  if (!permission) {
     console.log(`[usePermission] No specific permission object found starting with ${page}.`);
     return false;
  }

  // Verifica se a ação específica está presente
  const hasAction = permission.actions.includes(action);
  console.log(`[usePermission] Permission object found for ${page}. Action ${action} allowed: ${hasAction}`);
  return hasAction;
  */
}
