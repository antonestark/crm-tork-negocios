
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DemandsPage = () => {
  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchDemands();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('demands_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands' 
      }, () => {
        fetchDemands();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [statusFilter]);

  const fetchDemands = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("demands")
        .select(`
          *,
          service_areas(name),
          users:assigned_to(first_name, last_name),
          requester:requested_by(first_name, last_name)
        `)
        .order("updated_at", { ascending: false });
      
      // Apply status filter if set
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Erro ao carregar demandas");
        throw error;
      }
      
      setDemands(data || []);
    } catch (error) {
      console.error("Erro ao buscar demandas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
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
  };

  const getStatusBadge = (status: string) => {
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
  };
  
  const resetFilter = () => {
    setStatusFilter(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Demandas</h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={resetFilter}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
                  Em Andamento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Concluídos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("delayed")}>
                  Atrasados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                  Cancelados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Demanda
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Demandas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
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
                        <TableCell>{demand.service_areas?.name || 'N/A'}</TableCell>
                        <TableCell>{getPriorityBadge(demand.priority)}</TableCell>
                        <TableCell>
                          {demand.users?.first_name 
                            ? `${demand.users.first_name} ${demand.users.last_name}` 
                            : 'Não atribuído'}
                        </TableCell>
                        <TableCell>
                          {demand.requester?.first_name 
                            ? `${demand.requester.first_name} ${demand.requester.last_name}` 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {demand.due_date 
                            ? format(new Date(demand.due_date), 'dd/MM/yyyy') 
                            : 'Sem prazo'}
                        </TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DemandsPage;
