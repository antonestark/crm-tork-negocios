
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceArea } from '@/types/admin';

export const useServiceAreas = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('service_areas')
          .select('*, responsible:responsible_id(id, first_name, last_name)');
          
        if (error) throw error;
        
        setAreas(data || []);
      } catch (err) {
        console.error('Error fetching service areas:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAreas();
  }, []);
  
  return { areas, loading, error };
};
