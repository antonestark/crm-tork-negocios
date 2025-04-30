import React, { useState, useEffect } from 'react'; // Keep useEffect for subscription cleanup
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
import { MoreVertical, Loader2, Search } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Visitor } from '@/types/visitors'; // Assuming Visitor type exists
import { format } from 'date-fns'; // For formatting dates

export function VisitorsTable() {
  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  // Add other filters if needed

  const queryClient = useQueryClient(); // Get query client instance for invalidation
  const { session, isLoading: isAuthLoading } = useAuth(); // Get auth state

  // Define the query key, including filters
  const queryKey = ['visitors', searchTerm]; // Add other filters to key if implemented

  // Fetching function for useQuery
  const fetchVisitorsQuery = async () => {
    // Fetch visitors and related client name
    let query = supabase
      .from('visitors')
      .select(`
        id, 
        name, 
        document, 
        client_id, 
        visit_time, 
        notes, 
        created_at,
        clients ( company_name ) 
      `); // Fetch client name

    if (searchTerm) {
      // Adjust search fields as needed
      query = query.or(`name.ilike.%${searchTerm}%,document.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);
    }

    // Add other filters here

    query = query.order('visit_time', { ascending: false }); // Order by visit time

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching visitors query:', error);
      toast.error('Falha ao carregar registros de visitantes');
      throw error; // Throw error for React Query to handle
    }

    return data || [];
  };

  // Use React Query to fetch data
  const { data: visitors = [], isLoading, isError } = useQuery<Visitor[], Error>({
    queryKey: queryKey,
    queryFn: fetchVisitorsQuery,
    enabled: !!session && !isAuthLoading, // Enable only when authenticated
    // Optional: Add staleTime or cacheTime if needed
  });

  // Set up realtime subscription to invalidate query on changes
  useEffect(() => {
    const channel = supabase
      .channel('visitors_changes')
      .on('postgres_changes', {
        event: '*', // Listen for insert, update, delete
        schema: 'public',
        table: 'visitors'
      }, (payload) => {
        console.log('Realtime change received for visitors:', payload);
        // Invalidate the query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['visitors'] }); 
      })
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Realtime channel for visitors subscribed.');
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
      console.log('Unsubscribing from visitors realtime channel.');
      supabase.removeChannel(channel);
    };
  // Dependency array includes queryClient to ensure stable reference
  }, [queryClient]); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatVisitTime = (isoString: string) => {
    try {
      return format(new Date(isoString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <Card className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg">
      <CardHeader>
        {/* Card Header content can be added if needed */}
         <CardTitle>Registros de Visitantes</CardTitle>
         <CardDescription>Lista de visitantes registrados.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 items-end mb-4"> {/* Adjust columns if needed */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar visitantes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          {/* Add other filter controls here */}
        </div>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Visitante</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Cliente Visitado</TableHead>
                <TableHead>Data/Hora da Visita</TableHead>
                <TableHead>Observações</TableHead>
                {/* <TableHead className="text-right">Ações</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? ( // Handle error state
                 <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">Erro ao carregar visitantes.</TableCell>
                </TableRow>
              ) : visitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Nenhum registro de visitante encontrado.</TableCell>
                </TableRow>
              ) : (
                visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.document || 'N/A'}</TableCell>
                    <TableCell>{(visitor.clients as { company_name: string } | null)?.company_name || 'Cliente não encontrado'}</TableCell>
                    <TableCell>{formatVisitTime(visitor.visit_time)}</TableCell>
                    <TableCell>{visitor.notes || ''}</TableCell>
                    {/* 
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
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> 
                    */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
