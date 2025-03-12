
import { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

// Define the roles enum to match Supabase's expected values
type UserRole = 'user' | 'admin' | 'super_admin';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users' 
      }, () => {
        fetchUsers();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          department:departments(*)
        `);
      
      if (error) throw error;
      
      const adaptedData = userAdapter(data || []);
      setUsers(adaptedData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
      toast.error('Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: Partial<User>) => {
    try {
      // Ensure role is one of the allowed values
      const role = (userData.role as UserRole) || 'user';
      
      // Create properly typed user object for Supabase
      const userDataForDb = {
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email as string, // Type assertion since we know it should exist
        password: 'temporary_password', // Required field in the DB schema
        role: role,
        department_id: userData.department_id,
        phone: userData.phone || null,
        // Don't include active and status as they're not in the users table schema
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert(userDataForDb)
        .select();
      
      if (error) throw error;
      
      const newUser = userAdapter(data || [])[0];
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuário adicionado com sucesso');
      return true;
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error('Falha ao adicionar usuário');
      return false;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      // Ensure role is one of the allowed values
      const role = (userData.role as UserRole);
      
      const { error } = await supabase
        .from('users')
        .update({
          name: `${userData.first_name} ${userData.last_name}`,
          department_id: userData.department_id,
          phone: userData.phone,
          role: role,
          // Don't update email as it might be used for authentication
          // Don't update password here for security reasons
        })
        .eq('id', userData.id);
      
      if (error) throw error;
      
      setUsers(prev => 
        prev.map(u => u.id === userData.id ? { ...u, ...userData } : u)
      );
      toast.success('Usuário atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Falha ao atualizar usuário');
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Usuário excluído com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Falha ao excluir usuário');
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
