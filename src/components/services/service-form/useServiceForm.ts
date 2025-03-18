
import { useState, useEffect } from 'react';
import { fetchServiceAreas } from '@/services/service';
import { toast } from 'sonner';

export function useServiceForm(open: boolean) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [areaId, setAreaId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadServiceAreas();
    }
  }, [open]);

  const loadServiceAreas = async () => {
    try {
      setAreasLoading(true);
      const areasData = await fetchServiceAreas();
      setAreas(areasData);
    } catch (error) {
      console.error('Error loading service areas:', error);
      toast.error('Falha ao carregar áreas de serviço');
    } finally {
      setAreasLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setAreaId('');
    setAssignedTo('');
    setDueDate(undefined);
  };

  return {
    title, setTitle,
    description, setDescription,
    status, setStatus,
    areaId, setAreaId,
    assignedTo, setAssignedTo,
    dueDate, setDueDate,
    areas, setAreas,
    loading, setLoading,
    areasLoading,
    resetForm
  };
}
