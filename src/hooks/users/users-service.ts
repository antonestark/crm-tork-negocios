import { supabase } from '@/integrations/supabase/client';
import { userAdapter } from '@/integrations/supabase/adapters';
import { formatUserFromDatabase } from '@/utils/user-formatter';
import { toast } from 'sonner';
import { User } from '@/types/admin';
import { UserCreate, UserRole } from './types';
import type { Database } from '@/types/supabase'; // Import Database type

export async function fetchUsersFromAPI() {
  try {
    console.log('Fetching users from database...');
    
    // Fetch users and join with departments table to get the full department object
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        departments (*) 
      `); // Fetch all columns from departments

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    console.log('Raw users data:', data);
    const adaptedUsers = userAdapter(data || []);
    console.log('Adapted users data:', adaptedUsers);
    return adaptedUsers;
  } catch (err) {
    console.error('Error in fetchUsersFromAPI:', err);
    toast.error('Falha ao carregar usuários');
    throw err;
  }
}

// Now requires tenantId
export async function addUserToAPI(userData: UserCreate, tenantId: string) {
  if (!tenantId) {
    console.error("Tenant ID is required to add a user.");
    toast.error("Erro: ID do inquilino não encontrado. Não é possível adicionar usuário.");
    throw new Error("Tenant ID is missing");
  }
  try {
    // Ensure role is one of the allowed values
    const role = (userData.role as UserRole) || 'user';
    
    // Check if email exists
    if (!userData.email) {
      throw new Error('Email é obrigatório');
    }
    
    // Create properly typed user object for Supabase, allowing optional id
    const userDataForDb: Partial<Database['public']['Tables']['users']['Insert']> & { name: string; email: string; role: UserRole; status: string; active: boolean; tenant_id: string } = {
      name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      department_id: userData.department_id,
      phone: userData.phone || null,
      role: role,
      status: userData.status || 'active',
      active: userData.active !== false,
      tenant_id: tenantId, // Add tenant_id
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
              // Note: Cannot set tenant_id directly in auth metadata easily here
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
          // If auth user was created, ensure the ID matches the one we insert
          userDataForDb.id = authUserId; // Use the ID from auth.signUp
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
      // Consider deleting the auth user if DB insert fails? Complex rollback.
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
  } catch (err: any) { // Catch any type of error
    console.error('Error adding user:', err);
    toast.error(`Falha ao adicionar usuário: ${err.message || 'Erro desconhecido'}`);
    throw err;
  }
}

export async function updateUserInAPI(userData: User) {
  try {
    // Ensure role is one of the allowed values
    const role = (userData.role as UserRole);
    
    // Prepare data, excluding fields that shouldn't be updated directly here
    // (like email, password, tenant_id)
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
  } catch (err: any) { // Catch any type of error
    console.error('Error updating user:', err);
    toast.error(`Falha ao atualizar usuário: ${err.message || 'Erro desconhecido'}`);
    return false;
  }
}

export async function deleteUserFromAPI(id: string) {
  try {
    console.log('Deleting user with ID:', id);
    
    if (!id) {
      throw new Error('ID do usuário não fornecido');
    }
    
    // Delete from users table first
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error('Erro do Supabase ao excluir usuário da tabela:', dbError);
      throw dbError;
    }
    
    // Attempt to delete from auth.users (requires service_role key)
    // This should ideally be done in a backend function for security
    // console.warn("Attempting to delete user from auth.users - requires service_role privileges");
    // const { error: authError } = await supabase.auth.admin.deleteUser(id);
    // if (authError) {
    //   console.error('Erro ao excluir usuário do Supabase Auth:', authError);
    //   toast.warning("Usuário excluído do banco de dados, mas falha ao remover da autenticação.");
    //   // Don't throw error here, as DB deletion succeeded
    // } else {
    //   console.log('User deleted successfully from auth');
    // }
    
    console.log('User deleted successfully from database table');
    return true;
  } catch (err: any) { // Catch any type of error
    console.error('Error deleting user:', err);
    toast.error(`Falha ao excluir usuário: ${err.message || 'Erro desconhecido'}`);
    return false;
  }
}
