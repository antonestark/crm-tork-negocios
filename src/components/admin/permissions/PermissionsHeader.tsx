
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCheckPermission } from '@/hooks/use-check-permission';

interface PermissionsHeaderProps {
  onNewPermission: () => void;
}

export function PermissionsHeader({ onNewPermission }: PermissionsHeaderProps) {
  const { hasPermission } = useCheckPermission('admin:permissions:create');

  return (
    <div className="flex justify-between mb-4">
      <h2 className="text-xl font-semibold">Permissões do Sistema</h2>
      {hasPermission && (
        <Button size="sm" onClick={onNewPermission}>
          <Plus className="h-4 w-4 mr-2" /> Nova Permissão
        </Button>
      )}
    </div>
  );
}
