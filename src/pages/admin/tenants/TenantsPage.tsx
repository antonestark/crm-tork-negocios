import React, { useState } from 'react'; // Import useState
import { Button } from '@/components/ui/button';
import { TenantsDataTable } from '@/components/admin/tenants/TenantsDataTable';
import { columns } from '@/components/admin/tenants/columns';
import { useTenants } from '@/hooks/use-tenants';
import { AddTenantForm } from '@/components/admin/tenants/AddTenantForm';
import { EditTenantForm } from '@/components/admin/tenants/EditTenantForm'; // Import Edit form
import { Tenant } from '@/types/supabase'; // Import Tenant type

// Mock data removed, will fetch from Supabase

// Placeholder fetch function removed


const TenantsPage: React.FC = () => {
  // Fetch tenants using the custom hook
  const { data: tenants, isLoading, error } = useTenants();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const handleOpenEditDialog = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsEditDialogOpen(true);
  };

  if (isLoading) return <div className="container mx-auto py-10">Carregando inquilinos...</div>;
  if (error) return <div className="container mx-auto py-10">Erro ao carregar inquilinos: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Inquilinos</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Alterar Token Asaas</Button> {/* TODO: Add functionality */}
          <AddTenantForm>
            {({ onOpen }) => (
              <Button onClick={onOpen}>Adicionar Inquilino</Button>
            )}
          </AddTenantForm>
        </div>
      </div>
      {/* Pass handleOpenEditDialog via table meta */}
      <TenantsDataTable
        columns={columns}
        data={tenants || []}
        meta={{
          openEditDialog: handleOpenEditDialog,
          // Add other handlers here if needed (delete, etc.)
        }}
      />

      {/* Render the Edit Tenant Dialog */}
      <EditTenantForm
        tenant={editingTenant}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default TenantsPage;
