
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/admin';
import { toast } from '@/components/ui/use-toast';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { PermissionsModuleList } from '../permissions/PermissionsModuleList';
import { PermissionGroupList } from '../permissions/PermissionGroupsList';

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
  const {
    permissions,
    permissionGroups,
    loading,
    handlePermissionChange,
    handleGroupChange,
    saveUserPermissions
  } = useUserPermissions(user, open);
  
  const handleSave = async () => {
    const success = await saveUserPermissions(user.id);
    
    if (success) {
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });
      onOpenChange(false);
    } else {
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
            <PermissionsModuleList 
              permissions={permissions}
              loading={loading}
              onPermissionChange={handlePermissionChange}
            />
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 flex flex-col">
            <PermissionGroupList
              permissionGroups={permissionGroups}
              loading={loading}
              onGroupChange={handleGroupChange}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSave}>Salvar permissões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
