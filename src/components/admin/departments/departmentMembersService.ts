
import { Department, User, UserDepartmentRoleMember } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

// Buscar membros do departamento via tabela department_users + join com users
export const fetchDepartmentMembers = async (departmentId: string): Promise<UserDepartmentRoleMember[]> => {
  try {
    const { data, error } = await supabase
      .from('department_users')
      .select(`
        id,
        user_id,
        department_id,
        created_at,
        user:users (
          id,
          name,
          email,
          profile_image_url,
          role,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('department_id', departmentId);

    if (error) {
      console.error('Erro ao buscar membros do departamento:', error);
      return [];
    }

    return data.map((item: any) => {
      const [first_name, ...last_name_parts] = (item.user.name || '').split(' ');
      return {
        id: item.id,
        user_id: item.user_id,
        department_id: item.department_id,
        role: item.user.role || 'member',
        start_date: null,
        end_date: null,
        created_at: item.created_at,
        updated_at: item.user.updated_at,
        user: {
          id: item.user.id,
          first_name,
          last_name: last_name_parts.join(' '),
          email: item.user.email,
          profile_image_url: item.user.profile_image_url,
          role: item.user.role,
          department_id: item.department_id,
          status: item.user.status
        }
      };
    });
  } catch (error) {
    console.error('Erro inesperado ao buscar membros:', error);
    return [];
  }
};

// Buscar usuários disponíveis (não associados a este departamento)
export const fetchAvailableUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }

    return data.map((user: any) => {
      const [first_name, ...last_name_parts] = (user.name || '').split(' ');
      return {
        id: user.id,
        first_name,
        last_name: last_name_parts.join(' '),
        email: user.email,
        profile_image_url: user.profile_image_url,
        role: user.role,
        department_id: null, // não relevante aqui
        phone: user.phone,
        active: user.active,
        status: user.status,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    });
  } catch (error) {
    console.error('Erro inesperado ao buscar usuários:', error);
    return [];
  }
};

// Adicionar membro ao departamento (inserir em department_users)
export const addDepartmentMember = async (
  userId: string,
  department: Department,
  role: string,
  availableUsers: User[]
): Promise<UserDepartmentRoleMember | null> => {
  try {
    const { data, error } = await supabase
      .from('department_users')
      .insert({
        user_id: userId,
        department_id: department.id
      })
      .select('id, created_at');

    if (error || !data || data.length === 0) {
      console.error('Erro ao adicionar membro:', error);
      return null;
    }

    const user = availableUsers.find(u => u.id === userId);
    if (!user) return null;

    const [first_name, ...last_name_parts] = (user.name || '').split(' ');

    return {
      id: data[0].id,
      user_id: userId,
      department_id: department.id.toString(),
      role,
      start_date: new Date().toISOString(),
      end_date: null,
      created_at: data[0].created_at,
      updated_at: new Date().toISOString(),
      user: {
        id: user.id,
        first_name,
        last_name: last_name_parts.join(' '),
        email: user.email,
        profile_image_url: user.profile_image_url,
        role,
        department_id: department.id,
        status: user.status
      }
    };
  } catch (error) {
    console.error('Erro inesperado ao adicionar membro:', error);
    return null;
  }
};

// Remover membro do departamento (deletar de department_users)
export const removeDepartmentMember = async (departmentUserId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('department_users')
      .delete()
      .eq('id', departmentUserId);

    if (error) {
      console.error('Erro ao remover membro:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao remover membro:', error);
    return false;
  }
};
