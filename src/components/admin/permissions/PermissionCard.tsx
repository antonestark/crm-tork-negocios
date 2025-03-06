
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Permission } from '@/types/admin';

interface PermissionCardProps {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionCard({ permission, onEdit, onDelete }: PermissionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{permission.name}</h3>
            <p className="text-sm text-muted-foreground">
              {permission.code}
            </p>
            {permission.description && (
              <p className="text-sm mt-2">{permission.description}</p>
            )}
            <div className="mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {permission.module}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                {Array.isArray(permission.actions) ? permission.actions.join(', ') : ''}
              </span>
            </div>
          </div>
          <div className="flex">
            <Button variant="ghost" size="icon" onClick={() => onEdit(permission)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(permission)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
