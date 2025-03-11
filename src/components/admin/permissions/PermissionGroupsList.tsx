
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermissionGroup } from '@/types/admin';
import { PermissionGroupItem } from './PermissionGroupItem';

interface PermissionGroupsListProps {
  permissionGroups: PermissionGroup[];
  loading: boolean;
  onGroupChange: (groupId: string, checked: boolean) => void;
}

export function PermissionGroupList({ 
  permissionGroups, 
  loading, 
  onGroupChange 
}: PermissionGroupsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Carregando grupos de permissões...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-[400px] pr-4">
      <div className="space-y-4">
        {permissionGroups.map(group => (
          <PermissionGroupItem
            key={group.id}
            group={group}
            onCheckedChange={onGroupChange}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
