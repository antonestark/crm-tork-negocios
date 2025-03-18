
import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Separator } from '@/components/ui/separator';

export default function AdminIndex() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">
            Gerenciamento de usuários, departamentos e permissões do sistema.
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex h-full">
        <div className="w-64 mr-8">
          <AdminNav />
        </div>
        <div className="flex-1">
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
