
import React, { useState, useEffect } from 'react';
import { PermissionsHeader } from './PermissionsHeader';
import { PermissionsGrid } from './PermissionsGrid';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/types/admin';
import { NewPermissionDialog } from './NewPermissionDialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuthState } from '@/hooks/use-auth-state';

export function PermissionsList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { permissions, loading, error, deletePermission, createPermission, updatePermission } = usePermissions();
  const { isAuthenticated } = useAuthState();

  const handleEdit = (permission: Permission) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar autenticado para editar permissões");
      return;
    }
    
    // In this example, we'll reuse the create dialog for editing
    setCurrentPermission(permission);
    setIsDialogOpen(true);
  };

  const handleDelete = async (permission: Permission) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar autenticado para excluir permissões");
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir a permissão "${permission.name}"?`)) {
      await deletePermission(permission.id);
    }
  };

  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);

  const handleNewPermission = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar autenticado para criar permissões");
      return;
    }
    
    setCurrentPermission(null);
    setIsDialogOpen(true);
  };

  const handleSavePermission = async (permissionData: Partial<Permission>) => {
    if (currentPermission) {
      // Update existing permission
      await updatePermission({
        ...currentPermission,
        ...permissionData
      });
    } else {
      // Create new permission
      await createPermission(permissionData as Permission);
    }
    
    setIsDialogOpen(false);
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-800 text-lg font-medium">Erro ao carregar permissões</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <PermissionsHeader onNewPermission={handleNewPermission} />

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando permissões...</span>
        </div>
      ) : (
        <PermissionsGrid 
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <NewPermissionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePermission}
        permission={currentPermission}
      />
    </div>
  );
}
