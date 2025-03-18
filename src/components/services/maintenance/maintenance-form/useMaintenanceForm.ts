
import { useState, useEffect } from 'react';
import { fetchAreas } from '@/services/maintenance';
import { toast } from 'sonner';

export function useMaintenanceForm(open: boolean) {
  const [areas, setAreas] = useState<any[]>([]);
  const [areasLoading, setAreasLoading] = useState(true);
  
  useEffect(() => {
    // If areas data is loaded, set loading to false
    if (areas && areas.length > 0) {
      setAreasLoading(false);
    } else if (open) {
      // Load areas when the form opens
      loadServiceAreas();
    }
  }, [areas, open]);
  
  const loadServiceAreas = async () => {
    try {
      console.log("Loading service areas for maintenance form...");
      setAreasLoading(true);
      const areasData = await fetchAreas();
      console.log("Areas loaded for maintenance form:", areasData);
      setAreas(areasData);
    } catch (error) {
      console.error("Error loading service areas:", error);
      toast.error("Falha ao carregar áreas de serviço");
    } finally {
      setAreasLoading(false);
    }
  };
  
  return {
    areas,
    areasLoading,
    setAreas,
    loadServiceAreas
  };
}
