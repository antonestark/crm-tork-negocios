
import React from 'react';
import { SYSTEM_PERMISSIONS } from '../../../types/system-permissions';
import { PermissionCard } from './PermissionCard';
import { Permission } from '@/types/admin';

export function SystemPermissionsList() {
  const permissions = SYSTEM_PERMISSIONS ?? [];

  // Dummy functions since we don't actually edit system permissions
  const handleEdit = (permission: Permission) => {
    console.log('Edit permission', permission);
  };

  const handleDelete = (permission: Permission) => {
    console.log('Delete permission', permission);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.isArray(permissions) && permissions.length > 0 ? (
        permissions.map((perm) => (
          <PermissionCard
            key={perm.code}
            permission={{
              id: perm.code, // Use code as ID for system permissions
              name: perm.title,
              description: perm.description,
              code: perm.code,
              module: perm.page,
              resource_type: 'system',
              actions: [perm.action],
              created_at: '',
              selected: false
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p className="text-gray-400">Nenhuma permissão disponível.</p>
      )}
    </div>
  );
}
