
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState } from "react";
import { DemandFormDialog } from "@/components/services/demand-form";
import { useDemands } from "@/hooks/use-demands";
import { DemandsList } from "@/components/services/demands/DemandsList";
import { DemandsHeader } from "@/components/services/demands/DemandsHeader";
import { useDemandForm } from "@/components/services/demands/useDemandForm";

const DemandsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { demands, loading, addDemand, fetchDemands } = useDemands();
  
  const { 
    formOpen, 
    openDemandForm, 
    handleFormClose 
  } = useDemandForm({ 
    fetchDemands, 
    statusFilter, 
    addDemand 
  });
  
  const resetFilter = () => {
    setStatusFilter(null);
    fetchDemands();
  };

  const applyFilter = (status: string) => {
    setStatusFilter(status);
    fetchDemands(status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        
        <DemandsHeader 
          openDemandForm={openDemandForm}
          resetFilter={resetFilter}
          applyFilter={applyFilter}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Demandas</CardTitle>
          </CardHeader>
          <CardContent>
            <DemandsList 
              demands={demands} 
              loading={loading} 
            />
          </CardContent>
        </Card>
        
        <DemandFormDialog 
          open={formOpen}
          onOpenChange={handleFormClose}
          onSubmit={addDemand}
          demand={null}
        />
      </main>
    </div>
  );
};

export default DemandsPage;
