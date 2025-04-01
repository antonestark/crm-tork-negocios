import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { EnhancedDepartmentsView } from '@/components/admin/departments/EnhancedDepartmentsView';
import { PermissionGuard } from '@/components/admin/permissions/PermissionGuard';
import { Building } from 'lucide-react';
import { BaseLayout } from '@/components/layout/BaseLayout'; // Import BaseLayout

export default function DepartmentsPage() {
  return (
    // Use BaseLayout
    <BaseLayout>
      {/* Removed old header and separator */}
      
      {/* Adjusted layout: Flex container for nav and main content */}
      {/* Added py-6 from BaseLayout standard, removed p-8 from original root div */}
      <div className="flex h-full py-6">
        {/* Admin Navigation */}
        <div className="w-64 mr-8 px-4"> {/* Added padding */}
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-4"> {/* Added padding */}
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
        </div>
      </div>
    </BaseLayout>
  );
}
