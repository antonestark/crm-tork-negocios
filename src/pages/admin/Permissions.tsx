
import React from 'react';
import { PermissionsManager } from '@/components/admin/permissions/PermissionsManager';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RequirePermission } from '@/components/auth/RequirePermission';

const PermissionsPage = () => {
  return (
    <AdminLayout title="Permissões">
<RequirePermission permissionCode="admin:permissions:view">
        <PermissionsManager />
      </RequirePermission>
    </AdminLayout>
  );
};

export default PermissionsPage;
