
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { ServicesNav } from "@/components/services/ServicesNav";
import { toast } from "sonner";
import { CreateAreaDialog } from "@/components/services/areas/CreateAreaDialog";
import { useServiceAreasData } from "@/hooks/use-service-areas-data";

const AreasPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    areas, 
    loading, 
    error, 
    createServiceArea 
  } = useServiceAreasData();
  
  const handleCreateArea = async (areaData: Parameters<typeof createServiceArea>[0]) => {
    try {
      setIsSubmitting(true);
      await createServiceArea(areaData);
      toast.success("Área criada com sucesso");
    } catch (err) {
      console.error("Erro ao criar área:", err);
      
      // Check if the error is related to authentication
      if (err instanceof Error && 
         (err.message.includes("auth") || 
          err.message.includes("permission") || 
          err.message.includes("session"))) {
        toast.error("Erro de autenticação. Por favor, verifique se você está logado.");
      } else {
        toast.error("Falha ao criar área");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          />
        </div>

        <ServiceAreas areas={areas} loading={loading} error={error} />
      </main>
    </div>
  );
};

export default AreasPage;
