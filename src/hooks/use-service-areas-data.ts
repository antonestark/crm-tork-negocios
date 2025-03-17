
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './use-auth-state';

export type ServiceArea = {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  responsible_id?: string;
  task_count: number;
  pending_tasks: number;
  delayed_tasks: number;
};

export const useServiceAreasData = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, sessionExpired, refreshSession } = useAuthState();

  const fetchServiceAreas = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        console.warn("Not authenticated, skipping fetch");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      // Check session validity before making the request
      if (sessionExpired) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
        }
      }
      
      console.log("Fetching service areas...");
      
      // First fetch service areas
      const { data: areasData, error: areasError } = await supabase
        .from("service_areas")
        .select("*")
        .order("name", { ascending: true });
      
      if (areasError) {
        console.error("Supabase error:", areasError);
        
        if (areasError.code === '42501' || areasError.message.includes("permission") || areasError.message.includes("JWTClaimsSetVerificationException")) {
          throw new Error("Permissão negada. Sua sessão pode ter expirado.");
        }
        
        throw areasError;
      }

      // Use RPC for getting service stats to avoid typings issues
      const { data: serviceStatsByArea, error: statsError } = await supabase
        .rpc('get_service_stats_by_area');
      
      if (statsError) {
        console.error("Error fetching service stats:", statsError);
        // Continue with the areas data even if stats data fails
      }
      
      // Process the data to include task counts
      const processedAreas: ServiceArea[] = (areasData || []).map(area => {
        // Get service stats for this area
        const areaStats = serviceStatsByArea && Array.isArray(serviceStatsByArea) 
          ? serviceStatsByArea.find((s: any) => s?.area_id === area.id) 
          : null;
        
        return {
          id: area.id,
          name: area.name,
          type: area.type || 'common',
          description: area.description,
          status: area.status || 'active',
          responsible_id: area.responsible_id,
          task_count: areaStats?.total_tasks || 0,
          pending_tasks: areaStats?.pending_tasks || 0,
          delayed_tasks: areaStats?.delayed_tasks || 0
        };
      });
      
      setAreas(processedAreas);
    } catch (err) {
      console.error("Error fetching service areas:", err);
      setError(err as Error);
      
      // Handle specific error messages
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      
      if (errorMessage.includes("session")) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      } else if (errorMessage.includes("permission") || errorMessage.includes("denied")) {
        toast.error("Você não tem permissão para acessar estas informações.");
      } else {
        toast.error(`Erro ao carregar áreas de serviço: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sessionExpired, refreshSession]);

  useEffect(() => {
    fetchServiceAreas();
    
    // Set up a realtime subscription for area updates
    const subscription = supabase
      .channel('service_areas_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_areas' 
      }, () => {
        fetchServiceAreas();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchServiceAreas]);

  const createServiceArea = async (areaData: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error("Você precisa estar autenticado para criar uma área.");
      }

      // Check session validity before making the request
      if (sessionExpired) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
        }
      }
      
      console.log("Creating service area:", areaData);
      
      // Ensure we're using the authenticated client
      const { data, error } = await supabase
        .from("service_areas")
        .insert([{
          name: areaData.name,
          type: areaData.type,
          description: areaData.description,
          status: areaData.status,
          responsible_id: areaData.responsible_id
        }])
        .select();
      
      if (error) {
        console.error("Error creating area:", error);
        
        if (error.code === '42501') {
          throw new Error("Permissão negada. Verifique sua autenticação.");
        } else if (error.code === 'PGRST301') {
          throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
        } else if (error.message.includes("JWTClaimsSetVerificationException")) {
          throw new Error("Token inválido. Por favor, faça login novamente.");
        }
        
        throw error;
      }
      
      console.log("Area created successfully:", data);
      await fetchServiceAreas(); // Refresh the list after creating
      return data[0];
    } catch (err) {
      console.error("Error in createServiceArea:", err);
      
      if (err instanceof Error) {
        // Check if it's an authentication error
        if (err.message.includes("auth") || 
            err.message.includes("permission") || 
            err.message.includes("session") ||
            err.message.includes("token") ||
            err.message.includes("JWT")) {
          throw new Error("Erro de autenticação. Por favor, verifique se você está logado.");
        }
        throw err;
      } else {
        throw new Error("Falha ao criar área de serviço");
      }
    }
  };

  const updateServiceArea = async (id: string, areaData: Partial<ServiceArea>) => {
    try {
      if (!isAuthenticated) {
        throw new Error("Você precisa estar autenticado para atualizar uma área.");
      }

      // Check session validity before making the request
      if (sessionExpired) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
        }
      }

      const { error } = await supabase
        .from("service_areas")
        .update({
          name: areaData.name,
          type: areaData.type,
          description: areaData.description,
          status: areaData.status,
          responsible_id: areaData.responsible_id
        })
        .eq("id", id);
      
      if (error) {
        console.error("Error details:", error);
        if (error.code === '42501') {
          toast.error("Permissão negada. Sua sessão pode ter expirado.");
          return false;
        }
        throw error;
      }
      
      toast.success("Área de serviço atualizada com sucesso");
      fetchServiceAreas();
      return true;
    } catch (err) {
      console.error("Error updating service area:", err);
      
      if (err instanceof Error) {
        toast.error(`Falha ao atualizar área: ${err.message}`);
      } else {
        toast.error("Falha ao atualizar área de serviço");
      }
      return false;
    }
  };

  return {
    areas,
    loading,
    error,
    fetchServiceAreas,
    createServiceArea,
    updateServiceArea,
    isAuthenticated
  };
};
