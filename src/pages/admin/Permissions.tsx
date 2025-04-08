
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SystemPermissionsList } from '@/components/admin/permissions/SystemPermissionsList';

const PermissionsPage = () => {
  return (
    <AdminLayout title="Permissões">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Permissões do Sistema</h2>
        <SystemPermissionsList />
      </div>
    </AdminLayout>
  );
};

export default PermissionsPage;
