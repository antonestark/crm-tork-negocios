import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserListRow {
  id: string;
  role: string | null;
}

export function useUserRole(userId: string | null | undefined) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!userId) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('user_list')
        .select('role')
        .eq('id', userId)
        .maybeSingle<UserListRow>();

      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setRole(null);
      } else {
        setRole(data?.role ?? null);
      }

      setLoading(false);
    };

    fetchRole();
  }, [userId]);

  return { role, loading };
}
