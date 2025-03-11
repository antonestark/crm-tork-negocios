
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PermissionGroup } from '@/types/admin';
import { Separator } from '@/components/ui/separator';

interface PermissionGroupItemProps {
  group: PermissionGroup;
  onCheckedChange: (groupId: string, checked: boolean) => void;
}

export function PermissionGroupItem({ group, onCheckedChange }: PermissionGroupItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2 py-1">
        <Checkbox
          id={`group-${group.id}`}
          checked={group.selected}
          onCheckedChange={(checked) => 
            onCheckedChange(group.id, checked as boolean)
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
  );
}
