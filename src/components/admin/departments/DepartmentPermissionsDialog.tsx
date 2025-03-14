
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/admin';
import { usePermissions } from '@/hooks/use-permissions';
import { useDepartmentPermissions } from '@/hooks/use-department-permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DepartmentPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function DepartmentPermissionsDialog({
  open,
  onOpenChange,
  department
}: DepartmentPermissionsDialogProps) {
  const { permissions, loading: permissionsLoading } = usePermissions();
  const { 
    permissions: departmentPermissions, 
    loading: departmentPermissionsLoading,
    updateDepartmentPermissions 
  } = useDepartmentPermissions(department?.id ? parseInt(department.id) : undefined);
  
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update selected permissions when department permissions change
  useEffect(() => {
    setSelectedPermissions(departmentPermissions);
  }, [departmentPermissions]);
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };
  
  const handleSave = async () => {
    if (!department?.id) return;
    
    try {
      setIsSubmitting(true);
      await updateDepartmentPermissions(selectedPermissions);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loading = permissionsLoading || departmentPermissionsLoading;
  
  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Permissões do Departamento: {department?.name}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-2">
                  <h3 className="font-medium text-lg capitalize">{module}</h3>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {modulePermissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2 py-1">
                        <Checkbox 
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1">
                          <Label 
                            htmlFor={permission.id}
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          {permission.description && (
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {permission.actions.map(action => (
                              <span key={action} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
