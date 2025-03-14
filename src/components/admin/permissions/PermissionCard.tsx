
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Permission } from '@/types/admin';
import { useCheckPermission } from '@/hooks/use-check-permission';

interface PermissionCardProps {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionCard({
  permission,
  onEdit,
  onDelete
}: PermissionCardProps) {
  const { hasPermission: canEdit } = useCheckPermission('admin:permissions:edit');
  const { hasPermission: canDelete } = useCheckPermission('admin:permissions:delete');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{permission.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {permission.description || 'Sem descrição'}
            </p>
          </div>
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <Shield size={20} />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {permission.module}
            </span>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {permission.resource_type}
            </span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {permission.actions.map(action => (
              <span key={action} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                {action}
              </span>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            <span className="font-medium">Código:</span> {permission.code}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(permission)}>
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
        )}
        
        {canDelete && (
          <Button variant="outline" size="sm" onClick={() => onDelete(permission)}>
            <Trash2 className="h-4 w-4 mr-1" /> Excluir
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
