import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DepartmentPermissionView {
  permission_id: string;
  code: string;
  title: string;
  description: string;
  resource: string;
  action: string;
  department_id: string | null;
  assigned: boolean;
}

export function useAllDepartmentPermissions(departmentId: string | null | undefined) {
  const [permissions, setPermissions] = useState<DepartmentPermissionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermissions = async () => {
    if (!departmentId) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await (supabase
        .from('department_permission_view') as any)
        .select('*')
        .order('resource');

      if (error) throw error;

      setPermissions(data as DepartmentPermissionView[] || []);
    } catch (err) {
      console.error('Erro ao buscar permissões do departamento:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [departmentId]);

  return { permissions, loading, error, refetch: fetchPermissions };
}
