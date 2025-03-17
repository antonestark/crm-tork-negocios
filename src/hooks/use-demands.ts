
import { useState } from 'react';
import { toast } from 'sonner';
import { Demand, DemandCreate } from '@/types/demands';
import { 
  fetchDemandsFromDB, 
  addDemandToDB, 
  updateDemandInDB, 
  deleteDemandFromDB 
} from '@/services/demands';
import { useDemandsSubscription } from './use-demands-subscription';

export const useDemands = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDemands = async (statusFilter?: string | null) => {
    try {
      setLoading(true);
      const formattedDemands = await fetchDemandsFromDB(statusFilter);
      
      // Handle the data safely to ensure we're setting properly typed data
      const typedDemands: Demand[] = formattedDemands.map(d => {
        // Safely extract nested properties with fallbacks
        const areaName = d.area && typeof d.area === 'object' ? d.area.name || '' : '';
        
        // Handle assigned_user safely with proper null checking
        let assignedUserName = '';
        if (d.assigned_user !== null && d.assigned_user !== undefined) {
          if (typeof d.assigned_user === 'object' && d.assigned_user !== null) {
            // Use optional chaining with nullish coalescing to handle possible null
            assignedUserName = d.assigned_user?.name ?? '';
          }
        }
        
        // Handle requester safely with proper null checking
        let requesterName = '';
        if (d.requester !== null && d.requester !== undefined) {
          if (typeof d.requester === 'object' && d.requester !== null) {
            // Use optional chaining with nullish coalescing to handle possible null
            requesterName = d.requester?.name ?? '';
          }
        }
        
        return {
          id: d.id,
          title: d.title,
          description: d.description,
          area_id: d.area_id,
          priority: d.priority,
          assigned_to: d.assigned_to,
          requested_by: d.requested_by,
          due_date: d.due_date,
          status: d.status,
          created_at: d.created_at,
          updated_at: d.updated_at,
          area: { name: areaName },
          assigned_user: { name: assignedUserName },
          requester: { name: requesterName }
        };
      });
      
      setDemands(typedDemands);
    } catch (err) {
      console.error('Error fetching demands:', err);
      setError(err as Error);
      toast.error("Falha ao carregar demandas");
    } finally {
      setLoading(false);
    }
  };

  const addDemand = async (demandData: DemandCreate): Promise<boolean> => {
    try {
      await addDemandToDB(demandData);
      toast.success('Demanda criada com sucesso');
      await fetchDemands();
      return true;
    } catch (err) {
      console.error('Error adding demand:', err);
      toast.error('Falha ao criar demanda');
      return false;
    }
  };

  const updateDemand = async (demandData: DemandCreate): Promise<boolean> => {
    try {
      await updateDemandInDB(demandData);
      toast.success('Demanda atualizada com sucesso');
      await fetchDemands();
      return true;
    } catch (err) {
      console.error('Error updating demand:', err);
      toast.error('Falha ao atualizar demanda');
      return false;
    }
  };

  const deleteDemand = async (id: string): Promise<boolean> => {
    try {
      await deleteDemandFromDB(id);
      setDemands(prev => prev.filter(d => d.id !== id));
      toast.success('Demanda excluída com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting demand:', err);
      toast.error('Falha ao excluir demanda');
      return false;
    }
  };

  // Set up real-time subscription
  useDemandsSubscription(fetchDemands);

  return {
    demands,
    loading,
    error,
    fetchDemands,
    addDemand,
    updateDemand,
    deleteDemand
  };
};
