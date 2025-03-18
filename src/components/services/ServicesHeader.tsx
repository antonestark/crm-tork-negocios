
import { Button } from "@/components/ui/button";
import { Plus, ListTodo, Filter } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ServiceFormDialog } from "./service-form";

export const ServicesHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openServiceForm, setOpenServiceForm] = useState(false);
  
  const handleNovaDemanda = () => {
    // Simplify the approach to avoid race conditions
    if (location.pathname === '/services/demands') {
      // If already on the demands page, just set a local storage flag
      // This avoids navigation issues that can cause the form to flash
      localStorage.setItem('openDemandForm', 'true');
      // Force a re-render by using a small state update
      window.dispatchEvent(new Event('storage'));
    } else {
      // If on a different page, navigate normally
      navigate('/services/demands', { state: { openDemandForm: true } });
    }
  };
  
  const handleNovoServico = () => {
    setOpenServiceForm(true);
  };
  
  const handleFormSuccess = () => {
    // Refresh the page or fetch data again
    window.location.reload();
  };
  
  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Gerencie as atividades de serviços gerais
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center" 
            size="sm"
            onClick={handleNovoServico}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button 
            className="flex items-center" 
            variant="outline" 
            size="sm"
            onClick={handleNovaDemanda}
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Nova Demanda
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ServiceFormDialog 
        open={openServiceForm} 
        setOpen={setOpenServiceForm} 
        onSuccess={handleFormSuccess}
      />
    </>
  );
};
