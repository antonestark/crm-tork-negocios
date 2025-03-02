
import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Separator } from '@/components/ui/separator';
import { UsersTable } from '@/components/admin/users/UsersTable';

export default function UsersPage() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">
            Manage your users, departments, and system settings.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex h-full">
        <AdminNav />
        <div className="w-full p-4">
          <UsersTable filters={{ status: 'all', department: 'all', search: '' }} />
        </div>
      </div>
    </div>
  );
}
