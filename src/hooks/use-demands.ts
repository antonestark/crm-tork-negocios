
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
      setDemands(formattedDemands);
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
