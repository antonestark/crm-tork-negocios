import { useState, useEffect } from 'react';
import { supabase, permissionAdapter } from '@/integrations/supabase/client';
import { Permission } from '@/types/admin';

interface UsePermissionsProps {
  userId?: string;
}

export const usePermissions = ({ userId }: UsePermissionsProps = {}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('user_permissions')
          .select('permission:permissions(*)')
          .eq('user_id', userId);

        if (error) {
          setError(error);
          console.error('Error fetching permissions:', error);
          return;
        }

        const extractedPermissions = data?.map(item => item.permission).filter(Boolean) || [];
        const adaptedPermissions = permissionAdapter(extractedPermissions);
        setPermissions(adaptedPermissions);
      } catch (err: any) {
        setError(err);
        console.error('Unexpected error fetching permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userId]);

  return { permissions, loading, error };
};
