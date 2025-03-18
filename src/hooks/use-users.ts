
import { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

// Define the roles enum to match Supabase's expected values
type UserRole = 'user' | 'admin' | 'super_admin';

// Define interface for user creation that includes email
interface UserCreate extends Partial<User> {
  email: string;  // Make email required for new users
  password?: string; // Optional password for new users
}

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

  const addUser = async (userData: UserCreate) => {
    try {
      // Ensure role is one of the allowed values
      const role = (userData.role as UserRole) || 'user';
      
      // Check if email exists
      if (!userData.email) {
        throw new Error('Email é obrigatório');
      }
      
      // Create properly typed user object for Supabase
      const userDataForDb = {
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        department_id: userData.department_id,
        phone: userData.phone || null,
        role: role,
        status: userData.status || 'active',
        active: userData.active !== false
      };
      
      // First, try to create auth user if password is provided
      if (userData.password) {
        const { error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userDataForDb.name,
              role: role
            }
          }
        });
        
        if (authError) throw authError;
      }
      
      // Then insert into users table
      const { data, error } = await supabase
        .from('users')
        .insert(userDataForDb)
        .select();
      
      if (error) throw error;
      
      const newUser = userAdapter(data || [])[0];
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error(`Falha ao adicionar usuário: ${err.message || 'Erro desconhecido'}`);
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
          status: userData.status,
          active: userData.active
        })
        .eq('id', userData.id);
      
      if (error) throw error;
      
      setUsers(prev => 
        prev.map(u => u.id === userData.id ? { ...u, ...userData } : u)
      );
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(`Falha ao atualizar usuário: ${err.message || 'Erro desconhecido'}`);
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
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(`Falha ao excluir usuário: ${err.message || 'Erro desconhecido'}`);
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
