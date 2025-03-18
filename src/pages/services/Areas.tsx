import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { ServicesNav } from "@/components/services/ServicesNav";
import { toast } from "sonner";
import { CreateAreaDialog } from "@/components/services/areas/CreateAreaDialog";
import { useServiceAreasData, ServiceArea } from "@/hooks/use-service-areas-data";
import { useAuthState } from "@/hooks/use-auth-state";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AreaSubmitData } from "@/components/services/areas/hooks/useAreaForm";

const DEFAULT_AREA_TYPES = [
  { name: 'Áreas Comuns', code: 'common' },
  { name: 'Banheiros', code: 'bathroom' },
  { name: 'Salas Privativas', code: 'private' },
  { name: 'Áreas Externas', code: 'external' },
  { name: 'Ar Condicionado', code: 'ac' }
];

const AreasPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const { areas, loading, error, refresh } = useServiceAreasData();
  
  // Add local isAuthenticated state
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  
  useEffect(() => {
    setUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);
  
  useEffect(() => {
    // Ensure area_types table exists with initial data
    setupAreaTypes();
    
    // Redirect to login page if not authenticated after auth check completes
    if (!authLoading && !isAuthenticated) {
      toast.error("Você precisa estar autenticado para acessar esta página.");
      // You would typically navigate to a login page here
      // navigate("/login");
      
      // For now, we'll just show an error in the UI
      console.warn("User not authenticated, should redirect to login");
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const setupAreaTypes = async () => {
    try {
      // Check if area_types table exists
      const { error: checkError } = await supabase
        .from('area_types')
        .select('id', { count: 'exact', head: true });
      
      // If we get an error like "relation area_types does not exist", create the table
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('Creating area_types table...');
        
        // Create the table via RPC (assuming you have a SQL function for this)
        // For this example, we'll use a simplified approach and assume the table exists
        // In a real app, you'd need to handle this server-side or via migration
        
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

  // Show authentication warning if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <ServicesNav />
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-600 h-6 w-6" />
              <h2 className="text-xl font-bold text-yellow-700">Autenticação Necessária</h2>
            </div>
            <p className="mb-4 text-yellow-700">
              Você precisa estar autenticado para acessar e gerenciar áreas de serviço.
            </p>
            <Button 
              // You would set this to your login page
              onClick={() => console.log("Should navigate to login page")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Fazer Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Áreas de Controle</h2>
          <CreateAreaDialog 
            onCreateArea={handleCreateArea}
            isSubmitting={isSubmitting} 
            isAuthenticated={userAuthenticated}
          />
        </div>

        <ServiceAreas 
          areas={areas} 
          loading={loading || authLoading} 
          error={error} 
          onAreaUpdated={refresh}
        />
      </main>
    </div>
  );
};

export default AreasPage;
