
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Permission } from '@/types/admin';
import { PermissionItem } from './PermissionItem';

interface PermissionsModuleListProps {
  permissions: Permission[];
  loading: boolean;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
}

export function PermissionsModuleList({ 
  permissions, 
  loading, 
  onPermissionChange 
}: PermissionsModuleListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Carregando permissões...</p>
      </div>
    );
  }

  // Get unique modules
  const modules = Array.from(new Set(permissions.map(p => p.module)));

  return (
    <ScrollArea className="flex-1 h-[400px] pr-4">
      <div className="space-y-4">
        {modules.map(module => (
          <div key={module} className="space-y-2">
            <h3 className="font-medium capitalize">{module}</h3>
            <Separator />
            <div className="grid grid-cols-1 gap-2">
              {permissions
                .filter(p => p.module === module)
                .map(permission => (
                  <PermissionItem
                    key={permission.id}
                    permission={permission}
                    onCheckedChange={onPermissionChange}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
