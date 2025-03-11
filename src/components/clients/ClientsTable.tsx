
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase, mockClients, clientAdapter } from "@/integrations/supabase/client";
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
  Clock,
  Loader2
} from "lucide-react";
import type { Client } from "@/types/clients";
import { useToast } from "@/hooks/use-toast";

const StatusBadge = ({ status }: { status: Client["status"] }) => {
  const config = {
    active: { label: "Ativo", className: "bg-success text-success-foreground" },
    inactive: { label: "Inativo", className: "bg-gray-200 text-gray-700" },
  };

  const badgeConfig = status === 'active' ? config.active : config.inactive;

  return (
    <Badge className={badgeConfig.className}>
      {badgeConfig.label}
    </Badge>
  );
};

export const ClientsTable = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          toast({
            title: "Erro ao carregar clientes",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        // Use mock data for development until we fix database schema
        if (!data || data.length === 0) {
          return mockClients();
        }

        // Transform data to match the Client interface
        return data.map(client => clientAdapter(client));
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Fallback to mock data
        return mockClients();
      }
    },
  });

  const filteredClients = clients?.filter(
    (client) =>
      client.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (client.responsible && client.responsible.toLowerCase().includes(search.toLowerCase()))
  ) ?? [];

  if (error) {
    return (
      <div className="text-center py-6 text-danger">
        Erro ao carregar dados dos clientes.
      </div>
    );
  }

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      {client.company_name}
                    </div>
                  </TableCell>
                  <TableCell>{client.responsible || "-"}</TableCell>
                  <TableCell>{client.room || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{client.meeting_room_credits}h disponíveis</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={client.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(client.contract_start_date).toLocaleDateString("pt-BR")}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
