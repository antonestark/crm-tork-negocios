
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/use-auth-state';

export const useCheckPermission = (permissionCode: string) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    checkPermission();
  }, [isAuthenticated, userId, permissionCode]);

  const checkPermission = async () => {
    try {
      setLoading(true);
      
      // Call the Supabase function to check if the user has the permission
      const { data, error } = await supabase.rpc('user_has_permission', {
        permission_code: permissionCode
      });
      
      if (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } else {
        setHasPermission(data || false);
      }
    } catch (err) {
      console.error('Error checking permission:', err);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    hasPermission,
    loading,
    checkPermission
  };
};
