
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { User } from '@/types/admin';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ 
  user, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => onEdit(user)}
        variant="outline"
        size="sm"
      >
        <Edit className="h-4 w-4 mr-1" />
        Editar
      </Button>
      <Button
        onClick={() => onDelete(user.id)}
        variant="destructive"
        size="sm"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
};

export default UserActions;
