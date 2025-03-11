
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission } from '@/types/admin';

interface PermissionItemProps {
  permission: Permission;
  onCheckedChange: (permissionId: string, checked: boolean) => void;
}

export function PermissionItem({ permission, onCheckedChange }: PermissionItemProps) {
  return (
    <div className="flex items-start space-x-2 py-1">
      <Checkbox
        id={permission.id}
        checked={permission.selected}
        onCheckedChange={(checked) => 
          onCheckedChange(permission.id, checked as boolean)
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
  );
}
