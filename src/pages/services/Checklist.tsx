import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ServicesNav } from "@/components/services/ServicesNav";
import { ChecklistItems } from "@/components/services/ChecklistItems";
import { Button } from '@/components/ui/button'; // Import Button
import { Plus } from 'lucide-react'; // Import Plus icon
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components
import { DemandFormDialog } from "@/components/services/demand-form"; // Assuming we adapt this
import { useDemands } from "@/hooks/use-demands"; // To add demand
import { useServiceAreasData, ServiceArea } from "@/hooks/use-service-areas-data"; // To find area ID
import { DemandCreate } from '@/types/demands'; // Import DemandCreate type

const ChecklistPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addDemand } = useDemands();
  const { areas: serviceAreas, loading: areasLoading } = useServiceAreasData();
  const [servicoGeralAreaId, setServicoGeralAreaId] = useState<string | undefined>(undefined);

  // Find the ID for "Serviço Geral" area once areas are loaded
  useEffect(() => {
    if (serviceAreas.length > 0) {
      const geralArea = serviceAreas.find(area => area.name.toLowerCase() === 'serviço geral' || area.name.toLowerCase() === 'servico geral');
      if (geralArea) {
        setServicoGeralAreaId(geralArea.id);
      } else {
        console.warn("Área 'Serviço Geral' não encontrada.");
        // Handle case where area doesn't exist? Disable button? Allow selection?
      }
    }
  }, [serviceAreas]);

  // Correct the type and return value for onSubmit prop
  const handleFormSubmit = async (values: DemandCreate): Promise<boolean> => { 
    // Adapt values if needed and add area_id for Serviço Geral
    const demandData: DemandCreate = { // Ensure type safety
      ...values,
      area_id: servicoGeralAreaId,
      // Set default status or other fields if necessary
      status: values.status || 'open', 
      // title: values.title || `Tarefa Serviço Geral - ${new Date().toLocaleDateString()}` 
    };
    const success = await addDemand(demandData); // Capture the boolean result
    if (success) {
      setIsModalOpen(false); // Close modal only on success
    }
    return success; // Return the boolean result
  };

  return (
    <BaseLayout>
      {/* Removed px-4, max-w-7xl, mx-auto */}
      <div className="py-6"> 
        <div className="animate-fade-in px-4"> {/* Added px-4 */}
          <ServicesNav />
        </div>
        
        <div className="flex items-center justify-between mb-6 animate-fade-in delay-100 px-4"> {/* Added px-4 */}
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Checklist Diário
          </h2>
          {/* Add Button to create Service Task/Demand for Serviço Geral */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={!servicoGeralAreaId && !areasLoading} // Disable if area not found (and not loading)
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Tarefa (Serv. Geral)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Nova Tarefa - Serviço Geral</DialogTitle>
                <DialogDescription>
                  Adicione os detalhes da tarefa para o departamento de Serviço Geral.
                </DialogDescription>
              </DialogHeader>
              {/* Use/Adapt DemandFormDialog or create a new form */}
              {/* Need to pass onSubmit and potentially initialValues with area_id */}
              <DemandFormDialog 
                 open={isModalOpen} // Pass state
                 onOpenChange={setIsModalOpen} // Pass state setter
                 onSubmit={handleFormSubmit} 
                 demand={null} // For creating new
                 // Pass areaId to pre-select or hide field?
                 // initialValues={{ area_id: servicoGeralAreaId }} 
              />
              {/* Placeholder - Replace with actual form */}
              {/* <div>Formulário de Tarefa aqui... (Área pré-selecionada: Serviço Geral)</div> */}
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg p-6 animate-fade-in delay-200 mx-4"> {/* Added mx-4 */}
          <Tabs defaultValue="morning">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/70 p-1 border border-blue-900/40 rounded-lg overflow-hidden">
              <TabsTrigger 
                value="morning"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Manhã</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="afternoon"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Tarde</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="evening"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Noite</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems period="morning" />
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems period="afternoon" />
              </div>
            </TabsContent>
            <TabsContent value="evening">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems period="evening" />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ChecklistPage;
