
import { useState, useEffect } from 'react';
import { User, Permission, PermissionGroup } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { permissionAdapter, permissionGroupAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

export const useUserPermissions = (user: User, open: boolean) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (open && user?.id) {
      fetchPermissionsAndGroups();
    }
  }, [open, user?.id]);

  const fetchPermissionsAndGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch all available permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('module');
      
      if (permissionsError) throw permissionsError;
      
      // Fetch all permission groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('permission_groups')
        .select('*');
      
      if (groupsError) throw groupsError;
      
      // Fetch permissions for each group using a separate query
      const groupsArray = groupsData || [];
      const groupPermissionsPromises = groupsArray.map(async (group) => {
        // Use any to resolve type error
        const { data, error } = await supabase
          .rpc('get_group_permissions', { group_id: group.id }) as { data: any[], error: any };
        
        return {
          group_id: group.id,
          permissions: error || !data ? [] : Array.isArray(data) ? data : []
        };
      });
      
      const groupPermissionsResults = await Promise.all(groupPermissionsPromises);
      
      // Fetch user's direct permissions
      const { data: userPermissionsData, error: userPermissionsError } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', user.id);
      
      if (userPermissionsError) throw userPermissionsError;
      
      // Fetch user's permission groups using a custom RPC function
      // Use any to resolve type error
      const { data: userGroupsData, error: userGroupsError } = await supabase
        .rpc('get_user_permission_groups', { user_id: user.id }) as { data: any[], error: any };
      
      if (userGroupsError) throw userGroupsError;
      
      // Process permissions data with safe handling of potentially null values
      const userPermissionsArray = userPermissionsData || [];
      const userPermissionIds = userPermissionsArray.map(up => up.permission_id) || [];
      
      const userGroupsArray = Array.isArray(userGroupsData) ? userGroupsData : [];
      const userGroupIds = userGroupsArray
        .map((ug: any) => ug?.group_id)
        .filter(Boolean);
      
      // Mark permissions and groups as selected based on what the user has
      const permissionsArray = permissionsData || [];
      const processedPermissions = permissionAdapter(permissionsArray).map(p => ({
        ...p,
        selected: userPermissionIds.includes(p.id)
      }));
      
      const processedGroups = groupsArray.map(group => {
        // Get permissions for this group from our results
        const groupPermissionsResult = groupPermissionsResults.find(
          gp => gp.group_id === group.id
        );
        
        // Get the actual permission objects for this group's permissions
        const groupPermissions = groupPermissionsResult?.permissions
          .map(permId => permissionsArray.find(p => p.id === permId))
          .filter(Boolean) || [];
        
        // Create the group with processed permissions
        return {
          id: group.id,
          name: group.name,
          description: group.description || '',
          is_system: false, // Default value since it's not in the original data
          created_at: group.created_at || '',
          updated_at: group.updated_at || '',
          permissions: permissionAdapter(groupPermissions),
          selected: userGroupIds.includes(group.id)
        };
      });
      
      setPermissions(processedPermissions);
      setPermissionGroups(processedGroups);
    } catch (err) {
      console.error('Error fetching permissions and groups:', err);
      setError(err as Error);
      toast.error('Falha ao carregar permissões');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string, selected: boolean) => {
    setPermissions(prev => 
      prev.map(p => p.id === permissionId ? { ...p, selected } : p)
    );
  };

  const handleGroupChange = (groupId: string, selected: boolean) => {
    setPermissionGroups(prev => 
      prev.map(g => g.id === groupId ? { ...g, selected } : g)
    );
  };

  const saveUserPermissions = async (userId: string) => {
    try {
      // Get selected permissions and groups
      const selectedPermissionIds = permissions
        .filter(p => p.selected)
        .map(p => p.id);
      
      const selectedGroupIds = permissionGroups
        .filter(g => g.selected)
        .map(g => g.id);
      
      // Use a custom RPC function to save the permissions and groups in a transaction
      // Use any to resolve type error
      const { error } = await supabase
        .rpc('save_user_permissions_and_groups', {
          p_user_id: userId,
          p_permission_ids: selectedPermissionIds,
          p_group_ids: selectedGroupIds
        }) as { error: any };
      
      if (error) throw error;
      
      toast.success('Permissões salvas com sucesso');
      return true;
    } catch (err) {
      console.error('Error saving user permissions:', err);
      toast.error('Falha ao salvar permissões');
      return false;
    }
  };

  return {
    permissions,
    permissionGroups,
    loading,
    error,
    handlePermissionChange,
    handleGroupChange,
    saveUserPermissions
  };
};
