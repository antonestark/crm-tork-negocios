
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AreaType, NewAreaType } from "./types";

export const useAreaTypes = () => {
  const [areaTypes, setAreaTypes] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAreaTypes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('area_types')
        .select('id, name, code')
        .order('name');

      if (error) throw error;
      
      // Use a proper type assertion
      const typedData = data as unknown as AreaType[];
      setAreaTypes(typedData || []);
    } catch (error) {
      console.error('Error fetching area types:', error);
      toast.error('Erro ao carregar tipos de áreas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = async (newType: NewAreaType) => {
    if (!newType.name.trim() || !newType.code.trim()) {
      toast.error('Nome e código são obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('area_types')
        .insert([{ name: newType.name, code: newType.code }])
        .select();

      if (error) throw error;
      
      toast.success('Tipo de área adicionado com sucesso');
      fetchAreaTypes();
    } catch (error) {
      console.error('Error adding area type:', error);
      toast.error('Erro ao adicionar tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateType = async (id: string, data: Partial<AreaType>) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('area_types')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tipo de área atualizado com sucesso');
      setEditingId(null);
      fetchAreaTypes();
    } catch (error) {
      console.error('Error updating area type:', error);
      toast.error('Erro ao atualizar tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      // First check if the area type is in use
      const { count, error: countError } = await supabase
        .from('service_areas')
        .select('id', { count: 'exact', head: true })
        .eq('type', id);

      if (countError) throw countError;
      
      if (count && count > 0) {
        toast.error('Este tipo está sendo usado em áreas existentes e não pode ser excluído');
        return;
      }
      
      const { error } = await supabase
        .from('area_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tipo de área excluído com sucesso');
      fetchAreaTypes();
    } catch (error) {
      console.error('Error deleting area type:', error);
      toast.error('Erro ao excluir tipo de área');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAreaTypes();
  }, []);

  return {
    areaTypes,
    loading,
    isSubmitting,
    editingId,
    setEditingId,
    handleAddType,
    handleUpdateType,
    handleDeleteType
  };
};
