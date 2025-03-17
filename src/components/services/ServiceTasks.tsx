
import { ServiceTask } from "@/hooks/use-service-tasks";
import { TaskPanel } from "./TaskPanel";
import { Skeleton } from "@/components/ui/skeleton";

type ServiceTasksProps = {
  tasks: ServiceTask[];
  loading: boolean;
  error?: Error | null;
};

export function ServiceTasks({ tasks, loading, error }: ServiceTasksProps) {
  return <TaskPanel />;
}
