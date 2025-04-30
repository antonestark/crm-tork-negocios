
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Lock } from "lucide-react";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { useState, useCallback, useEffect } from "react";
import { EditAreaDialog } from "./areas/EditAreaDialog";
import { AreaActionsMenu } from "./areas/AreaActionsMenu";
// import { useSubscription } from "@/hooks/use-subscription"; // Removido
import { toast } from "sonner";

interface ServiceAreasProps {
  areas: ServiceArea[];
  loading: boolean;
  error?: Error | null;
  onAreaUpdated: () => void;
}

export const ServiceAreas = ({ areas, loading, error, onAreaUpdated }: ServiceAreasProps) => {
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const { subscription, loading: subscriptionLoading, checkCanCreateServiceArea } = useSubscription(); // Removido
  const subscriptionLoading = false; // Simulado
  const checkCanCreateServiceArea = () => true; // Simulado - sempre permite criar

  const handleEdit = useCallback((area: ServiceArea) => {
    // First set the area data
    setEditingArea(area);
    // Then open the dialog after a short delay to ensure state is set
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 50);
  }, []);

  const handleUpdated = useCallback(() => {
    onAreaUpdated();
  }, [onAreaUpdated]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    
    // If dialog is closing, reset the editing area after a short delay
    // This ensures the dialog animations complete before state changes
    if (!open) {
      setTimeout(() => {
        setEditingArea(null);
      }, 300);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setEditingArea(null);
      setIsEditDialogOpen(false);
    };
  }, []);

  const checkSubscriptionLimit = useCallback(() => {
    if (subscriptionLoading) return true; // Allow while loading
    
    const canCreate = checkCanCreateServiceArea();
    if (!canCreate) {
      toast.error(
        "Limite de áreas de serviço atingido." // Mensagem simplificada sem ação
        // { // Ação removida
        //   action: {
        //     label: "Ver Planos",
        //     // onClick: () => window.location.href = "/planos" // Removido
        //   }
        // }
      );
    }
    return canCreate;
  }, [subscriptionLoading, checkCanCreateServiceArea]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-red-500">Erro ao carregar áreas de serviço</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!areas.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Nenhuma área de serviço encontrada</p>
          <Button 
            asChild 
            className="mt-4"
            // onClick={() => { // Lógica de limite removida
            //   if (!checkSubscriptionLimit()) {
            //     return false; 
            //   }
            // }}
          >
            {/* <Link to="/services/areas">Adicionar Área</Link> */} {/* Link pode ser removido se o botão de adicionar estiver no header */}
             Adicionar Área {/* Texto temporário se o Link for removido */}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // const isLimitReached = subscription && // Lógica de limite removida
  //   subscription.status === 'active' && 
  //   subscription.maxServiceAreas !== 999 && 
  //   areas.length >= subscription.maxServiceAreas;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {areas.map((area) => (
          <Card key={area.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {area.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={area.status === 'active' ? 'default' : 'secondary'}>
                  {area.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
                <AreaActionsMenu 
                  area={area} 
                  onEdit={handleEdit} 
                  onDeleted={onAreaUpdated} 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    {area.description || 'Sem descrição'}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{area.task_count} tarefas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Card de limite removido */}
        {/* {isLimitReached && ( ... )} */}
      </div>

      <EditAreaDialog 
        area={editingArea}
        open={isEditDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onUpdated={handleUpdated}
      />
    </>
  );
};
