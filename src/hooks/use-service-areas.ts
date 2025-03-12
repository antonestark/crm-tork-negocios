
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
          .select('*, responsible:users(id, first_name, last_name, role)');

        if (error) throw error;

        // Transform the data to match the ServiceArea type
        const transformedData: ServiceArea[] = data?.map(area => ({
          id: area.id,
          name: area.name,
          description: area.description || null,
          responsible_id: area.responsible_id || null,
          status: area.status || null,
          type: area.type || null,
          created_at: area.created_at || null,
          updated_at: area.updated_at || null,
          // Handle potential errors in join by providing a null responsible when needed
          responsible: area.responsible && !('error' in area.responsible) ? {
            id: area.responsible.id || '',
            first_name: area.responsible.first_name || '',
            last_name: area.responsible.last_name || '',
            profile_image_url: null, // Default values for required fields
            role: area.responsible.role || 'user',
            department_id: null,
            phone: null,
            active: true,
            status: 'active',
            last_login: null,
            settings: {},
            metadata: {},
            created_at: '',
            updated_at: ''
          } as User : null
        })) || [];

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
