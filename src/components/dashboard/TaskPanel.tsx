
import { CheckCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServiceTasks } from "@/hooks/use-service-tasks";
import { Skeleton } from "@/components/ui/skeleton";

const TaskStatus = ({ status }: { status: "completed" | "ongoing" | "delayed" }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: "text-cyan-400",
      bg: "bg-cyan-950/30",
      border: "border-cyan-500/30",
      label: "Concluído",
    },
    ongoing: {
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-950/30",
      border: "border-amber-500/30",
      label: "Em Andamento",
    },
    delayed: {
      icon: AlertTriangle,
      color: "text-rose-400",
      bg: "bg-rose-950/30",
      border: "border-rose-500/30",
      label: "Atrasado",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center ${config.color} ${config.bg} border ${config.border} px-2 py-1 rounded-full text-xs`}>
      <Icon className="h-3 w-3 mr-1" />
      <span>{config.label}</span>
    </div>
  );
};

export const TaskPanel = () => {
  const { tasks, loading, error, fetchTasks } = useServiceTasks();

  return (
    <Card className="animate-fade-in bg-transparent border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Controle de Serviços
          </CardTitle>
          {error && <CardDescription className="text-rose-400">Erro ao carregar serviços</CardDescription>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => fetchTasks()} 
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-blue-900/30">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-5 w-40 bg-slate-700" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-10 bg-slate-700" />
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-blue-900/30 transition-colors duration-300 group"
              >
                <div>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{task.area}</p>
                  <p className="font-medium text-white">{task.task}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{task.time}</span>
                  <TaskStatus status={task.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-slate-500">Nenhum serviço encontrado</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-blue-500/30 text-blue-400 hover:bg-blue-950/30 hover:text-blue-300" 
              onClick={() => fetchTasks()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
