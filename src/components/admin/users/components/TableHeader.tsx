
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';

interface TableHeaderProps {
  userCount: number;
  refreshing: boolean;
  onRefresh: () => void;
  onAddUser: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  userCount,
  refreshing,
  onRefresh,
  onAddUser,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Usuários ({userCount})</h2>
      <div className="flex space-x-2">
        <Button onClick={onRefresh} variant="outline" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        <Button onClick={onAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
    </div>
  );
};

export default TableHeader;
