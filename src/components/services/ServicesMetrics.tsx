
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

type ServicesMetricsProps = {
  metrics?: {
    completed: number;
    pending: number;
    delayed: number;
    averageTime: number;
  }
};

export const ServicesMetrics = ({ metrics }: ServicesMetricsProps) => {
  const defaultMetrics = {
    completed: 24,
    pending: 8,
    delayed: 2,
    averageTime: 45
  };

  // Use os valores fornecidos, ou caia nos valores padrão
  const { completed, pending, delayed, averageTime } = metrics || defaultMetrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completed}</div>
          <p className="text-xs text-muted-foreground">+2 desde ontem</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTime}min</div>
          <p className="text-xs text-muted-foreground">Por tarefa</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendências</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
          <p className="text-xs text-muted-foreground">Tarefas pendentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atrasos</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayed}</div>
          <p className="text-xs text-muted-foreground">Tarefas atrasadas</p>
        </CardContent>
      </Card>
    </div>
  );
};
