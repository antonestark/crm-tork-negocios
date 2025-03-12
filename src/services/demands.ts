
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Demand, DemandCreate } from '@/types/demands';

export const fetchDemandsFromDB = async (statusFilter?: string | null) => {
  let query = supabase
    .from("demands")
    .select(`
      *,
      area:service_areas(name),
      assigned_user:users!assigned_to(name),
      requester:users!requested_by(name)
    `)
    .order("updated_at", { ascending: false });
  
  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data?.map(item => ({
    ...item,
    area: item.area,
    assigned_user: item.assigned_user,
    requester: item.requester
  })) || [];
};

export const addDemandToDB = async (demandData: DemandCreate): Promise<boolean> => {
  const formattedDueDate = formatDueDate(demandData.due_date);
  
  const formattedData = {
    ...demandData,
    due_date: formattedDueDate
  };
  
  const { error } = await supabase
    .from('demands')
    .insert([formattedData])
    .select();
  
  if (error) throw error;
  return true;
};

export const updateDemandInDB = async (demandData: DemandCreate): Promise<boolean> => {
  if (!demandData.id) {
    throw new Error('Demand ID is required for update');
  }

  const { id, ...updateData } = demandData;
  const formattedDueDate = formatDueDate(updateData.due_date);
  
  const formattedData = {
    ...updateData,
    due_date: formattedDueDate
  };
  
  const { error } = await supabase
    .from('demands')
    .update(formattedData)
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const deleteDemandFromDB = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('demands')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

const formatDueDate = (dueDate: string | Date | null | undefined): string | undefined => {
  if (!dueDate) return undefined;
  
  if (typeof dueDate === 'object' && dueDate !== null) {
    return dueDate.toISOString();
  }
  return dueDate as string;
};
