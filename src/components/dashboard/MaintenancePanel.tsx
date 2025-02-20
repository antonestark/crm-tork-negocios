
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Tool, Thermometer } from "lucide-react";

type MaintenanceItem = {
  system: string;
  lastMaintenance: string;
  nextScheduled: string;
  progress: number;
  status: "ok" | "attention" | "critical";
};

const MaintenanceProgress = ({ value, status }: { value: number; status: MaintenanceItem["status"] }) => {
  const colors = {
    ok: "bg-success",
    attention: "bg-warning",
    critical: "bg-danger",
  };

  return (
    <div className="space-y-2">
      <Progress value={value} className={colors[status]} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Última manutenção</span>
        <span>Próxima prevista</span>
      </div>
    </div>
  );
};

const maintenanceItems: MaintenanceItem[] = [
  {
    system: "Ar Condicionado Central",
    lastMaintenance: "15/03/2024",
    nextScheduled: "15/04/2024",
    progress: 65,
    status: "ok",
  },
  {
    system: "Filtros de Ar",
    lastMaintenance: "10/03/2024",
    nextScheduled: "10/04/2024",
    progress: 75,
    status: "attention",
  },
  {
    system: "Sistema de Ventilação",
    lastMaintenance: "05/03/2024",
    nextScheduled: "05/04/2024",
    progress: 90,
    status: "critical",
  },
];

export const MaintenancePanel = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tool className="h-5 w-5" />
          Manutenções Programadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {maintenanceItems.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.system}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {item.lastMaintenance} - {item.nextScheduled}
                  </span>
                </div>
              </div>
              <MaintenanceProgress value={item.progress} status={item.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
