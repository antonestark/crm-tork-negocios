
import { useState, useEffect } from 'react';
import { useAuthState } from '@/hooks/use-auth-state';
import { supabase } from '@/integrations/supabase/client';

export function useCheckDepartment(departmentName: string) {
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

        // Check if user is in this department
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
      } catch (error) {
        console.error('Error in department check:', error);
        setIsInDepartment(false);
      } finally {
        setLoading(false);
      }
    };

    checkDepartment();
  }, [userId, departmentName]);

  return { isInDepartment, loading };
}
