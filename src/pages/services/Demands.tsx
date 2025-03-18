import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState } from "react";
import { DemandFormDialog } from "@/components/services/demand-form";
import { useDemands, Demand as HookDemand } from "@/hooks/use-demands";
import { DemandsList } from "@/components/services/demands/DemandsList";
import { DemandsHeader } from "@/components/services/demands/DemandsHeader";
import { useDemandForm } from "@/components/services/demands/useDemandForm";
import { Demand as TypeDemand } from "@/types/demands";

// Create a utility function to convert between demand types
const convertDemands = (demands: HookDemand[]): TypeDemand[] => {
  return demands.map(demand => ({
    id: demand.id,
    title: demand.title,
    description: demand.description,
    area_id: demand.area_id,
    priority: demand.priority,
    assigned_to: demand.assigned_to,
    requested_by: demand.requested_by,
    due_date: demand.due_date,
    status: demand.status,
    created_at: demand.created_at,
    updated_at: demand.updated_at,
    area: { name: demand.area },
    assigned_user: demand.assigned_to ? { name: demand.assigned_user_name } : null,
    requester: demand.requested_by ? { name: demand.requester_name } : null
  }));
};

const DemandsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { demands: hookDemands, loading, addDemand, fetchDemands } = useDemands();
  
  // Convert the demands to the right type for the component
  const demands = convertDemands(hookDemands);
  
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
