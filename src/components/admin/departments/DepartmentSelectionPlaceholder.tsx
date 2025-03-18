
import React from 'react';
import { Plus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DepartmentSelectionPlaceholderProps {
  onNewDepartment: () => void;
  departmentsExist?: boolean;
}

export function DepartmentSelectionPlaceholder({ 
  onNewDepartment,
  departmentsExist = true
}: DepartmentSelectionPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Building className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">
        {departmentsExist 
          ? 'Nenhum departamento selecionado' 
          : 'Nenhum departamento cadastrado'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {departmentsExist 
          ? 'Selecione um departamento na lista ao lado para ver seus detalhes ou crie um novo departamento para começar.' 
          : 'Cadastre um novo departamento para começar a gerenciar a estrutura da sua organização.'}
      </p>
      <Button onClick={onNewDepartment} size="lg">
        <Plus className="h-4 w-4 mr-2" /> Novo Departamento
      </Button>
    </div>
  );
}
