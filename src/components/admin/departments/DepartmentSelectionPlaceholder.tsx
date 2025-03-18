
import React from 'react';
import { Plus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DepartmentSelectionPlaceholderProps {
  onNewDepartment: () => void;
}

export function DepartmentSelectionPlaceholder({ onNewDepartment }: DepartmentSelectionPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Building className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">Nenhum departamento selecionado</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Selecione um departamento na lista ao lado para ver seus detalhes ou crie um novo departamento para começar.
      </p>
      <Button onClick={onNewDepartment} size="lg">
        <Plus className="h-4 w-4 mr-2" /> Novo Departamento
      </Button>
    </div>
  );
}
