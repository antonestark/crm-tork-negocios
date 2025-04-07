
import React, { useState } from 'react';
import { PermissionsHeader } from './PermissionsHeader';
import { PermissionsGrid } from './PermissionsGrid';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/types/admin';
import { NewPermissionDialog } from './NewPermissionDialog';

export function PermissionsList() {
  const { permissions, loading, createPermission, updatePermission, deletePermission } = usePermissions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setDialogOpen(true);
  };

  const handleDelete = async (permission: Permission) => {
    await deletePermission(permission.id);
  };

  const handleNewPermission = () => {
    setSelectedPermission(null);
    setDialogOpen(true);
  };

  const handleSave = async (data: Partial<Permission>) => {
    if (selectedPermission) {
      await updatePermission({ ...selectedPermission, ...data });
    } else {
      await createPermission(data as Permission);
    }
    setDialogOpen(false);
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

      <NewPermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        permission={selectedPermission}
      />
    </div>
  );
}
