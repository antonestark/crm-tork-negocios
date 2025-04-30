import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth
import { UserCreate, UseUsersReturn, UserRole } from './types'; // Keep UserRole if used
import { 
  fetchUsersFromAPI, 
  addUserToAPI, 
  updateUserInAPI, 
  deleteUserFromAPI 
} from './users-service';
import { toast } from 'sonner'; // Import toast

export type { UserCreate, UserRole }; // Re-export types

export const useUsers = (): UseUsersReturn => {
  const queryClient = useQueryClient();
  const { session, isLoading: isAuthLoading } = useAuth(); // Get session and auth loading state
  const queryKey = ['users'];

  // --- Query ---
  // Rename internal refetch to avoid conflict
  const { data: users = [], isLoading: loading, error, refetch: refetchUsersQuery } = useQuery<User[], Error>({ 
    queryKey: queryKey,
    queryFn: fetchUsersFromAPI, // Use the service function directly
    // Only enable the query if the session exists (user is authenticated)
    // and the initial auth check is complete (isAuthLoading is false)
    enabled: !!session && !isAuthLoading, 
  });

  // --- Mutations ---
  const addUserMutation = useMutation({
    mutationFn: addUserToAPI,
    onSuccess: (newUser) => {
      if (newUser) { // Assuming addUserToAPI returns the new user or null/undefined on failure
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Usuário adicionado com sucesso');
        // Returning true might not be necessary if caller doesn't need it
      } else {
        toast.error('Erro ao adicionar usuário');
      }
    },
    onError: (err) => {
      console.error('Erro ao adicionar usuário:', err);
      toast.error('Erro ao adicionar usuário', { description: err.message });
      // Returning false might not be necessary
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserInAPI,
    onSuccess: (success, variables) => { // variables is the userData passed to mutate
      if (success) {
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Usuário atualizado com sucesso');
      } else {
        toast.error('Erro ao atualizar usuário');
      }
    },
    onError: (err) => {
      console.error('Erro ao atualizar usuário:', err);
      toast.error('Erro ao atualizar usuário', { description: err.message });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserFromAPI,
    onSuccess: (success, variables) => { // variables is the id
      if (success) {
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success('Usuário excluído com sucesso');
      } else {
        toast.error('Falha ao excluir usuário');
      }
    },
    onError: (err) => {
      console.error('Erro ao excluir usuário:', err);
      toast.error('Erro ao excluir usuário', { description: err.message });
    },
  });

  // --- Realtime Subscription ---
  useEffect(() => {
    const channel = supabase
      .channel('users_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users' 
      }, (payload) => {
        console.log('Mudança detectada na tabela users (realtime):', payload);
        queryClient.invalidateQueries({ queryKey: queryKey });
      })
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') console.log('Realtime channel for users subscribed.');
         if (status === 'CHANNEL_ERROR') console.error('Realtime channel error (users):', err);
         if (status === 'TIMED_OUT') console.warn('Realtime channel subscription timed out (users).');
      });
      
    return () => {
      console.log('Cancelando inscrição de tempo real para users');
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey]);

  // Wrap mutate functions to maintain original hook signature if needed by callers,
  // or update callers to use mutation.mutate directly.
  // For simplicity, let's expose mutate functions directly or adjust callers later.
  // We need to decide if the hook should return boolean promises or just void mutate calls.
  // Let's stick to returning boolean promises for now to minimize changes in UsersTable.
  
  const addUser = async (userData: UserCreate): Promise<boolean> => {
    try {
      await addUserMutation.mutateAsync(userData); // Use mutateAsync to await result
      return true; // Assume success if no error thrown by mutateAsync
    } catch (e) {
      return false; // Error handled by onError callback
    }
  };
  
  const updateUser = async (userData: User): Promise<boolean> => {
     try {
      await updateUserMutation.mutateAsync(userData);
      return true; 
    } catch (e) {
      return false; 
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
     try {
      await deleteUserMutation.mutateAsync(id);
      return true; 
    } catch (e) {
      return false; 
    }
  };


  // Define fetchUsers to match the expected signature
  const fetchUsers = useCallback(async (): Promise<User[]> => {
    const { data } = await refetchUsersQuery();
    return data || []; // Return the data array or an empty array
  }, [refetchUsersQuery]);

  return {
    users,
    loading,
    error,
    fetchUsers, // Expose the wrapped refetch function
    addUser,
    updateUser,
    deleteUser
  };
};

export default useUsers;
