
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Bath, Building2, TreePine, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type AreaCardProps = {
  title: string;
  icon: React.ElementType;
  tasks: number;
  status: "good" | "warning" | "attention";
  type: string;
};

type ServiceAreasProps = {
  areasData?: any[];
  loading?: boolean;
};

export const ServiceAreas = ({ areasData, loading = false }: ServiceAreasProps) => {
  const [areas, setAreas] = useState<AreaCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  
  useEffect(() => {
    if (areasData && areasData.length > 0) {
      const formattedAreas = areasData.map(area => ({
        title: area.name,
        icon: getIconForType(area.type),
        tasks: area.task_count || Math.floor(Math.random() * 15) + 1, // Uso de dados reais ou fallback para demonstração
        status: getStatusForArea(area),
        type: area.type
      }));
      setAreas(formattedAreas);
      setIsLoading(false);
    } else if (!loading && (!areasData || areasData.length === 0)) {
      loadDefaultAreas();
    }
  }, [areasData, loading]);

  const loadDefaultAreas = () => {
    setAreas([
      { title: "Áreas Comuns", icon: Home, tasks: 12, status: "good", type: "common" },
      { title: "Banheiros", icon: Bath, tasks: 8, status: "warning", type: "bathroom" },
      { title: "Salas Privativas", icon: Building2, tasks: 15, status: "good", type: "private" },
      { title: "Áreas Externas", icon: TreePine, tasks: 6, status: "attention", type: "external" },
      { title: "Filtros AC", icon: Wind, tasks: 4, status: "good", type: "ac" },
    ]);
    setIsLoading(false);
  };

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

  const getStatusForArea = (area: any): "good" | "warning" | "attention" => {
    if (area.status !== "active") return "attention";
    
    // Se temos dados de tarefas pendentes, usamos eles para determinar o status
    if (area.pending_tasks) {
      const pendingRatio = area.pending_tasks / (area.task_count || 1);
      if (pendingRatio > 0.5) return "attention";
      if (pendingRatio > 0.2) return "warning";
      return "good";
    }
    
    // Fallback para dados aleatórios
    const pendingTasksPercentage = Math.random();
    if (pendingTasksPercentage > 0.7) return "attention";
    if (pendingTasksPercentage > 0.4) return "warning";
    return "good";
  };

  if (isLoading) {
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
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="flex flex-col space-y-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{area.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {area.tasks} tarefas
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      area.status === "good"
                        ? "bg-green-500"
                        : area.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
