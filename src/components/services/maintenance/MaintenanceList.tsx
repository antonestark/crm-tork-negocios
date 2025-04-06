
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface MaintenanceListProps {
  maintenances: any[];
  loading: boolean;
}

export const MaintenanceList = ({ maintenances, loading }: MaintenanceListProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case "delayed":
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensal";
      case "quarterly":
        return "Trimestral";
      case "semiannual":
        return "Semestral";
      case "annual":
        return "Anual";
      default:
        return "Mensal";
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Área</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Frequência</TableHead>
          <TableHead>Data Programada</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.length > 0 ? (
          maintenances.map((maintenance) => (
            <TableRow key={maintenance.id} className="cursor-pointer hover:bg-muted">
              <TableCell className="font-medium">{maintenance.title}</TableCell>
              <TableCell>{maintenance.service_areas?.name || 'N/A'}</TableCell>
              <TableCell>
                {maintenance.type === 'preventive' ? 'Preventiva' : 
                  maintenance.type === 'corrective' ? 'Corretiva' : 'Programada'}
              </TableCell>
              <TableCell>{getFrequencyText(maintenance.frequency)}</TableCell>
              <TableCell>
                {maintenance.scheduled_date ? 
                  format(new Date(maintenance.scheduled_date), 'dd/MM/yyyy') : 
                  'Não agendada'}
              </TableCell>
              <TableCell>
                {maintenance.users?.name ? 
                  maintenance.users.name : 
                  'Não atribuído'}
              </TableCell>
              <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
              Nenhuma manutenção encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
