
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Bath, Building2, TreePine, Wind } from "lucide-react";

type AreaCard = {
  title: string;
  icon: React.ElementType;
  tasks: number;
  status: "good" | "warning" | "attention";
};

export const ServiceAreas = () => {
  const areas: AreaCard[] = [
    { title: "Áreas Comuns", icon: Home, tasks: 12, status: "good" },
    { title: "Banheiros", icon: Bath, tasks: 8, status: "warning" },
    { title: "Salas Privativas", icon: Building2, tasks: 15, status: "good" },
    { title: "Áreas Externas", icon: TreePine, tasks: 6, status: "attention" },
    { title: "Filtros AC", icon: Wind, tasks: 4, status: "good" },
  ];

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
