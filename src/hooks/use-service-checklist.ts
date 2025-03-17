
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ChecklistItem = {
  id: string;
  name: string;
  description?: string;
  period: string;
  area_id?: string;
  area_name?: string;
  active: boolean;
  completed?: boolean;
  completed_at?: string;
  completed_by?: string;
};

export const useServiceChecklist = (period?: string) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChecklistItems();
    
    // Set up a realtime subscription for checklist updates
    const subscription = supabase
      .channel('checklist_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'checklist_items' 
      }, () => {
        fetchChecklistItems();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'checklist_completions' 
      }, () => {
        fetchChecklistItems();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [period]);

  const fetchChecklistItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("checklist_items")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });
      
      // Filter by period if provided
      if (period) {
        query = query.eq("period", period);
      }
      
      const { data: itemsData, error: itemsError } = await query;
      
      if (itemsError) throw itemsError;
      
      // Get area information
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select("id, name");
      
      if (areasError) throw areasError;
      
      // Get completed items for today
      const today = new Date().toISOString().split('T')[0];
      const { data: completedData, error: completedError } = await supabase
        .from("checklist_completions")
        .select("*")
        .gte("completed_at", `${today}T00:00:00`)
        .lte("completed_at", `${today}T23:59:59`);
      
      if (completedError) throw completedError;
      
      // Map completed status to items
      const processedItems: ChecklistItem[] = itemsData.map(item => {
        const completedItem = completedData?.find(c => c.checklist_item_id === item.id);
        const area = areasData?.find(a => a.id === item.area_id);
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          period: item.period || '',
          area_id: item.area_id,
          area_name: area?.name,
          active: !!item.active,
          completed: !!completedItem,
          completed_at: completedItem?.completed_at,
          completed_by: completedItem?.completed_by
        };
      });
      
      setItems(processedItems);
    } catch (err) {
      console.error("Error fetching checklist items:", err);
      setError(err as Error);
      toast.error("Erro ao carregar itens do checklist");
    } finally {
      setLoading(false);
    }
  };

  const toggleItemCompletion = async (itemId: string, completed: boolean) => {
    try {
      if (completed) {
        // Mark as completed
        const { error } = await supabase
          .from("checklist_completions")
          .insert([{
            checklist_item_id: itemId,
            completed_by: null, // Use auth.uid() if authenticated
            completed_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      } else {
        // Remove completion
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from("checklist_completions")
          .delete()
          .eq("checklist_item_id", itemId)
          .gte("completed_at", `${today}T00:00:00`)
          .lte("completed_at", `${today}T23:59:59`);
        
        if (error) throw error;
      }
      
      toast.success(completed ? "Item marcado como concluído" : "Marcação removida");
      fetchChecklistItems();
      return true;
    } catch (err) {
      console.error("Error toggling item completion:", err);
      toast.error("Falha ao atualizar item");
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchChecklistItems,
    toggleItemCompletion
  };
};
