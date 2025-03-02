
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  selected?: boolean;
}

interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  selected?: boolean;
  permissions?: Permission[];
}

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function UserPermissionsDialog({
  open,
  onOpenChange,
  user
}: UserPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data when dialog opens
  useEffect(() => {
    if (!open) return;
    
    async function fetchPermissionsData() {
      setLoading(true);
      
      try {
        // Fetch all permissions
        const { data: allPermissions, error: permissionsError } = await supabase
          .from('permissions')
          .select('*')
          .order('module')
          .order('name');
          
        if (permissionsError) throw permissionsError;
        
        // Fetch all permission groups with their permissions
        const { data: allGroups, error: groupsError } = await supabase
          .from('permission_groups')
          .select(`
            *,
            permissions:group_permissions(
              permission:permissions(*)
            )
          `)
          .order('name');
          
        if (groupsError) throw groupsError;
        
        // Fetch user's permissions
        const { data: userPerms, error: userPermsError } = await supabase
          .from('user_permissions')
          .select('permission_id')
          .eq('user_id', user.id);
          
        if (userPermsError) throw userPermsError;
        
        // Fetch user's groups
        const { data: userGroupsData, error: userGroupsError } = await supabase
          .from('user_permission_groups')
          .select('group_id')
          .eq('user_id', user.id);
          
        if (userGroupsError && userGroupsError.code !== 'PGRST116') {
          // PGRST116 is the error code for "relation does not exist"
          // We'll handle this by assuming the table just doesn't exist yet
          throw userGroupsError;
        }
        
        // Transform data
        const userPermissionIds = userPerms?.map(p => p.permission_id) || [];
        setUserPermissions(userPermissionIds);
        
        const userGroupIds = userGroupsData?.map(g => g.group_id) || [];
        setUserGroups(userGroupIds);
        
        // Format permissions with selected state
        const formattedPermissions = allPermissions?.map(permission => ({
          ...permission,
          selected: userPermissionIds.includes(permission.id)
        })) || [];
        
        setPermissions(formattedPermissions);
        
        // Format groups with selected state and permissions
        const formattedGroups = allGroups?.map(group => {
          const groupPermissions = group.permissions
            ?.map((p: any) => p.permission)
            .filter(Boolean) || [];
          
          return {
            ...group,
            selected: userGroupIds.includes(group.id),
            permissions: groupPermissions
          };
        }) || [];
        
        setPermissionGroups(formattedGroups);
      } catch (error) {
        console.error('Error fetching permissions data:', error);
        toast({
          title: "Erro ao carregar permissões",
          description: "Ocorreu um erro ao buscar as permissões.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPermissionsData();
  }, [open, user.id]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(
      permissions.map(permission => 
        permission.id === permissionId 
          ? { ...permission, selected: checked } 
          : permission
      )
    );
  };

  const handleGroupChange = (groupId: string, checked: boolean) => {
    setPermissionGroups(
      permissionGroups.map(group => 
        group.id === groupId 
          ? { ...group, selected: checked } 
          : group
      )
    );
  };

  const savePermissions = async () => {
    setSaving(true);
    
    try {
      // Get the selected permissions
      const selectedPermissionIds = permissions
        .filter(p => p.selected)
        .map(p => p.id);
      
      // Get the permissions to add (selected but not already assigned)
      const permissionsToAdd = selectedPermissionIds
        .filter(id => !userPermissions.includes(id))
        .map(permission_id => ({
          user_id: user.id,
          permission_id,
          granted_by: user.id // Typically this would be the current user's ID
        }));
      
      // Get the permissions to remove (not selected but currently assigned)
      const permissionsToRemove = userPermissions
        .filter(id => !selectedPermissionIds.includes(id));
      
      // Get the selected groups
      const selectedGroupIds = permissionGroups
        .filter(g => g.selected)
        .map(g => g.id);
      
      // Get the groups to add (selected but not already assigned)
      const groupsToAdd = selectedGroupIds
        .filter(id => !userGroups.includes(id))
        .map(group_id => ({
          user_id: user.id,
          group_id
        }));
      
      // Get the groups to remove (not selected but currently assigned)
      const groupsToRemove = userGroups
        .filter(id => !selectedGroupIds.includes(id));
      
      // Start a transaction to update permissions and groups
      if (permissionsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('user_permissions')
          .insert(permissionsToAdd);
          
        if (addError) throw addError;
      }
      
      for (const permissionId of permissionsToRemove) {
        const { error: removeError } = await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', user.id)
          .eq('permission_id', permissionId);
          
        if (removeError) throw removeError;
      }
      
      // Check if user_permission_groups table exists before trying to update it
      const { error: tableCheckError } = await supabase
        .from('user_permission_groups')
        .select('id', { count: 'estimated', head: true });
        
      if (tableCheckError && tableCheckError.code === 'PGRST116') {
        // Table doesn't exist, create it
        await supabase.rpc('create_user_permission_groups_table');
      } else {
        // Update groups
        if (groupsToAdd.length > 0) {
          const { error: addGroupError } = await supabase
            .from('user_permission_groups')
            .insert(groupsToAdd);
            
          if (addGroupError && addGroupError.code !== 'PGRST116') throw addGroupError;
        }
        
        for (const groupId of groupsToRemove) {
          const { error: removeGroupError } = await supabase
            .from('user_permission_groups')
            .delete()
            .eq('user_id', user.id)
            .eq('group_id', groupId);
            
          if (removeGroupError && removeGroupError.code !== 'PGRST116') throw removeGroupError;
        }
      }
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do usuário foram atualizadas com sucesso."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Erro ao salvar permissões",
        description: "Ocorreu um erro ao salvar as permissões do usuário.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = permissions.filter(permission => 
    permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = permissionGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  filteredPermissions.forEach(permission => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    permissionsByModule[permission.module].push(permission);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
          <DialogDescription>
            Configure as permissões para {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar permissões..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Permissões Individuais</TabsTrigger>
            <TabsTrigger value="groups">Grupos de Permissões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-4 space-y-4">
            {loading ? (
              <div className="text-center py-10">Carregando permissões...</div>
            ) : Object.keys(permissionsByModule).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma permissão encontrada com o termo "{searchQuery}"
              </div>
            ) : (
              <ScrollArea className="h-[400px] overflow-y-auto pr-4">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="mb-6 last:mb-0">
                    <h3 className="font-semibold text-md mb-2 text-primary">{module}</h3>
                    <div className="space-y-2">
                      {modulePermissions.map((permission) => (
                        <div 
                          key={permission.id} 
                          className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={permission.selected}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <div className="grid gap-1">
                            <Label 
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description || permission.code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="mt-4 space-y-4">
            {loading ? (
              <div className="text-center py-10">Carregando grupos de permissões...</div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum grupo de permissões encontrado com o termo "{searchQuery}"
              </div>
            ) : (
              <ScrollArea className="h-[400px] overflow-y-auto pr-4">
                <div className="space-y-4">
                  {filteredGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="p-3 border rounded-md hover:bg-muted"
                    >
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id={`group-${group.id}`}
                          checked={group.selected}
                          onCheckedChange={(checked) => 
                            handleGroupChange(group.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1">
                          <Label 
                            htmlFor={`group-${group.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {group.name} {group.is_system && "(Sistema)"}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {group.description || "Grupo de permissões"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {group.permissions?.length || 0} permissões neste grupo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button 
            onClick={savePermissions}
            disabled={loading || saving}
          >
            {saving ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
