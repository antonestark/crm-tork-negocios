
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

const AreasPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  
  const { 
    areas, 
    loading, 
    error, 
    createServiceArea,
    isAuthenticated: areasAuthenticated
  } = useServiceAreasData();
  
  useEffect(() => {
    // Redirect to login page if not authenticated after auth check completes
    if (!authLoading && !isAuthenticated) {
      toast.error("Você precisa estar autenticado para acessar esta página.");
      // You would typically navigate to a login page here
      // navigate("/login");
      
      // For now, we'll just show an error in the UI
      console.warn("User not authenticated, should redirect to login");
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const handleCreateArea = async (areaData: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
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
            isAuthenticated={isAuthenticated}
          />
        </div>

        <ServiceAreas areas={areas} loading={loading || authLoading} error={error} />
      </main>
    </div>
  );
};

export default AreasPage;
