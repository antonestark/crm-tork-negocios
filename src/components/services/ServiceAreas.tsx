
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Bath, Building2, TreePine, Wind } from "lucide-react";
import { useServiceAreasData, ServiceArea } from "@/hooks/use-service-areas-data";
import { Skeleton } from "@/components/ui/skeleton";

type AreaCardProps = {
  area: ServiceArea;
};

const AreaCard = ({ area }: AreaCardProps) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case "bathroom":
        return Bath;
      case "private":
        return Building2;
      case "external":
        return TreePine;
      case "ac":
        return Wind;
      default:
        return Home;
    }
  };

  const getStatusColor = (area: ServiceArea): "good" | "warning" | "attention" => {
    if (area.status !== "active") return "attention";
    
    // Determinar o status com base nas tarefas pendentes/atrasadas
    const pendingRatio = area.pending_tasks / (area.task_count || 1);
    const delayedTasks = area.delayed_tasks;
    
    if (delayedTasks > 2 || pendingRatio > 0.5) return "attention";
    if (delayedTasks > 0 || pendingRatio > 0.2) return "warning";
    return "good";
  };

  const Icon = getIconForType(area.type);
  const status = getStatusColor(area);

  return (
    <div
      className="flex flex-col space-y-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{area.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {area.task_count} tarefas
        </span>
        <div
          className={`h-2 w-2 rounded-full ${
            status === "good"
              ? "bg-green-500"
              : status === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
};

export const ServiceAreas = () => {
  const { areas, loading } = useServiceAreasData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Áreas de Controle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Áreas de Controle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.length > 0 ? (
            areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Nenhuma área de serviço cadastrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
