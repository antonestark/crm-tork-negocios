
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Users, 
  Building2,
  Calendar,
  Clock
} from "lucide-react";

type Client = {
  id: string;
  company: string;
  responsible: string;
  room: string;
  credits: number;
  status: "active" | "inactive";
  contractDate: string;
};

const mockClients: Client[] = [
  {
    id: "1",
    company: "Tech Solutions Ltda",
    responsible: "João Silva",
    room: "Sala 101",
    credits: 4,
    status: "active",
    contractDate: "2024-01-15",
  },
  {
    id: "2",
    company: "Digital Services ME",
    responsible: "Maria Santos",
    room: "Sala 102",
    credits: 2,
    status: "active",
    contractDate: "2024-02-01",
  },
  {
    id: "3",
    company: "Inovação Corp",
    responsible: "Pedro Costa",
    room: "Sala 103",
    credits: 0,
    status: "inactive",
    contractDate: "2023-12-01",
  },
];

const StatusBadge = ({ status }: { status: Client["status"] }) => {
  const config = {
    active: { label: "Ativo", className: "bg-success text-success-foreground" },
    inactive: { label: "Inativo", className: "bg-gray-200 text-gray-700" },
  };

  return (
    <Badge className={config[status].className}>
      {config[status].label}
    </Badge>
  );
};

export const ClientsTable = () => {
  const [search, setSearch] = useState("");
  const [clients] = useState<Client[]>(mockClients);

  const filteredClients = clients.filter(
    (client) =>
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.responsible.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por empresa ou responsável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Créditos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Contrato</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    {client.company}
                  </div>
                </TableCell>
                <TableCell>{client.responsible}</TableCell>
                <TableCell>{client.room}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{client.credits}h disponíveis</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(client.contractDate).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-danger">
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
