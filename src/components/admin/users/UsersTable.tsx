import React, { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { useUsers, UserCreate } from '@/hooks/users';
import { DataTable } from '@/components/admin/data-table';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { UserFormDialog } from './UserFormDialog';
import TableHeader from './components/TableHeader';
import UserRow from './components/UserRow';

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

const UsersTable: React.FC<UsersTableProps> = ({ filters }) => {
  const { users, loading, addUser, updateUser, deleteUser, fetchUsers } = useUsers();
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    console.log('Usuários carregados na tabela:', users);
  }, [users]);

  useEffect(() => {
    console.log('UsersTable montado, buscando usuários...');
    fetchUsers();
  }, [fetchUsers]);

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

  const filteredUsers = users.filter(user => {
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }
    if (filters.department !== 'all' && (!user.department_id || String(user.department_id) !== filters.department)) {
      return false;
    }
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

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    console.log('Tentando excluir usuário ID:', userToDelete);
    try {
      const success = await deleteUser(userToDelete);
      if (success) {
        toast.success('Usuário excluído com sucesso');
      } else {
        toast.error('Falha ao excluir usuário');
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveUser = async (userData: UserCreate) => {
    if (selectedUser) {
      const success = await updateUser({
        ...selectedUser,
        ...userData,
      });
      if (success) {
        setOpenUserFormDialog(false);
        toast.success('Usuário atualizado com sucesso');
      }
    } else {
      const success = await addUser(userData);
      if (success) {
        await fetchUsers();
        setOpenUserFormDialog(false);
        toast.success('Usuário adicionado com sucesso');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Nome',
      render: (user: User) => {
        const row = UserRow({ user, onEdit: handleEditUser, onDelete: handleDeleteUser });
        return row.name;
      },
    },
    {
      key: 'role',
      title: 'Função',
      render: (user: User) => {
        const row = UserRow({ user, onEdit: handleEditUser, onDelete: handleDeleteUser });
        return row.role;
      },
    },
    {
      key: 'department',
      title: 'Departamento',
      render: (user: User) => {
        const row = UserRow({ user, onEdit: handleEditUser, onDelete: handleDeleteUser });
        return row.department;
      },
    },
    {
      key: 'status',
      title: 'Status',
      render: (user: User) => {
        const row = UserRow({ user, onEdit: handleEditUser, onDelete: handleDeleteUser });
        return row.status;
      },
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (user: User) => {
        const row = UserRow({ user, onEdit: handleEditUser, onDelete: handleDeleteUser });
        return row.actions;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg p-6 space-y-4">
        <TableHeader
          userCount={filteredUsers.length}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onAddUser={handleOpenNewUserDialog}
        />

        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          noDataMessage="Nenhum usuário encontrado"
        />
      </div>

      <UserFormDialog
        open={openUserFormDialog}
        onOpenChange={setOpenUserFormDialog}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

export default UsersTable;
