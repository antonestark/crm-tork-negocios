
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

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  
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

  const loadMaintenanceData = async () => {
    setLoading(true);
    try {
      const [maintenanceData, areasData] = await Promise.all([
        fetchMaintenances(),
        fetchAreas()
      ]);
      
      setMaintenances(maintenanceData);
      setAreas(areasData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
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
