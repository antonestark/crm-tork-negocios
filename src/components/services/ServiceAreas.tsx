
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
import { useSubscription } from "@/hooks/use-subscription";
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
  const { subscription, loading: subscriptionLoading, checkCanCreateServiceArea } = useSubscription();

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
        "Limite de áreas de serviço atingido. Atualize seu plano para criar mais áreas.",
        {
          action: {
            label: "Ver Planos",
            onClick: () => window.location.href = "/planos"
          }
        }
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
            onClick={() => {
              if (!checkSubscriptionLimit()) {
                return false; // Prevent navigation if limit reached
              }
            }}
          >
            <Link to="/services/areas">Adicionar Área</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isLimitReached = subscription && 
    subscription.status === 'active' && 
    subscription.maxServiceAreas !== 999 && 
    areas.length >= subscription.maxServiceAreas;

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
        
        {isLimitReached && (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-[200px] text-center">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Limite de áreas atingido</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Seu plano atual permite até {subscription.maxServiceAreas} áreas de serviço.
              </p>
              <Button asChild variant="outline">
                <Link to="/planos">Atualizar Plano</Link>
              </Button>
            </CardContent>
          </Card>
        )}
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
