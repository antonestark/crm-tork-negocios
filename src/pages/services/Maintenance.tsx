
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select(`
          *,
          service_areas(name),
          users(first_name, last_name)
        `)
        .order("scheduled_date", { ascending: true });
      
      if (error) throw error;
      
      setMaintenances(data || []);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
    } finally {
      setLoading(false);
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
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Manutenções</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Manutenção
          </Button>
        </div>
        <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{
                maintenances.filter(m => m.status === 'pending').length
              }</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{
                maintenances.filter(m => m.status === 'in_progress').length
              }</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{
                maintenances.filter(m => m.status === 'completed').length
              }</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Próximas Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Programada</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenances.length > 0 ? (
                    maintenances.map((maintenance) => (
                      <TableRow key={maintenance.id} className="cursor-pointer hover:bg-muted">
                        <TableCell className="font-medium">{maintenance.title}</TableCell>
                        <TableCell>{maintenance.service_areas?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {maintenance.type === 'preventive' ? 'Preventiva' : 
                           maintenance.type === 'corrective' ? 'Corretiva' : 'Programada'}
                        </TableCell>
                        <TableCell>
                          {maintenance.scheduled_date ? 
                            format(new Date(maintenance.scheduled_date), 'dd/MM/yyyy') : 
                            'Não agendada'}
                        </TableCell>
                        <TableCell>
                          {maintenance.users?.first_name ? 
                            `${maintenance.users.first_name} ${maintenance.users.last_name}` : 
                            'Não atribuído'}
                        </TableCell>
                        <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                        Nenhuma manutenção encontrada
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

export default MaintenancePage;
