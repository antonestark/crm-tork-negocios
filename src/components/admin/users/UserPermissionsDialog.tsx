
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Permission, PermissionGroup, User } from '@/types/admin';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { permissionAdapter, permissionGroupAdapter } from '@/integrations/supabase/adapters';

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function UserPermissionsDialog({
  open,
  onOpenChange,
  user,
}: UserPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch permissions and permission groups
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
    
    if (open && user) {
      fetchPermissionsData();
    }
  }, [open, user.id]);
  
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
  
  const handleSave = async () => {
    try {
      // Start a transaction
      const selectedPermissionIds = permissions.filter(p => p.selected).map(p => p.id);
      const selectedGroupIds = permissionGroups.filter(g => g.selected).map(g => g.id);
      
      // Remove all existing user permissions
      const { error: deletePermError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', user.id);
      
      if (deletePermError) throw deletePermError;
      
      // Remove all existing user permission groups
      const { error: deleteGroupError } = await supabase
        .from('user_permission_groups')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteGroupError) throw deleteGroupError;
      
      // Add new user permissions
      if (selectedPermissionIds.length > 0) {
        const permissionsToInsert = selectedPermissionIds.map(permissionId => ({
          user_id: user.id,
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
          user_id: user.id,
          group_id: groupId
        }));
        
        const { error: insertGroupError } = await supabase
          .from('user_permission_groups')
          .insert(groupsToInsert);
        
        if (insertGroupError) throw insertGroupError;
      }
      
      // Log the activity
      await supabase.rpc('log_activity', {
        _entity_type: 'users',
        _entity_id: user.id,
        _action: 'update_permissions',
        _details: {
          permissions: selectedPermissionIds.length,
          groups: selectedGroupIds.length
        }
      });
      
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar permissões",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as permissões para {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="permissions" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="permissions">Permissões Individuais</TabsTrigger>
            <TabsTrigger value="groups">Grupos de Permissões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions" className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p>Carregando permissões...</p>
              </div>
            ) : (
              <ScrollArea className="flex-1 h-[400px] pr-4">
                <div className="space-y-4">
                  {/* Group permissions by module */}
                  {Array.from(new Set(permissions.map(p => p.module))).map(module => (
                    <div key={module} className="space-y-2">
                      <h3 className="font-medium capitalize">{module}</h3>
                      <Separator />
                      <div className="grid grid-cols-1 gap-2">
                        {permissions
                          .filter(p => p.module === module)
                          .map(permission => (
                            <div key={permission.id} className="flex items-start space-x-2 py-1">
                              <Checkbox
                                id={permission.id}
                                checked={permission.selected}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.id, checked as boolean)
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={permission.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {permission.name}
                                </label>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p>Carregando grupos de permissões...</p>
              </div>
            ) : (
              <ScrollArea className="flex-1 h-[400px] pr-4">
                <div className="space-y-4">
                  {permissionGroups.map(group => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex items-start space-x-2 py-1">
                        <Checkbox
                          id={`group-${group.id}`}
                          checked={group.selected}
                          onCheckedChange={(checked) => 
                            handleGroupChange(group.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`group-${group.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {group.name}
                            {group.is_system && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                Sistema
                              </span>
                            )}
                          </label>
                          {group.description && (
                            <p className="text-xs text-muted-foreground">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSave}>Salvar permissões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
