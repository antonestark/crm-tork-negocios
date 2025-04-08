
import { useState, useEffect } from 'react';
import { useAuthState } from '@/hooks/use-auth-state';
import { supabase } from '@/integrations/supabase/client';

export function useCheckDepartment(departmentName: string, role?: string | null) {
  const { userId } = useAuthState();
  const [isInDepartment, setIsInDepartment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkDepartment = async () => {
      if (!userId) {
        setIsInDepartment(false);
        setLoading(false);
        return;
      }

      // Se for super_admin ou admin, sempre retorna true
      if (role === 'super_admin' || role === 'admin') {
        setIsInDepartment(true);
        setLoading(false);
        return;
      }

      try {
        // First get the department ID
        const { data: departmentData, error: departmentError } = await supabase
          .from('departments')
          .select('id')
          .eq('name', departmentName)
          .single();

        if (departmentError || !departmentData) {
          console.error('Error fetching department:', departmentError);
          setIsInDepartment(false);
          setLoading(false);
          return;
        }

        // Check if user is in this department through department_users
        const { data: departmentUserData, error: departmentUserError } = await supabase
          .from('department_users')
          .select('id')
          .eq('user_id', userId)
          .eq('department_id', departmentData.id)
          .single();

        if (!departmentUserError && departmentUserData) {
          setIsInDepartment(true);
        } else {
          // As a fallback, also check the users table directly
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .eq('department_id', departmentData.id)
            .single();

          if (userError) {
            console.error('Error checking user department:', userError);
            setIsInDepartment(false);
          } else {
            setIsInDepartment(!!userData);
          }
        }
      } catch (error) {
        console.error('Error in department check:', error);
        setIsInDepartment(false);
      } finally {
        setLoading(false);
      }
    };

    checkDepartment();
  }, [userId, departmentName, role]);

  return { isInDepartment, loading };
}
