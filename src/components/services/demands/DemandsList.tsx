
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Demand } from "@/types/demands";
import { getPriorityBadge, getStatusBadge } from "./DemandStatus";

interface DemandsListProps {
  demands: Demand[];
  loading: boolean;
}

export function DemandsList({ demands, loading }: DemandsListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((_, i) => (
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
          <TableHead>Prioridade</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Solicitante</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {demands.length > 0 ? (
          demands.map((demand) => (
            <TableRow key={demand.id} className="cursor-pointer hover:bg-muted">
              <TableCell className="font-medium">{demand.title}</TableCell>
              <TableCell>{demand.area?.name || 'N/A'}</TableCell>
              <TableCell>{getPriorityBadge(demand.priority || 'low')}</TableCell>
              <TableCell>
                {demand.assigned_user?.name
                  ? demand.assigned_user.name
                  : 'Não atribuído'}
              </TableCell>
              <TableCell>
                {demand.requester?.name
                  ? demand.requester.name
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {demand.due_date 
                  ? format(new Date(demand.due_date), 'dd/MM/yyyy') 
                  : 'Sem prazo'}
              </TableCell>
              <TableCell>{getStatusBadge(demand.status || 'pending')}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
              Nenhuma demanda encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
