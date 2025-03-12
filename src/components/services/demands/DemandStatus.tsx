
import { Badge } from "@/components/ui/badge";

export function getPriorityBadge(priority: string) {
  switch (priority) {
    case "urgent":
      return <Badge className="bg-red-500">Urgente</Badge>;
    case "high":
      return <Badge className="bg-orange-500">Alta</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500">Média</Badge>;
    default:
      return <Badge className="bg-blue-500">Baixa</Badge>;
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Concluído</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    case "delayed":
      return <Badge className="bg-red-500">Atrasado</Badge>;
    case "cancelled":
      return <Badge variant="outline">Cancelado</Badge>;
    default:
      return <Badge className="bg-yellow-500">Pendente</Badge>;
  }
}
