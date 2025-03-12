
import { useState, useEffect } from 'react';
import { ServiceArea, User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { formatUserFromDatabase } from '@/utils/user-formatter';

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
          .select('*, responsible:users(*)');

        if (error) throw error;

        // Transform the data to match the ServiceArea type
        const transformedData: ServiceArea[] = data?.map(area => {
          // Create the base service area object
          const serviceArea: ServiceArea = {
            id: area.id,
            name: area.name,
            description: area.description || null,
            responsible_id: area.responsible_id || null,
            status: area.status || null,
            type: area.type || null,
            created_at: area.created_at || null,
            updated_at: area.updated_at || null,
            responsible: formatUserFromDatabase(area.responsible) // Use our formatter utility
          };

          return serviceArea;
        }) || [];

        setAreas(transformedData);
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
