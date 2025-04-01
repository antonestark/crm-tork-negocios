
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
      const adaptedData = await fetchUsersFromAPI();
      console.log('Dados adaptados recebidos:', adaptedData);
      setUsers(adaptedData);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err as Error);
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
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (err) {
      console.error('Erro ao adicionar usuário:', err);
      return false;
    }
  };

  const updateUser = async (userData: User) => {
    const success = await updateUserInAPI(userData);
    if (success) {
      setUsers(prev => 
        prev.map(u => u.id === userData.id ? { ...u, ...userData } : u)
      );
    }
    return success;
  };

  const deleteUser = async (id: string) => {
    const success = await deleteUserFromAPI(id);
    if (success) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
    return success;
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
