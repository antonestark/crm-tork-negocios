
import React from 'react';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { toast } from '@/components/ui/use-toast';
import { Department } from '@/types/admin';

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onDelete: () => void;
  hasDependentEntities: boolean;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  department,
  onDelete,
  hasDependentEntities
}: DeleteDepartmentDialogProps) {
  const handleConfirm = () => {
    if (!department) return;
    
    onDelete();
    toast({
      title: "Departamento excluído",
      description: `O departamento ${department.name} foi excluído com sucesso.`,
    });
  };

  const description = hasDependentEntities
    ? `O departamento ${department?.name} possui usuários ou subdepartamentos vinculados. A exclusão irá remover todas as associações.`
    : `Tem certeza que deseja excluir o departamento ${department?.name}? Esta ação não pode ser desfeita.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir Departamento"
      description={description}
      onConfirm={handleConfirm}
      confirmText="Excluir"
      cancelText="Cancelar"
      variant="destructive"
    />
  );
}
