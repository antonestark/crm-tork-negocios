
import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { toast } from 'sonner';
import { User } from '@/types/admin';
import { UserCreate, UserRole } from './types';

export async function fetchUsersFromAPI() {
  try {
    console.log('Fetching users from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        department:department_id(
          id,
          name,
          description
        )
      `);
    
    if (error) throw error;
    
    console.log('Users data fetched successfully:', data);
    return userAdapter(data || []);
  } catch (err) {
    console.error('Error fetching users:', err);
    toast.error('Falha ao carregar usuários');
    throw err;
  }
}

export async function addUserToAPI(userData: UserCreate) {
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
      active: userData.active !== false,
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
    
    // Show appropriate toast based on auth result
    if (authError) {
      toast.warning('Usuário criado no banco de dados, mas falha ao criar no sistema de autenticação');
    } else {
      toast.success('Usuário adicionado com sucesso');
    }
    
    return userAdapter(data || [])[0];
  } catch (err) {
    console.error('Error adding user:', err);
    toast.error(`Falha ao adicionar usuário: ${err.message || 'Erro desconhecido'}`);
    throw err;
  }
}

export async function updateUserInAPI(userData: User) {
  try {
    // Ensure role is one of the allowed values
    const role = (userData.role as UserRole);
    
    const updateData = {
      name: `${userData.first_name} ${userData.last_name}`,
      department_id: userData.department_id,
      phone: userData.phone,
      role: role,
      status: userData.status,
      active: userData.active !== false,
    };
    
    console.log('Updating user with data:', updateData);
    
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userData.id);
    
    if (error) throw error;
    
    console.log('User updated successfully');
    toast.success('Usuário atualizado com sucesso');
    return true;
  } catch (err) {
    console.error('Error updating user:', err);
    toast.error(`Falha ao atualizar usuário: ${err.message || 'Erro desconhecido'}`);
    return false;
  }
}

export async function deleteUserFromAPI(id: string) {
  try {
    console.log('Deleting user with ID:', id);
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    console.log('User deleted successfully');
    toast.success('Usuário excluído com sucesso');
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    toast.error(`Falha ao excluir usuário: ${err.message || 'Erro desconhecido'}`);
    return false;
  }
}
