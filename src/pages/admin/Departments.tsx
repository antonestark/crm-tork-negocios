
import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Separator } from '@/components/ui/separator';
import { EnhancedDepartmentsView } from '@/components/admin/departments/EnhancedDepartmentsView';
import { PermissionGuard } from '@/components/admin/permissions/PermissionGuard';

export default function DepartmentsPage() {
  console.log('Rendering Departments Page'); // Debugging log
  
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os departamentos da organização e suas permissões de visualização.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex h-full">
        <AdminNav />
        <div className="w-full p-4">
          <PermissionGuard 
            permissionCode="admin:departments:view"
            fallback={
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-muted-foreground mb-2">Você não tem permissão para visualizar departamentos.</p>
                <p className="text-sm text-muted-foreground">Entre em contato com o administrador do sistema.</p>
              </div>
            }
          >
            <EnhancedDepartmentsView />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
}
