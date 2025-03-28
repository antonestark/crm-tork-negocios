import { useState, useEffect } from 'react';
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
import { ClientForm } from './ClientForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from 'react'; // Import React
import { ClientFormValues } from './ClientForm'; // Import the form values type

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState(''); // Novo estado para o filtro de tags
  const [open, setOpen] = React.useState(false); // Dialog state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();

    // Set up a realtime subscription
    const subscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients'
      }, () => {
        fetchClients();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [searchTerm, statusFilter, tagFilter]); // Adicionado tagFilter como dependência

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('id, company_name, razao_social, trading_name, responsible, room, meeting_room_credits, status, contract_start_date, contract_end_date, document, birth_date, address, email, phone, monthly_value, notes, tags, created_at, updated_at');

      if (searchTerm) {
        query = query.or(`company_name.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      if (tagFilter) {
        const tagList = tagFilter.split(',').map(tag => tag.trim());
        query = query.contains('tags', tagList); // Filtrar por tags (usando contains)
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Usar o adaptador para converter os dados
      const adaptedClients = clientAdapter(data || []);
      setClients(adaptedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Falha ao carregar dados dos clientes');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Update handleSubmit to use ClientFormValues
  const handleSubmit = (values: ClientFormValues) => { 
    // TODO: Implementar a lógica para criar/atualizar o cliente no Supabase
    // A conversão de `tags` (string separada por vírgula) para array já é feita no ClientForm onChange
    console.log("Form values:", values); 
    setOpen(false);
    setSelectedClient(null); // Reset selected client after submit
    toast.success('Cliente criado/atualizado com sucesso!');
  };

  // Helper to prepare initial values for the form, converting tags array to string
  const prepareInitialValues = (client: Client | null): ClientFormValues | undefined => {
    if (!client) return undefined;
    return {
      ...client,
      tags: client.tags || [], // Ensure tags is an array for the form state
    };
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>
          Lista de todos os seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 items-end"> {/* Alterado para 3 colunas */}
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
           {/* Filtro por Tags (Temporário - Input Simples) */}
          <Input
            type="search"
            placeholder="Filtrar por tags (separadas por vírgula)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="pl-3"
          />
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Novo Cliente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>{selectedClient ? "Editar Cliente" : "Criar Novo Cliente"}</DialogTitle>
                <DialogDescription>
                  {selectedClient ? "Edite os dados do cliente selecionado." : "Adicione um novo cliente à sua lista."}
                </DialogDescription>
              </DialogHeader>
              <ClientForm 
                onSubmit={handleSubmit} 
                // Pass prepared initial values
                initialValues={prepareInitialValues(selectedClient)} 
              />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
                    <TableCell>{client.birth_date || ''}</TableCell>
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
                          <DropdownMenuItem onClick={() => {
                              setSelectedClient(client);
                              setOpen(true);
                            }}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyInfo(client)}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar Informações
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => {
                              // TODO: Implement delete client logic
                              toast.success('Cliente excluído com sucesso!');
                            }}>
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
