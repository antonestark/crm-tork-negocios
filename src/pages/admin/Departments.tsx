
import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Separator } from '@/components/ui/separator';
import { DepartmentsView } from '@/components/admin/departments/DepartmentsView';

export default function DepartmentsPage() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os departamentos da organização e seus responsáveis.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex h-full">
        <AdminNav />
        <div className="w-full p-4">
          <DepartmentsView />
        </div>
      </div>
    </div>
  );
}
