
import React from 'react';
import { Permission } from '@/types/admin';
import { PermissionCard } from './PermissionCard';

interface PermissionsGridProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionsGrid({ permissions, onEdit, onDelete }: PermissionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {permissions.map((permission) => (
        <PermissionCard
          key={permission.id}
          permission={permission}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
