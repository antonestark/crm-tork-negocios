
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Updating the query to use the 'users' table instead of 'user_list'
        // since user_list view doesn't have email column
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role, department_id');

        if (error) throw error;

        // Map the data to User objects with proper types
        const formattedUsers: User[] = (data || []).map(user => ({
          id: user.id,
          first_name: user.name?.split(' ')[0] || '',
          last_name: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          role: user.role || 'user',
          department_id: user.department_id || null,
          // Add other required User properties with default values
          active: true,
          status: 'active'
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
