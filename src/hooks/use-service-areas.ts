
import { useState, useEffect } from 'react';
import { ServiceArea } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_areas')
        .select(`
          *,
          users:responsible_id (first_name, last_name)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching service areas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar áreas de serviço",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();

    const subscription = supabase
      .channel('service_areas_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_areas' 
      }, () => {
        fetchAreas();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    areas,
    loading,
    refreshAreas: fetchAreas
  };
}
