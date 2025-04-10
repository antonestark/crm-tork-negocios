
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DepartmentPermissionView {
  permission_id: string;
  code: string;
  title: string;
  description: string;
  resource: string;
  action: string;
  department_id: string | null; // Changed to string | null to match potential database return
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
      // Convert departmentId string to number for the query
      const departmentIdAsNumber = parseInt(departmentId, 10);
      if (isNaN(departmentIdAsNumber)) {
        throw new Error('Invalid department ID format');
      }

      // Use the generic form when accessing views not defined in the TypeScript types
      const { data, error } = await supabase
        .from('department_permission_view')
        .select('*')
        .eq('department_id', departmentIdAsNumber) // Filter by the specific department ID (as number)
        .order('resource');

      if (error) throw error;

      // Cast the data to our expected type - ensuring department_id is treated as string
      const typedData = (data || []).map(item => ({
        ...item,
        department_id: item.department_id !== null ? String(item.department_id) : null
      })) as DepartmentPermissionView[];

      setPermissions(typedData);
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
