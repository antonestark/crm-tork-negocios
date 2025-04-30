import { useState, useEffect } from 'react'; // Keep useEffect for subscription cleanup
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQuery
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreVertical, Edit, Trash2, FileText, Copy, Loader2, Search } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { clientAdapter } from '@/integrations/supabase/adapters';
import { Badge } from "@/components/ui/badge";
import { Client } from '@/types/clients';
// ClientForm is likely not needed here anymore as the dialog is in the parent
// import { ClientForm } from './ClientForm'; 
// Dialog components are likely not needed here anymore
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from 'react'; // Import React
// ClientFormValues might not be needed here if handleSubmit is removed/changed
// import { ClientFormValues } from './ClientForm'; 

// Define props for ClientsTable
interface ClientsTableProps {
  onEditClient: (client: Client) => void; // Callback for edit action
  onDeleteClient: (clientId: string) => void; // Callback for delete action
  onViewDetails: (client: Client) => void; // Callback for view details action
}

export function ClientsTable({ onEditClient, onDeleteClient, onViewDetails }: ClientsTableProps) { // Destructure props
  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState(''); 
  
  const queryClient = useQueryClient(); // Get query client instance for invalidation
  const { session, isLoading: isAuthLoading } = useAuth(); // Get auth state

  // Define the query key, including filters
  const queryKey = ['clients', searchTerm, statusFilter, tagFilter];

  // Fetching function for useQuery
  const fetchClientsQuery = async () => {
    let query = supabase
      .from('clients')
      .select('id, company_name, razao_social, trading_name, responsible, room, meeting_room_credits, status, contract_start_date, contract_end_date, document, birth_date, address, email, phone, monthly_value, notes, tags, created_at, updated_at');

    if (searchTerm) {
      query = query.or(`company_name.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }

    if (tagFilter) {
      const tagList = tagFilter.split(',').map(tag => tag.trim()).filter(Boolean); // Filter out empty tags
      if (tagList.length > 0) {
         query = query.contains('tags', tagList); 
      }
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clients query:', error);
      toast.error('Falha ao carregar dados dos clientes');
      throw error; // Throw error for React Query to handle
    }

    // Usar o adaptador para converter os dados
    return clientAdapter(data || []);
  };

  // Use React Query to fetch data
  const { data: clients = [], isLoading, isError } = useQuery<Client[], Error>({
    queryKey: queryKey,
    queryFn: fetchClientsQuery,
    enabled: !!session && !isAuthLoading, // Enable only when authenticated
    // Optional: Add staleTime or cacheTime if needed
  });

  // Set up realtime subscription to invalidate query on changes
  useEffect(() => {
    const channel = supabase
      .channel('clients_changes')
      .on('postgres_changes', {
        event: '*', // Listen for insert, update, delete
        schema: 'public',
        table: 'clients'
      }, (payload) => {
        console.log('Realtime change received for clients:', payload);
        // Invalidate the query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['clients'] }); 
      })
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Realtime channel for clients subscribed.');
         }
         if (status === 'CHANNEL_ERROR') {
           console.error('Realtime channel error:', err);
         }
         if (status === 'TIMED_OUT') {
            console.warn('Realtime channel subscription timed out.');
         }
      });

    // Cleanup function to unsubscribe
    return () => {
      console.log('Unsubscribing from clients realtime channel.');
      supabase.removeChannel(channel);
    };
  // Dependency array includes queryClient to ensure stable reference
  // Filters are part of the queryKey, so no need to include them here for the subscription setup
  }, [queryClient]); 
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleCopyInfo = (client: Client) => {
    const text = `${client.company_name}\n${client.email || ''}\n${client.phone || ''}`;
    navigator.clipboard.writeText(text);
    toast.success('Informações copiadas para a área de transferência');
  };

  // Removed local handleSubmit and prepareInitialValues as they relate to the local dialog state

  return (
    <Card className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg">
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>
          Lista de todos os seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 items-end"> 
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <Input
            type="search"
            placeholder="Filtrar por tags (separadas por vírgula)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="pl-3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Filtrar por Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusFilterChange('all')}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('active')}>Ativos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('inactive')}>Inativos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('pending')}>Pendentes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Nome</TableHead>
                <TableHead className="w-[150px]">Razão Social</TableHead>
                <TableHead className="w-[120px]">Documento</TableHead>
                <TableHead className="w-[100px]">Data Nasc.</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">Nenhum cliente encontrado.</TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.company_name}</TableCell>
                    <TableCell>{client.razao_social || ''}</TableCell>
                    <TableCell>{client.document || ''}</TableCell>
                    <TableCell>{client.birth_date?.toString() || ''}</TableCell>
                    <TableCell>{client.email || ''}</TableCell>
                    <TableCell>{client.phone || ''}</TableCell>
                     <TableCell>
                      {client.tags && client.tags.length > 0 ? (
                        client.tags.map((tag, index) => (
                          <Badge key={index} className="mr-1">{tag}</Badge>
                        ))
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          {/* Call onEditClient passed from parent */}
                          <DropdownMenuItem onClick={() => onEditClient(client)}> 
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyInfo(client)}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar Informações
                          </DropdownMenuItem>
                          {/* Call onViewDetails passed from parent */}
                          <DropdownMenuItem onClick={() => onViewDetails(client)}>
                            <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* Call onDeleteClient passed from parent */}
                          <DropdownMenuItem className="text-red-600" onClick={() => onDeleteClient(client.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
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
      </CardContent>
    </Card>
  )
}
