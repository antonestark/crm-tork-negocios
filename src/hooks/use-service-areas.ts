
import { useState, useEffect } from 'react';
import { ServiceArea, User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

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
            responsible: null // Default to null
          };

          // Only add the responsible user if it exists and is not an error
          if (area.responsible && typeof area.responsible === 'object' && !('error' in area.responsible)) {
            const responsibleUser: User = {
              id: area.responsible.id || '',
              first_name: area.responsible.first_name || '',
              last_name: area.responsible.last_name || '',
              profile_image_url: area.responsible.profile_image_url || null,
              role: area.responsible.role || 'user',
              department_id: area.responsible.department_id || null,
              phone: area.responsible.phone || null,
              active: area.responsible.active !== false, // Default to true if not explicitly false
              status: area.responsible.status || 'active',
              last_login: area.responsible.last_login || null,
              settings: area.responsible.settings || {},
              metadata: area.responsible.metadata || {},
              created_at: area.responsible.created_at || '',
              updated_at: area.responsible.updated_at || ''
            };
            serviceArea.responsible = responsibleUser;
          }

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
