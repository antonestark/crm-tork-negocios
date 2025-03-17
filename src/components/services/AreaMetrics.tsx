
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useServiceReports, ServiceReport } from "@/hooks/use-service-reports";
import { Skeleton } from "@/components/ui/skeleton";

export const AreaMetrics = () => {
  const { reports, loading } = useServiceReports();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhum relatório disponível
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Área</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Concluídas</TableHead>
          <TableHead>Pendentes</TableHead>
          <TableHead>Atrasadas</TableHead>
          <TableHead>Eficiência</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => {
          const efficiency = Math.round(report.completion_rate);
          const reportDate = report.report_date 
            ? new Date(report.report_date) 
            : new Date();
            
          return (
            <TableRow key={report.area_id}>
              <TableCell className="font-medium">
                {report.area_name || "N/A"}
              </TableCell>
              <TableCell>
                {format(reportDate, "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{report.completed_tasks}</TableCell>
              <TableCell>{report.pending_tasks}</TableCell>
              <TableCell>{report.delayed_tasks}</TableCell>
              <TableCell className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Progress value={efficiency} className="h-2 w-[100px]" />
                  <span className="text-sm">{efficiency}%</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
