
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
  try {
    console.log("Adding demand to DB:", demandData);
    
    const formattedDueDate = formatDueDate(demandData.due_date);
    console.log("Formatted due date:", formattedDueDate);
    
    const formattedData = {
      ...demandData,
      due_date: formattedDueDate
    };
    
    const { error } = await supabase
      .from('demands')
      .insert([formattedData])
      .select();
    
    if (error) {
      console.error("Supabase error adding demand:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addDemandToDB:", error);
    throw error;
  }
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

const formatDueDate = (dueDate: string | Date | null | undefined): string | null => {
  if (!dueDate) return null;
  
  try {
    if (typeof dueDate === 'object' && dueDate instanceof Date) {
      // Format Date object to ISO string
      return dueDate.toISOString();
    }
    
    // If it's already a string, return it
    return dueDate as string;
  } catch (error) {
    console.error("Error formatting due date:", error);
    return null;
  }
};
