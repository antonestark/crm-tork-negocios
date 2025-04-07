
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/use-auth-state';

export const useCheckPermission = (permissionCode: string) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId, user } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    // Se for superadmin, concede acesso irrestrito
    if (user?.role === 'superadmin') {
      setHasPermission(true);
      setLoading(false);
      return;
    }

    checkPermission();
  }, [isAuthenticated, userId, permissionCode, user]);

  const checkPermission = async () => {
    try {
      setLoading(true);
      
      const { data: permissionData, error: permissionError } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions!inner(code)')
        .eq('user_id', userId)
        .eq('permissions.code', permissionCode);
      
      if (permissionError) {
        console.error('Error checking permission:', permissionError);
        setHasPermission(false);
      } else {
        setHasPermission(permissionData && permissionData.length > 0);
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
