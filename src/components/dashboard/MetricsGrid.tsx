
import { ArrowDown, ArrowUp, Clock, Users, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricCard = ({ 
  title, 
  value, 
  trend = 0,
  status = "",
  icon: Icon,
  className = ""
}: {
  title: string;
  value: string;
  trend?: number;
  status?: string;
  icon: any;
  className?: string;
}) => {
  return (
    <Card className={`${className} hover:shadow-lg transition-shadow animate-fade-in`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== 0 && (
          <p className={`text-xs flex items-center mt-1 ${trend > 0 ? "text-success" : "text-danger"}`}>
            {trend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}% em relação ao mês anterior
          </p>
        )}
        {status && (
          <p className="text-sm text-muted-foreground mt-1">{status}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const MetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Total de Clientes Ativos"
        value="42"
        trend={8}
        icon={Users}
      />
      <MetricCard
        title="Status Sala de Reunião"
        value="Livre"
        status="Próximo: 14:00"
        icon={Clock}
        className="border-l-4 border-success"
      />
      <MetricCard
        title="Agendamentos do Dia"
        value="12"
        status="Próximo em 30min"
        icon={Calendar}
      />
      <MetricCard
        title="Demandas Ativas"
        value="5"
        status="2 prioritárias"
        icon={AlertTriangle}
        className="border-l-4 border-warning"
      />
    </div>
  );
};
