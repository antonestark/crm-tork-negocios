import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { toast } from 'sonner';
import { fetchUsersFromAPI, addUserToAPI, updateUserInAPI, deleteUserFromAPI } from './users-service'; // Import service functions
import { UserCreate } from './types'; // Import UserCreate type
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth

export function useUsers() {
  const { tenantId } = useAuth(); // Get tenantId
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users - RLS should filter by tenant automatically if policies are correct
      const data = await fetchUsersFromAPI();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err as Error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []); // Removed tenantId dependency as RLS handles filtering

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(async (userData: UserCreate): Promise<User | null> => {
    if (!tenantId) {
      toast.error("Erro: ID do inquilino não encontrado.");
      return null;
    }
    try {
      const newUser = await addUserToAPI(userData, tenantId); // Pass tenantId
      if (newUser) {
        // Optionally refetch or update local state
        fetchUsers(); // Refetch to get the latest list including the new user
        return newUser;
      }
      return null;
    } catch (err) {
      // Error is already handled and toasted in addUserToAPI
      return null;
    }
  }, [tenantId, fetchUsers]); // Add dependencies

  const updateUser = useCallback(async (userData: User): Promise<boolean> => {
    try {
      const success = await updateUserInAPI(userData);
      if (success) {
        // Optionally refetch or update local state
        fetchUsers(); // Refetch to update the list
      }
      return success;
    } catch (err) {
      // Error is already handled and toasted in updateUserInAPI
      return false;
    }
  }, [fetchUsers]); // Add dependencies

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const success = await deleteUserFromAPI(userId);
      if (success) {
        // Optionally refetch or update local state
         setUsers(prev => prev.filter(u => u.id !== userId)); // Optimistic update
        // fetchUsers(); // Or refetch
      }
      return success;
    } catch (err) {
      // Error is already handled and toasted in deleteUserFromAPI
      return false;
    }
  }, []); // No dependency on fetchUsers if using optimistic update

  // Return the CRUD functions along with state
  return { users, loading, error, fetchUsers, addUser, updateUser, deleteUser };
}
