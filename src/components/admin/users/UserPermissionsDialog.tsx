
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
import { mockPermissionData, mockPermissionGroupData } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

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
        // Mock data for development
        const mockPerms = mockPermissionData();
        const mockGroups = mockPermissionGroupData();
        
        setPermissions(mockPerms);
        setPermissionGroups(mockGroups);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPermissionsData();
  }, [user.id]);
  
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
    // Here we would save the permissions to the database
    console.log('Selected permissions:', permissions.filter(p => p.selected).map(p => p.id));
    console.log('Selected groups:', permissionGroups.filter(g => g.selected).map(g => g.id));
    onOpenChange(false);
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
