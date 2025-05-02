"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/types/supabase"; // Import the correct Tenant type

const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'default'; // Greenish or primary color
    case 'inactive':
      return 'secondary'; // Gray
    case 'trial':
      return 'outline'; // Blueish or distinct color
    default:
      return 'secondary';
  }
};

export const columns: ColumnDef<Tenant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Adicionar Coluna # (ID) - Usando parte do UUID por enquanto
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="w-10 truncate">{id.substring(0, 4)}...</div>; // Mostra os primeiros 4 caracteres
    },
    enableSorting: false, // Geralmente não se ordena por UUID parcial
  },
  {
    accessorKey: "status", // Manter Status principal
    header: "Status",
    cell: ({ row }) => {
       const status = row.getValue("status") as string | null;
       return <Badge variant={getStatusVariant(status)}>{status || 'N/A'}</Badge>;
    }
  },
  {
    accessorKey: "name", // Manter Nome
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user_limit",
    header: "Limite de Usuário",
  },
  {
    accessorKey: "connection_limit", // Manter Limite de Conexão
    header: "Limite de Conexão",
  },
  {
    accessorKey: "disable_unofficial", // Adicionar Desabilitar Não-Oficial
    header: "Desabilitar Não-Oficial",
    cell: ({ row }) => {
      const isDisabled = row.getValue("disable_unofficial") as boolean;
      return isDisabled ? "Sim" : "Não";
    },
  },
  {
    accessorKey: "asaas_status", // Adicionar Status Asaas
    header: "Status Asaas",
    cell: ({ row }) => {
       // Idealmente, usar um Badge aqui também se houver variantes de status Asaas
       const status = row.getValue("asaas_status") as string | null;
       return status || '-';
    }
  },
  {
    accessorKey: "asaas_token", // Adicionar Token Asaas (com ressalvas)
    header: "Token Asaas",
    cell: ({ row }) => {
      const token = row.getValue("asaas_token") as string | null;
      // Mostrar apenas parte do token por segurança?
      return token ? `${token.substring(0, 5)}...` : '-';
    },
  },
  {
    accessorKey: "customer_id", // Manter Customer ID (Asaas)
    header: "Customer ID (Asaas)",
  },
  {
    accessorKey: "identity", // Adicionar Identidade
    header: "Identidade",
  },
  // { // Remover Coluna Plano (tier) da tabela principal
  //   accessorKey: "tier",
  //   header: "Plano",
  // },
  {
    accessorKey: "trial_days", // Adicionar Tempo de Teste (condicional)
    header: "Tempo de Teste",
    cell: ({ row }) => {
      const status = row.original.status;
      const days = row.getValue("trial_days") as number | null;
      return status === 'trial' && days !== null ? `${days} dias` : 'Inativo';
    },
  },
  {
    accessorKey: "created_at", // Manter Data Criação
    header: ({ column }) => {
       return (
         <Button
           variant="ghost"
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
           Data Criação
           <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       );
     },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formatted = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    // Access meta from the cell context
    cell: ({ row, table }) => {
      const tenant = row.original;
      // Get the handler from meta (ensure meta exists and has the function)
      const openEditDialog = (table.options.meta as any)?.openEditDialog;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tenant.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Call the handler from meta when Edit is clicked */}
            <DropdownMenuItem onClick={() => openEditDialog?.(tenant)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Config SMTP", tenant.id)}>Config. SMTP</DropdownMenuItem> {/* TODO */}
            <DropdownMenuItem onClick={() => console.log("Pagamentos", tenant.id)}>Pagamentos</DropdownMenuItem> {/* TODO */}
            <DropdownMenuItem onClick={() => console.log("Alterar Token", tenant.id)}>Alterar Token Asaas</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => console.log("Desativar", tenant.id)}>
              {tenant.status === 'active' ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-800" onClick={() => console.log("Excluir", tenant.id)}>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
