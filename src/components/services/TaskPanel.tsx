
import { ServiceTask } from "@/hooks/use-service-tasks";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface TaskPanelProps {
  tasks: ServiceTask[];
}

export function TaskPanel({ tasks }: TaskPanelProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Atrasado</Badge>;
      default:
        return <Badge variant="outline">Em Andamento</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{task.task}</CardTitle>
              {getStatusBadge(task.status)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Área:</p>
                <p className="font-medium">{task.area}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Data:</p>
                <p className="font-medium">{task.date} às {task.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
