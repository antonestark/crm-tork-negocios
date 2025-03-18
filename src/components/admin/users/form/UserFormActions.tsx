
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserFormActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const UserFormActions: React.FC<UserFormActionsProps> = ({ 
  isEditMode,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditMode ? 'Atualizar' : 'Criar Usuário'}
      </Button>
    </div>
  );
};
