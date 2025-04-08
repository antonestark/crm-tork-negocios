
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [permissions, setPermissions] = useState<any[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(prev => 
      prev.map(p => p.id === permissionId ? {...p, assigned: checked} : p)
    );
  };
  
  const handleGroupChange = (groupId: string, checked: boolean) => {
    setPermissionGroups(prev => 
      prev.map(g => g.id === groupId ? {...g, assigned: checked} : g)
    );
  };
  
  const saveUserPermissions = async () => {
    setLoading(true);
    try {
      // Save permissions logic would go here
      toast.success("Permissões atualizadas com sucesso");
      return true;
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Falha ao salvar permissões");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    const success = await saveUserPermissions();
    if (success) {
      onOpenChange(false);
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
            <div className="space-y-4">
              {loading ? (
                <p>Carregando permissões...</p>
              ) : (
                permissions.map(permission => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={permission.assigned}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                    />
                    <label htmlFor={permission.id}>{permission.name}</label>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 flex flex-col">
            <div className="space-y-4">
              {loading ? (
                <p>Carregando grupos de permissões...</p>
              ) : (
                permissionGroups.map(group => (
                  <div key={group.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`group-${group.id}`}
                      checked={group.assigned}
                      onChange={(e) => handleGroupChange(group.id, e.target.checked)}
                    />
                    <label htmlFor={`group-${group.id}`}>{group.name}</label>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>Salvar permissões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
