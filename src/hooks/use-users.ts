import { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';

// Define the roles enum to match Supabase's expected values
type UserRole = 'user' | 'admin' | 'super_admin';

// Define interface for user creation that includes email and client fields
export interface UserCreate extends Partial<User> {
  email: string;  // Make email required for new users
  password?: string; // Optional password for new users
  // Client fields already included through Partial<User>
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
      console.log('Fetching users from database...');
      
      // Modified query to include all fields
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      console.log('Users data fetched successfully:', data);
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
        // Include client fields
        company_name: userData.company_name,
        trading_name: userData.trading_name,
        responsible: userData.responsible,
        room: userData.room,
        meeting_room_credits: userData.meeting_room_credits,
        contract_start_date: userData.contract_start_date,
        contract_end_date: userData.contract_end_date,
        cnpj: userData.cnpj,
        address: userData.address,
        monthly_value: userData.monthly_value
      };
      
      console.log('Adding new user with data:', userDataForDb);
      
      // First check if user with this email already exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', userData.email)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking for existing user:', checkError);
      }
      
      if (existingUser) {
        throw new Error(`Usuário com email ${userData.email} já existe`);
      }
      
      // Try to create auth user if password is provided, but continue even if it fails
      let authError = false;
      let authUserId = null;
      
      if (userData.password) {
        try {
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                name: userDataForDb.name,
                role: role
              }
            }
          });
          
          if (signUpError) {
            console.warn('Auth user creation failed:', signUpError.message);
            // Only set auth error if it's not because the user already exists
            if (signUpError.message !== 'User already registered') {
              authError = true;
            }
          } else if (authData && authData.user) {
            console.log('Auth user created successfully:', authData.user.id);
            authUserId = authData.user.id;
          }
        } catch (authErr) {
          console.warn('Auth error caught:', authErr);
          authError = true;
        }
      }
      
      // Insert into users table
      const { data, error } = await supabase
        .from('users')
        .insert(userDataForDb)
        .select();
      
      if (error) {
        console.error('Error inserting user to database:', error);
        throw error;
      }
      
      console.log('User added successfully to database:', data);
      const newUser = userAdapter(data || [])[0];
      setUsers(prev => [...prev, newUser]);
      
      // Show appropriate toast based on auth result
      if (authError) {
        toast.warning('Usuário criado no banco de dados, mas falha ao criar no sistema de autenticação');
      } else {
        toast.success('Usuário adicionado com sucesso');
      }
      
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
      
      // Include client fields in the update
      const updateData = {
        name: `${userData.first_name} ${userData.last_name}`,
        department_id: userData.department_id,
        phone: userData.phone,
        role: role,
        status: userData.status,
        company_name: userData.company_name,
        trading_name: userData.trading_name,
        responsible: userData.responsible,
        room: userData.room,
        meeting_room_credits: userData.meeting_room_credits,
        contract_start_date: userData.contract_start_date,
        contract_end_date: userData.contract_end_date,
        cnpj: userData.cnpj,
        address: userData.address,
        monthly_value: userData.monthly_value
      };
      
      console.log('Updating user with data:', updateData);
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userData.id);
      
      if (error) throw error;
      
      console.log('User updated successfully');
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
      console.log('Deleting user with ID:', id);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('User deleted successfully');
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
