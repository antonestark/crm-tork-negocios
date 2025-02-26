
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AgendamentoList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Horário</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>09:00 - 10:00</TableCell>
              <TableCell>Cliente A</TableCell>
              <TableCell>Agendado</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10:10 - 11:10</TableCell>
              <TableCell>Cliente B</TableCell>
              <TableCell>Em Andamento</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
