
import { useState, useEffect } from 'react';
import { Permission, PermissionGroup, User } from '@/types/admin';
import { supabase, permissionAdapter, permissionGroupAdapter } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useUserPermissions = (user: User | null, isOpen: boolean) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissionsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all permissions
        const { data: allPermissions, error: permError } = await supabase
          .from('permissions')
          .select('*')
          .order('module');
          
        if (permError) throw permError;
        
        // Fetch all permission groups
        const { data: allGroups, error: groupError } = await supabase
          .from('permission_groups')
          .select('*');
          
        if (groupError) throw groupError;
        
        if (!user) return;
        
        // Fetch user's permissions
        const { data: userPermissions, error: userPermError } = await supabase
          .from('user_permissions')
          .select('permission_id')
          .eq('user_id', user.id);
          
        if (userPermError) throw userPermError;
        
        // Fetch user's permission groups
        const { data: userGroups, error: userGroupError } = await supabase
          .from('user_permission_groups')
          .select('group_id')
          .eq('user_id', user.id);
          
        if (userGroupError) throw userGroupError;
        
        // Mark permissions that the user has
        const userPermissionIds = (userPermissions || []).map(up => up.permission_id);
        const tempPermissions = (allPermissions || []).map(permission => ({
          ...permission,
          selected: userPermissionIds.includes(permission.id)
        }));
        
        // Mark permission groups that the user has
        const userGroupIds = (userGroups || []).map(ug => ug.group_id);
        const tempGroups = (allGroups || []).map(group => ({
          ...group,
          selected: userGroupIds.includes(group.id)
        }));
        
        // Apply adapters to convert to the correct types
        const adaptedPermissions = permissionAdapter(tempPermissions);
        const adaptedGroups = permissionGroupAdapter(tempGroups);
        
        setPermissions(adaptedPermissions);
        setPermissionGroups(adaptedGroups);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar permissões",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && user) {
      fetchPermissionsData();
    }
  }, [isOpen, user]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(prev =>
      prev.map(permission =>
        permission.id === permissionId
          ? { ...permission, selected: checked }
          : permission
      )
    );
  };
  
  const handleGroupChange = (groupId: string, checked: boolean) => {
    setPermissionGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, selected: checked }
          : group
      )
    );
  };

  const saveUserPermissions = async (userId: string) => {
    try {
      // Start a transaction
      const selectedPermissionIds = permissions.filter(p => p.selected).map(p => p.id);
      const selectedGroupIds = permissionGroups.filter(g => g.selected).map(g => g.id);
      
      // Remove all existing user permissions
      const { error: deletePermError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
      
      if (deletePermError) throw deletePermError;
      
      // Remove all existing user permission groups
      const { error: deleteGroupError } = await supabase
        .from('user_permission_groups')
        .delete()
        .eq('user_id', userId);
      
      if (deleteGroupError) throw deleteGroupError;
      
      // Add new user permissions
      if (selectedPermissionIds.length > 0) {
        const permissionsToInsert = selectedPermissionIds.map(permissionId => ({
          user_id: userId,
          permission_id: permissionId
        }));
        
        const { error: insertPermError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);
        
        if (insertPermError) throw insertPermError;
      }
      
      // Add new user permission groups
      if (selectedGroupIds.length > 0) {
        const groupsToInsert = selectedGroupIds.map(groupId => ({
          user_id: userId,
          group_id: groupId
        }));
        
        const { error: insertGroupError } = await supabase
          .from('user_permission_groups')
          .insert(groupsToInsert);
        
        if (insertGroupError) throw insertGroupError;
      }
      
      // Log the activity
      try {
        await supabase.rpc('log_activity', {
          _entity_type: 'users',
          _entity_id: userId,
          _action: 'update_permissions',
          _details: {
            permissions: selectedPermissionIds.length,
            groups: selectedGroupIds.length
          }
        });
      } catch (logError) {
        console.error('Error logging activity:', logError);
        // Continue even if logging fails
      }
      
      return true;
    } catch (error) {
      console.error('Error saving permissions:', error);
      return false;
    }
  };

  return {
    permissions,
    permissionGroups,
    loading,
    handlePermissionChange,
    handleGroupChange,
    saveUserPermissions
  };
};
