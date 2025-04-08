
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/use-auth-state';

export type ChecklistItem = {
  id: string;
  name: string;
  description?: string;
  period?: string;
  area_id?: string;
  area_name?: string;
  responsible?: string;
  responsible_id?: string;
  department_id?: number;
  active: boolean;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  completed?: boolean;
  completed_at?: string;
  completed_by?: string;
};

export const useServiceChecklist = (period?: string, onlyResponsible: boolean = false) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userId } = useAuthState();

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
  }, [period, onlyResponsible, userId]);

  const fetchChecklistItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("checklist_items")
        .select(`
          *,
          service_areas(id, name)
        `)
        .eq("active", true)
        .order("name", { ascending: true });
      
      // Filter by period if provided
      if (period) {
        query = query.eq("period", period);
      }
      
      // Filter by user responsibility if required
      if (onlyResponsible && userId) {
        query = query.eq("responsible_id", userId);
      }
      
      const { data: itemsData, error: itemsError } = await query;
      
      if (itemsError) throw itemsError;
      
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
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          period: item.period || '',
          area_id: item.area_id,
          area_name: item.service_areas?.name,
          responsible: item.responsible,
          responsible_id: item.responsible_id,
          department_id: item.department_id,
          active: !!item.active,
          status: item.status || 'pending',
          start_date: item.start_date,
          end_date: item.end_date,
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

  const toggleItemStart = async (itemId: string, started: boolean) => {
    try {
      const now = new Date().toISOString();
      const newStatus = started ? 'in_progress' : 'pending';
      
      // Update the item status
      const { error: updateError } = await supabase
        .from("checklist_items")
        .update({
          status: newStatus,
          start_date: started ? now : null
        })
        .eq("id", itemId);
      
      if (updateError) throw updateError;

      // Record the status change
      const { error: statusInsertError } = await supabase
        .from("checklist_item_status")
        .insert({
          checklist_item_id: itemId,
          user_id: userId,
          status: newStatus
        });
        
      if (statusInsertError) {
        console.error("Error recording status change:", statusInsertError);
      }
      
      toast.success(started ? "Tarefa iniciada" : "Tarefa revertida para pendente");
      fetchChecklistItems();
      return true;
    } catch (err) {
      console.error("Error toggling item start:", err);
      toast.error("Falha ao atualizar status da tarefa");
      return false;
    }
  };

  const toggleItemCompletion = async (itemId: string, completed: boolean) => {
    try {
      const now = new Date().toISOString();
      const newStatus = completed ? 'completed' : 'in_progress';
      
      // Update the item status
      const { error: updateError } = await supabase
        .from("checklist_items")
        .update({
          status: newStatus,
          end_date: completed ? now : null
        })
        .eq("id", itemId);
      
      if (updateError) throw updateError;
      
      // Record the status change
      const { error: statusInsertError } = await supabase
        .from("checklist_item_status")
        .insert({
          checklist_item_id: itemId,
          user_id: userId,
          status: newStatus
        });
        
      if (statusInsertError) {
        console.error("Error recording status change:", statusInsertError);
      }
      
      // For backward compatibility, also update the completions table
      if (completed) {
        // Mark as completed
        const { error } = await supabase
          .from("checklist_completions")
          .insert([{
            checklist_item_id: itemId,
            completed_by: userId, 
            completed_at: now
          }]);
        
        if (error) throw error;
      } else {
        // Remove completion for today
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from("checklist_completions")
          .delete()
          .eq("checklist_item_id", itemId)
          .gte("completed_at", `${today}T00:00:00`)
          .lte("completed_at", `${today}T23:59:59`);
        
        if (error) throw error;
      }
      
      toast.success(completed ? "Tarefa concluída" : "Tarefa marcada como em andamento");
      fetchChecklistItems();
      return true;
    } catch (err) {
      console.error("Error toggling item completion:", err);
      toast.error("Falha ao atualizar status da tarefa");
      return false;
    }
  };

  const addChecklistItem = async (item: {
    name: string;
    description?: string;
    period?: string;
    area_id?: string;
    responsible?: string;
    responsible_id?: string;
    department_id?: number;
  }) => {
    try {
      const { error } = await supabase.from('checklist_items').insert([
        {
          name: item.name,
          description: item.description,
          period: item.period,
          area_id: item.area_id,
          responsible: item.responsible,
          responsible_id: item.responsible_id,
          department_id: item.department_id,
          status: 'pending',
          active: true
        }
      ]);
      if (error) throw error;
      toast.success('Item adicionado com sucesso');
      fetchChecklistItems();
      return true;
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      toast.error('Falha ao adicionar item');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchChecklistItems,
    toggleItemStart,
    toggleItemCompletion,
    addChecklistItem
  };
};
