
import { User, Permission, PermissionGroup } from '@/types/admin';

// Define interface for RPC results to address type errors
export interface RpcFunctionParams {
  p_group_id?: string;
  p_permission_id?: string;
  p_user_id?: string;
}

export interface UserPermissionsState {
  users: User[];
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
  loading: boolean;
  error: Error | null;
  selectedPermissions: string[];
  selectedGroups: string[];
}
