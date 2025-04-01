
import React, { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { ensureDepartmentFormat } from './UsersTable.helper';
import { useUsers, UserCreate } from '@/hooks/users';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, UserPlus, RefreshCw } from 'lucide-react';
import { UserFormDialog } from './UserFormDialog';
import { toast } from 'sonner';

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

export const UsersTable: React.FC<UsersTableProps> = ({ filters }) => {
  const { users, loading, addUser, updateUser, deleteUser, fetchUsers } = useUsers();
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Para debugging - mostrar os usuários quando carregados
  useEffect(() => {
    console.log('Usuários carregados na tabela:', users);
  }, [users]);

  // Forçar nova busca quando o componente é montado
  useEffect(() => {
    console.log('UsersTable montado, buscando usuários...');
    fetchUsers();
  }, [fetchUsers]);

  // Função para atualizar manualmente a lista de usuários
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
      toast.success('Lista de usuários atualizada');
    } catch (error) {
      toast.error('Erro ao atualizar lista de usuários');
    } finally {
      setRefreshing(false);
    }
  };

  // Apply filters
  const filteredUsers = users.filter(user => {
    // Filter by status
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }
    
    // Filter by department
    if (filters.department !== 'all' && 
        (!user.department_id || String(user.department_id) !== filters.department)) {
      return false;
    }
    
    // Filter by search
    if (filters.search && !`${user.first_name} ${user.last_name}`.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleOpenNewUserDialog = () => {
    setSelectedUser(null);
    setOpenUserFormDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenUserFormDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const success = await deleteUser(userId);
      if (success) {
        toast.success('Usuário excluído com sucesso');
      }
    }
  };

  const handleSaveUser = async (userData: UserCreate) => {
    if (selectedUser) {
      // Update existing user
      const success = await updateUser({
        ...selectedUser,
        ...userData,
      });
      if (success) {
        setOpenUserFormDialog(false);
        toast.success('Usuário atualizado com sucesso');
      }
    } else {
      // Add new user - ensure email is provided
      const success = await addUser(userData);
      if (success) {
        setOpenUserFormDialog(false);
        toast.success('Usuário adicionado com sucesso');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Nome',
      render: (user: User) => (
        <div className="flex flex-col">
          <span className="font-medium">{`${user.first_name} ${user.last_name}`}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Função',
      render: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
          {user.role === 'admin' ? 'Administrador' : user.role === 'super_admin' ? 'Super Admin' : 'Usuário'}
        </Badge>
      ),
    },
    {
      key: 'department',
      title: 'Departamento',
      render: (user: User) => (
        <span>
          {user.department ? ensureDepartmentFormat(user.department).name : 'Sem departamento'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (user: User) => (
        <Badge variant={user.active ? 'success' : 'destructive'}>
          {user.active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (user: User) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEditUser(user)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            onClick={() => handleDeleteUser(user.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuários ({filteredUsers.length})</h2>
        <div className="flex space-x-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleOpenNewUserDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        loading={loading}
        noDataMessage="Nenhum usuário encontrado"
      />

      <UserFormDialog
        open={openUserFormDialog}
        onOpenChange={setOpenUserFormDialog}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UsersTable;
