import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { MaintenanceHeader } from "@/components/services/maintenance/MaintenanceHeader";
import { MaintenanceMetrics } from "@/components/services/maintenance/MaintenanceMetrics";
import { MaintenanceList } from "@/components/services/maintenance/MaintenanceList";
import { MaintenanceForm } from "@/components/services/maintenance/MaintenanceForm";
import { fetchMaintenances, fetchAreas, createMaintenance } from "@/services/maintenance";
import { useServiceAreasData } from "@/hooks/use-service-areas-data";

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  
  // Use the hook to get service areas data
  const { areas: serviceAreas, loading: areasLoading } = useServiceAreasData();
  
  useEffect(() => {
    loadMaintenanceData();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'maintenance_records' 
      }, () => {
        loadMaintenanceData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // When the dialog opens, load the areas if they haven't been loaded yet
  useEffect(() => {
    if (open) {
      loadServiceAreas();
    }
  }, [open]);
  
  // When serviceAreas from hook changes, update local areas state
  useEffect(() => {
    if (serviceAreas.length > 0) {
      setAreas(serviceAreas);
    }
  }, [serviceAreas]);

  const loadMaintenanceData = async () => {
    setLoading(true);
    try {
      const maintenanceData = await fetchMaintenances();
      setMaintenances(maintenanceData);
    } catch (error) {
      console.error("Error loading maintenance data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadServiceAreas = async () => {
    try {
      console.log("Loading service areas for maintenance form...");
      
      // If we already have areas from the hook, use those
      if (serviceAreas.length > 0) {
        console.log("Using service areas from hook:", serviceAreas);
        setAreas(serviceAreas);
        return;
      }
      
      // Otherwise fetch from the API
      const areasData = await fetchAreas();
      console.log("Areas loaded for maintenance form:", areasData);
      setAreas(areasData);
    } catch (error) {
      console.error("Error loading service areas:", error);
    }
  };

  const handleFormSubmit = async (maintenanceData: any) => {
    await createMaintenance(maintenanceData);
    setOpen(false);
    loadMaintenanceData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        
        <MaintenanceHeader openDialog={() => setOpen(true)} />
        
        <MaintenanceMetrics maintenances={maintenances} />
        
        <Card>
          <CardHeader>
            <CardTitle>Próximas Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceList maintenances={maintenances} loading={loading} />
          </CardContent>
        </Card>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Nova Manutenção</DialogTitle>
            </DialogHeader>
            <MaintenanceForm 
              onSubmit={handleFormSubmit} 
              areas={areas} 
              setOpen={setOpen} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MaintenancePage;
