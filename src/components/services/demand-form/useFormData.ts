
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Area, User } from './types';

export const useFormData = (open: boolean) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch areas
        const { data: areasData } = await supabase
          .from('service_areas')
          .select('id, name')
          .eq('status', 'active');
          
        if (areasData) {
          setAreas(areasData);
        }
        
        // Fetch users
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name');
          
        if (usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchData();
    }
  }, [open]);

  return { areas, users, loading };
};
