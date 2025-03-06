
import React, { useState } from 'react';
import { PermissionsHeader } from './PermissionsHeader';
import { PermissionsGrid } from './PermissionsGrid';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/types/admin';

export function PermissionsList() {
  const { permissions, loading, deletePermission } = usePermissions();

  const handleEdit = (permission: Permission) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit permission:', permission);
  };

  const handleDelete = async (permission: Permission) => {
    await deletePermission(permission.id);
  };

  const handleNewPermission = () => {
    // In a real app, this would open a form to create a new permission
    console.log('Create new permission');
  };

  return (
    <div>
      <PermissionsHeader onNewPermission={handleNewPermission} />

      {loading ? (
        <p>Carregando permissões...</p>
      ) : (
        <PermissionsGrid 
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
