
import { useState, useEffect } from 'react';
import { Permission } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Supabase
        const { data, error } = await supabase
          .from('permissions')
          .select('*')
          .order('module');
          
        if (error) throw error;
        
        setPermissions(data?.map(p => ({...p, selected: false})) || []);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPermissions();
  }, []);
  
  const deletePermission = async (permissionId: string): Promise<boolean> => {
    try {
      // In a real app, this would delete from Supabase
      console.log(`Deleting permission ${permissionId}`);
      
      // Update local state
      setPermissions(prev => prev.filter(p => p.id !== permissionId));
      return true;
    } catch (err) {
      console.error('Error deleting permission:', err);
      return false;
    }
  };

  return { permissions, loading, error, deletePermission };
};
