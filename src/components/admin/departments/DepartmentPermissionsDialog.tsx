
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/admin';
import { useAllDepartmentPermissions } from '@/hooks/use-all-department-permissions';
import { useDepartmentPermissions } from '@/hooks/use-department-permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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
  const { permissions, loading: permissionsLoading, refetch } = useAllDepartmentPermissions(department?.id ?? null);
  const { 
    permissions: departmentPermissions, 
    loading: departmentPermissionsLoading,
    updateDepartmentPermissions 
  } = useDepartmentPermissions(department?.id ? parseInt(department.id) : undefined);
  
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      await refetch(); // força recarregar permissões atualizadas
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loading = permissionsLoading || departmentPermissionsLoading;
  
  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission => 
    permission.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    permission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group permissions by resource
  const permissionsByModule = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Permissões de Visualização: {department?.name}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Carregando permissões...</span>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar permissões..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="space-y-2">
                    <h3 className="font-medium text-lg capitalize">{module}</h3>
                    <Separator />
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {modulePermissions.map(permission => (
                        <div key={permission.permission_id} className="flex items-start space-x-2 py-1">
                          <Checkbox 
                            id={permission.permission_id}
                            checked={selectedPermissions.includes(permission.permission_id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.permission_id, checked as boolean)
                            }
                          />
                          <div className="grid gap-1">
                            <Label 
                              htmlFor={permission.permission_id}
                              className="font-medium cursor-pointer"
                            >
                              {permission.title}
                            </Label>
                            {permission.description && (
                              <p className="text-sm text-muted-foreground">
                                {permission.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                {permission.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(permissionsByModule).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'Nenhuma permissão encontrada para esta busca' : 'Nenhuma permissão disponível'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
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
              'Salvar Permissões'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
