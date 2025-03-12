
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
        .select(`
          *,
          permissions:permission_group_permissions(
            permission:permissions(*)
          )
        `);
      
      if (groupsError) throw groupsError;
      
      // Fetch user's direct permissions
      const { data: userPermissionsData, error: userPermissionsError } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', user.id);
      
      if (userPermissionsError) throw userPermissionsError;
      
      // Fetch user's permission groups
      const { data: userGroupsData, error: userGroupsError } = await supabase
        .from('user_permission_groups')
        .select('group_id')
        .eq('user_id', user.id);
      
      if (userGroupsError) throw userGroupsError;
      
      // Process permissions data
      const userPermissionIds = userPermissionsData?.map(up => up.permission_id) || [];
      const userGroupIds = userGroupsData?.map(ug => ug.group_id) || [];
      
      // Mark permissions and groups as selected based on what the user has
      const processedPermissions = permissionAdapter(permissionsData || []).map(p => ({
        ...p,
        selected: userPermissionIds.includes(p.id)
      }));
      
      const processedGroups = (groupsData || []).map(group => {
        // Transform the nested permissions format from Supabase
        const groupPermissions = group.permissions?.map(p => p.permission) || [];
        
        // Create the group with processed permissions
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          is_system: group.is_system,
          created_at: group.created_at,
          updated_at: group.updated_at,
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
      
      // Delete existing user permissions
      await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
      
      // Delete existing user permission groups
      await supabase
        .from('user_permission_groups')
        .delete()
        .eq('user_id', userId);
      
      // Insert new user permissions
      if (selectedPermissionIds.length > 0) {
        const permissionsToInsert = selectedPermissionIds.map(permissionId => ({
          user_id: userId,
          permission_id: permissionId
        }));
        
        const { error: insertPermissionsError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);
        
        if (insertPermissionsError) throw insertPermissionsError;
      }
      
      // Insert new user permission groups
      if (selectedGroupIds.length > 0) {
        const groupsToInsert = selectedGroupIds.map(groupId => ({
          user_id: userId,
          group_id: groupId
        }));
        
        const { error: insertGroupsError } = await supabase
          .from('user_permission_groups')
          .insert(groupsToInsert);
        
        if (insertGroupsError) throw insertGroupsError;
      }
      
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
