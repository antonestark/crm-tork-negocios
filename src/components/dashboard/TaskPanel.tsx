
import { CheckCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServiceTasks, ServiceTask } from "@/hooks/use-service-tasks";
import { Skeleton } from "@/components/ui/skeleton";

const TaskStatus = ({ status }: { status: "completed" | "ongoing" | "delayed" }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: "text-success",
      label: "Concluído",
    },
    ongoing: {
      icon: Clock,
      color: "text-warning",
      label: "Em Andamento",
    },
    delayed: {
      icon: AlertTriangle,
      color: "text-danger",
      label: "Atrasado",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center ${config.color}`}>
      <Icon className="h-4 w-4 mr-2" />
      <span className="text-sm">{config.label}</span>
    </div>
  );
};

export const TaskPanel = () => {
  const { tasks, loading, error, fetchTasks } = useServiceTasks();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Controle de Serviços</CardTitle>
          {error && <CardDescription className="text-danger">Erro ao carregar serviços</CardDescription>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => fetchTasks()} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{task.area}</p>
                  <p className="font-medium">{task.task}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{task.time}</span>
                  <TaskStatus status={task.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground">Nenhum serviço encontrado</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => fetchTasks()}
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
