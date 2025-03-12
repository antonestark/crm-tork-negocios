import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { DemandFormDialog } from "@/components/services/demand-form";
import { useDemands } from "@/hooks/use-demands";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DemandsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { demands, loading, addDemand, fetchDemands } = useDemands();

  // Handler to safely open the form
  const openDemandForm = useCallback(() => {
    console.log("Opening demand form");
    setFormOpen(true);
  }, []);

  // Handle navigation state
  useEffect(() => {
    // Check URL state parameter first
    if (location.state?.openDemandForm) {
      console.log("Opening form from navigation state");
      // Add a small delay to ensure all components are fully mounted
      setTimeout(() => {
        openDemandForm();
        // Clean up navigation state to prevent reopening on refresh
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, navigate, location.pathname, openDemandForm]);

  // Also listen for localStorage changes (for when already on this page)
  useEffect(() => {
    const checkLocalStorage = () => {
      const shouldOpen = localStorage.getItem('openDemandForm');
      if (shouldOpen === 'true') {
        console.log("Opening form from localStorage");
        localStorage.removeItem('openDemandForm');
        // Delay to ensure render cycle completes
        setTimeout(() => {
          openDemandForm();
        }, 100);
      }
    };

    // Check on mount
    checkLocalStorage();
    
    // Also listen for storage events
    window.addEventListener('storage', checkLocalStorage);
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
    };
  }, [openDemandForm]);

  // Safe form close handler with retries if needed
  const handleFormClose = (open: boolean) => {
    console.log("Form open state changing to:", open);
    setFormOpen(open);
    
    if (!open) {
      // Refresh data after closing
      console.log("Form closed, refreshing demands");
      fetchDemands(statusFilter);
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
    fetchDemands();
  };

  const applyFilter = (status: string) => {
    setStatusFilter(status);
    fetchDemands(status);
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
                <DropdownMenuItem onClick={() => applyFilter("pending")}>
                  Pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyFilter("in_progress")}>
                  Em Andamento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyFilter("completed")}>
                  Concluídos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyFilter("delayed")}>
                  Atrasados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyFilter("cancelled")}>
                  Cancelados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => openDemandForm()}>
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
                        <TableCell>{demand.area?.name || 'N/A'}</TableCell>
                        <TableCell>{getPriorityBadge(demand.priority || 'low')}</TableCell>
                        <TableCell>
                          {demand.assigned_user?.name
                            ? demand.assigned_user.name
                            : 'Não atribuído'}
                        </TableCell>
                        <TableCell>
                          {demand.requester?.name
                            ? demand.requester.name
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {demand.due_date 
                            ? format(new Date(demand.due_date), 'dd/MM/yyyy') 
                            : 'Sem prazo'}
                        </TableCell>
                        <TableCell>{getStatusBadge(demand.status || 'pending')}</TableCell>
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
        
        <DemandFormDialog 
          open={formOpen}
          onOpenChange={handleFormClose}
          onSubmit={addDemand}
          demand={null}
        />
      </main>
    </div>
  );
};

export default DemandsPage;
