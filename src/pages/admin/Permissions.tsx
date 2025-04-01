
import React from 'react';
import { PermissionsManager } from '@/components/admin/permissions/PermissionsManager';
import { AdminLayout } from '@/components/admin/AdminLayout';

const PermissionsPage = () => {
  return (
    <AdminLayout title="Permissões">
      <PermissionsManager />
    </AdminLayout>
  );
};

export default PermissionsPage;
