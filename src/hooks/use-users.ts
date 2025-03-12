
import { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

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
      // Using camelCase to snake_case conversion for the API
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userData.role,
          department_id: userData.department_id,
          phone: userData.phone,
          active: userData.active,
          status: userData.status,
          // Include other fields as needed
        }])
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
      const { error } = await supabase
        .from('users')
        .update({
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userData.role,
          department_id: userData.department_id,
          phone: userData.phone,
          active: userData.active,
          status: userData.status,
          // Include other fields as needed
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
