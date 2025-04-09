import { BaseLayout } from "@/components/layout/BaseLayout"; // Import BaseLayout
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
    // Ensure area is an object, handle potential null/undefined from hook if necessary
    area: demand.area ? { name: demand.area } : { name: 'N/A' }, 
    assigned_user: demand.assigned_to ? { name: demand.assigned_user_name || 'N/A' } : null,
    requester: demand.requested_by ? { name: demand.requester_name || 'N/A' } : null
  }));
};


const DemandsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { demands: hookDemands, loading, addDemand, fetchDemands } = useDemands();
  
  // Convert the demands to the right type for the component
  const demands = convertDemands(hookDemands || []); // Ensure hookDemands is an array
  
  const { 
    formOpen, 
    openDemandForm, 
    handleFormClose 
  } = useDemandForm({ 
    fetchDemands, 
    statusFilter, 
    addDemand 
  });
  
  console.log("Form open state in DemandsPage:", formOpen);
  
  const resetFilter = () => {
    setStatusFilter(null);
    fetchDemands();
  };

  const applyFilter = (status: string) => {
    setStatusFilter(status);
    fetchDemands(status);
  };

  return (
    // Use BaseLayout
    <BaseLayout> 
      {/* Removed outer div and Header */}
      {/* Removed container, mx-auto, py-6, px-4 from main */}
      <main className="py-6"> 
        <div className="px-4"> {/* Added padding to inner elements */}
          <ServicesNav />
        </div>
        
        <div className="px-4 mt-6"> {/* Added padding and margin */}
          <DemandsHeader 
            openDemandForm={openDemandForm}
            resetFilter={resetFilter}
            applyFilter={applyFilter}
          />
        </div>
        
        <div className="px-4 mt-6"> {/* Added padding and margin */}
          <Card className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden"> {/* Apply consistent card style */}
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
        </div>
        
        {/* Keep Dialog logic, trigger is now in DemandsHeader */}
        <DemandFormDialog 
          open={formOpen}
          onOpenChange={handleFormClose}
          onSubmit={addDemand}
          demand={null} // Assuming this dialog is only for creating new demands from here
        />
      </main>
    </BaseLayout>
  );
};

export default DemandsPage;
