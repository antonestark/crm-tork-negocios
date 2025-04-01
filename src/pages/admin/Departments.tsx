
import React from 'react';
import { EnhancedDepartmentsView } from '@/components/admin/departments/EnhancedDepartmentsView';
import { PermissionGuard } from '@/components/admin/permissions/PermissionGuard';
import { Building } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function DepartmentsPage() {
  return (
    <AdminLayout title="Departamentos">
      <PermissionGuard 
        permissionCode="admin:departments:view"
        fallback={
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">Acesso Negado</p>
            <p className="text-muted-foreground mb-2">Você não tem permissão para visualizar departamentos.</p>
            <p className="text-sm text-muted-foreground">Entre em contato com o administrador do sistema para solicitar acesso.</p>
          </div>
        }
      >
        <EnhancedDepartmentsView />
      </PermissionGuard>
    </AdminLayout>
  );
}
