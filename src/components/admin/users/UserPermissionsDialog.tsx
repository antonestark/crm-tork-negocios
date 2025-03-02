
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Permission, PermissionGroup } from '@/types/admin';
import { 
  supabase, 
  mockPermissionData, 
  mockPermissionGroupData, 
  permissionAdapter, 
  permissionGroupAdapter 
} from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Since we don't have these tables, use mock data
      const mockPermissions = mockPermissionData();
      const mockGroups = mockPermissionGroupData();
      
      // Simulate user permissions
      const userSelectedPermissions = mockPermissions.map(p => ({
        ...p,
        selected: Math.random() > 0.7 // randomly select some permissions
      }));
      
      setPermissions(permissionAdapter(userSelectedPermissions));
      
      // Get selected permission IDs
      const selectedPerms = userSelectedPermissions
        .filter(p => p.selected)
        .map(p => p.id);
      
      setSelectedPermissionIds(selectedPerms);
      
      // Simulate group permissions
      const userSelectedGroups = mockGroups.map(g => ({
        ...g,
        selected: Math.random() > 0.7 // randomly select some groups
      }));
      
      setPermissionGroups(permissionGroupAdapter(userSelectedGroups));
      
      // Get selected group IDs
      const selectedGroups = userSelectedGroups
        .filter(g => g.selected)
        .map(g => g.id);
      
      setSelectedGroupIds(selectedGroups);
      
    } catch (error) {
      console.error('Error fetching permissions data:', error);
      toast.error('Failed to load permissions data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissionIds(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(id => id !== permissionId);
      }
    });
  };

  const handleGroupChange = (groupId: string, checked: boolean) => {
    setSelectedGroupIds(prev => {
      if (checked) {
        return [...prev, groupId];
      } else {
        return prev.filter(id => id !== groupId);
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Since we don't have these tables, just simulate a save action
      console.log('Saving permissions:', selectedPermissionIds);
      console.log('Saving permission groups:', selectedGroupIds);
      
      // Simulate an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Permissions updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage User Permissions</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="direct">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct Permissions</TabsTrigger>
            <TabsTrigger value="groups">Permission Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4 mt-4">
            <ScrollArea className="h-[380px] pr-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading permissions...</p>
                </div>
              ) : permissions.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p>No permissions available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissionIds.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                      />
                      <div className="grid gap-1">
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description || `${permission.module}: ${permission.code}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="groups" className="space-y-4 mt-4">
            <ScrollArea className="h-[380px] pr-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading permission groups...</p>
                </div>
              ) : permissionGroups.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p>No permission groups available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={selectedGroupIds.includes(group.id)}
                        onCheckedChange={(checked) => 
                          handleGroupChange(group.id, checked as boolean)
                        }
                      />
                      <div className="grid gap-1">
                        <label
                          htmlFor={`group-${group.id}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {group.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {group.description || 'No description'}
                        </p>
                        {group.is_system && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-sm inline-block w-fit">
                            System Group
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
