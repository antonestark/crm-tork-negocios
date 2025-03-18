
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DepartmentSelectionPlaceholderProps {
  onNewDepartment: () => void;
}

export function DepartmentSelectionPlaceholder({ onNewDepartment }: DepartmentSelectionPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Plus className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">Nenhum departamento selecionado</h3>
      <p className="text-muted-foreground mb-4">
        Selecione um departamento para ver seus detalhes ou crie um novo.
      </p>
      <Button onClick={onNewDepartment} size="lg">
        <Plus className="h-4 w-4 mr-2" /> Novo Departamento
      </Button>
    </div>
  );
}
