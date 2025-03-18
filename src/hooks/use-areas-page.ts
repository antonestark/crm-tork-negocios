
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/use-auth-state";
import { useServiceAreasData, ServiceArea } from "@/hooks/use-service-areas-data";
import { AreaSubmitData } from "@/components/services/areas/hooks/useAreaForm";

const DEFAULT_AREA_TYPES = [
  { name: 'Áreas Comuns', code: 'common' },
  { name: 'Banheiros', code: 'bathroom' },
  { name: 'Salas Privativas', code: 'private' },
  { name: 'Áreas Externas', code: 'external' },
  { name: 'Ar Condicionado', code: 'ac' }
];

export const useAreasPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const { areas, loading, error, refresh } = useServiceAreasData();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  
  useEffect(() => {
    setUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);
  
  useEffect(() => {
    // Ensure area_types table exists with initial data
    setupAreaTypes();
  }, []);

  const setupAreaTypes = async () => {
    try {
      // Check if area_types table exists
      const { error: checkError } = await supabase
        .from('area_types')
        .select('id', { count: 'exact', head: true });
      
      // If we get an error like "relation area_types does not exist", create the table
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('Creating area_types table...');
        console.warn('area_types table does not exist. This would need server-side handling.');
        return;
      }
      
      // Check if we need to seed default values
      const { data: existingTypes, error: countError } = await supabase
        .from('area_types')
        .select('id, name, code');
        
      if (countError) throw countError;
      
      // If no types exist, seed with defaults
      if (!existingTypes || existingTypes.length === 0) {
        console.log('Seeding default area types...');
        const { error: insertError } = await supabase
          .from('area_types')
          .insert(DEFAULT_AREA_TYPES);
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error setting up area types:', error);
    }
  };

  const createServiceArea = async (areaData: AreaSubmitData) => {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .insert([{
          name: areaData.name,
          description: areaData.description,
          status: areaData.status,
          type: areaData.type
        }]);
        
      if (error) throw error;
      
      // Refresh the areas list
      refresh();
      
      return data;
    } catch (error) {
      console.error('Error creating service area:', error);
      throw error;
    }
  };
  
  const handleCreateArea = async (areaData: AreaSubmitData) => {
    try {
      if (!isAuthenticated) {
        toast.error("Você precisa estar autenticado para criar uma área.");
        return;
      }
      
      setIsSubmitting(true);
      console.log("Creating area with data:", areaData);
      await createServiceArea(areaData);
      toast.success("Área criada com sucesso");
    } catch (err) {
      console.error("Erro ao criar área:", err);
      
      // More specific error handling
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Check if the error is related to authentication
        if (errorMessage.includes("auth") || 
            errorMessage.includes("permission") || 
            errorMessage.includes("session") || 
            errorMessage.includes("token") ||
            errorMessage.includes("JWT")) {
          toast.error("Erro de autenticação. Por favor, faça login novamente.", {
            duration: 5000,
          });
          // Should redirect to login page here
        } else {
          toast.error(`Falha ao criar área: ${errorMessage}`, {
            duration: 5000,
          });
        }
      } else {
        toast.error("Falha ao criar área");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isAuthenticated,
    authLoading,
    areas,
    loading,
    error,
    refresh,
    userAuthenticated,
    handleCreateArea
  };
};
