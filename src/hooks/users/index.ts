
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { UserCreate, UseUsersReturn } from './types';
import { 
  fetchUsersFromAPI, 
  addUserToAPI, 
  updateUserInAPI, 
  deleteUserFromAPI 
} from './users-service';

export type { UserCreate, UserRole } from './types';

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      console.log('Iniciando busca de usuários...');
      setLoading(true);
      setError(null);
      const adaptedData = await fetchUsersFromAPI();
      console.log('Dados adaptados recebidos:', adaptedData);
      setUsers(adaptedData);
      return adaptedData;
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users' 
      }, (payload) => {
        console.log('Mudança detectada na tabela users:', payload);
        fetchUsers();
      })
      .subscribe();
      
    return () => {
      console.log('Cancelando inscrição de tempo real');
      subscription.unsubscribe();
    };
  }, [fetchUsers]);

  const addUser = async (userData: UserCreate) => {
    try {
      const newUser = await addUserToAPI(userData);
      await fetchUsers(); // Re-fetch all users instead of trying to merge
      return true;
    } catch (err) {
      console.error('Erro ao adicionar usuário:', err);
      return false;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      const success = await updateUserInAPI(userData);
      if (success) {
        await fetchUsers(); // Re-fetch all users
      }
      return success;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const success = await deleteUserFromAPI(id);
      if (success) {
        await fetchUsers(); // Re-fetch all users
      }
      return success;
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  };
};

export default useUsers;
