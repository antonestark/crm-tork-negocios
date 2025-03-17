
import { ServiceTask } from "@/hooks/use-service-tasks";
import { TaskPanel } from "./TaskPanel";
import { Skeleton } from "@/components/ui/skeleton";

type ServiceTasksProps = {
  tasks: ServiceTask[];
  loading: boolean;
  error?: Error | null;
};

export function ServiceTasks({ tasks, loading, error }: ServiceTasksProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>Erro ao carregar atividades recentes</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhuma atividade recente
      </div>
    );
  }

  return <TaskPanel tasks={tasks} />;
}
