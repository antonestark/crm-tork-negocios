
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any)
        .from('user_with_logs')
        .select('id, name, email, role, department_id, activity_logs');

      if (error) throw error;

      const formattedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        first_name: user.name?.split(' ')[0] || '',
        last_name: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        role: user.role || 'user',
        department_id: user.department_id || null,
        activity_logs: user.activity_logs || [],
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}
