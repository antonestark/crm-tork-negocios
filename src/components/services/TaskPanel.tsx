
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

type Task = {
  area: string;
  task: string;
  status: "completed" | "ongoing" | "delayed";
  time: string;
};

const TaskStatus = ({ status }: { status: "completed" | "ongoing" | "delayed" }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: "text-green-500",
      label: "Concluído",
    },
    ongoing: {
      icon: Clock,
      color: "text-yellow-500",
      label: "Em Andamento",
    },
    delayed: {
      icon: AlertTriangle,
      color: "text-red-500",
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
  const tasks: Task[] = [
    {
      area: "Áreas Comuns",
      task: "Limpeza do Hall",
      status: "completed",
      time: "08:00",
    },
    {
      area: "Banheiros",
      task: "Higienização",
      status: "ongoing",
      time: "09:30",
    },
    {
      area: "Salas Privativas",
      task: "Manutenção AC",
      status: "delayed",
      time: "10:00",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
      </CardContent>
    </Card>
  );
};
