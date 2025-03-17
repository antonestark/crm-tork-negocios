
import { useState, useEffect } from 'react';
import { User, Permission, PermissionGroup } from '@/types/admin';
import { usePermissionFetchers } from './permissions/use-permission-fetchers';
import { useGroupOperations } from './permissions/use-group-operations';
import { useUserPermissionOperations } from './permissions/use-user-permission-operations';

export const useUserPermissions = (user?: User, isOpen?: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { 
    fetchUsers: fetchUsersData, 
    fetchPermissions: fetchPermissionsData,
    fetchPermissionGroups: fetchPermissionGroupsData,
    loading: fetchLoading,
    error: fetchError
  } = usePermissionFetchers();

  const fetchUsers = async () => {
    const data = await fetchUsersData();
    setUsers(data);
  };

  const fetchPermissions = async () => {
    const data = await fetchPermissionsData();
    setPermissions(data);
  };

  const fetchPermissionGroups = async () => {
    const data = await fetchPermissionGroupsData();
    setPermissionGroups(data);
  };

  const {
    assignPermissionToGroup,
    removePermissionFromGroup,
    assignUserToGroup,
    removeUserFromGroup,
    loading: groupOperationsLoading,
    error: groupOperationsError
  } = useGroupOperations(fetchPermissionGroups, fetchUsers);

  const {
    fetchUserPermissions,
    saveUserPermissions,
    loading: userPermissionsLoading,
    error: userPermissionsError
  } = useUserPermissionOperations();

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
    fetchPermissionGroups();
  }, []);

  useEffect(() => {
    if (user?.id && isOpen) {
      fetchUserPermissions(
        user.id,
        setPermissions,
        setPermissionGroups,
        setSelectedPermissions,
        setSelectedGroups
      );
    }
  }, [user?.id, isOpen, fetchUserPermissions]);

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

  return {
    users,
    permissions,
    permissionGroups,
    loading: fetchLoading || groupOperationsLoading || userPermissionsLoading,
    error: fetchError || groupOperationsError || userPermissionsError,
    fetchUsers,
    fetchPermissions,
    fetchPermissionGroups,
    assignPermissionToGroup,
    removePermissionFromGroup,
    assignUserToGroup,
    removeUserFromGroup,
    handlePermissionChange,
    handleGroupChange,
    saveUserPermissions: (userId: string) => saveUserPermissions(userId, permissions, permissionGroups),
    fetchUserPermissions
  };
};
