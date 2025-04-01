import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { PermissionsManager } from '@/components/admin/permissions/PermissionsManager';
import { BaseLayout } from '@/components/layout/BaseLayout';

const PermissionsPage = () => {
  return (
    <BaseLayout>
      {/* Removed container, Helmet, h1, and Separator */}
      <div className="flex h-full py-6 px-4">
        {/* Admin Navigation */}
        <div className="w-64 mr-8">
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          <PermissionsManager />
        </div>
      </div>
    </BaseLayout>
  );
};

export default PermissionsPage;
