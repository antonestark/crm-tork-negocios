
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
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const maintenanceFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  area_id: z.string().uuid().optional(),
  scheduled_date: z.date().optional(),
  status: z.string().default("pending")
});

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "preventive",
      status: "pending"
    }
  });

  useEffect(() => {
    fetchMaintenances();
    fetchAreas();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'maintenance_records' 
      }, () => {
        fetchMaintenances();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select(`
          *,
          service_areas(name),
          users:assigned_to(first_name, last_name)
        `)
        .order("scheduled_date", { ascending: true });
      
      if (error) {
        toast.error("Erro ao carregar manutenções");
        throw error;
      }
      
      setMaintenances(data || []);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("service_areas")
        .select("id, name")
        .eq("status", "active")
        .order("name", { ascending: true });
      
      if (error) throw error;
      
      setAreas(data || []);
    } catch (error) {
      console.error("Erro ao buscar áreas:", error);
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
  
  const onSubmit = async (values: z.infer<typeof maintenanceFormSchema>) => {
    try {
      const { error } = await supabase
        .from("maintenance_records")
        .insert([{
          ...values,
          scheduled_date: values.scheduled_date ? format(values.scheduled_date, 'yyyy-MM-dd') : null
        }]);
        
      if (error) {
        toast.error("Falha ao criar manutenção");
        throw error;
      }
      
      toast.success("Manutenção agendada com sucesso");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar manutenção:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Manutenções</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Nova Manutenção</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título da manutenção" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descrição (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="preventive">Preventiva</SelectItem>
                            <SelectItem value="corrective">Corretiva</SelectItem>
                            <SelectItem value="scheduled">Programada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="area_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas.map(area => (
                              <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scheduled_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data Programada</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Agendar Manutenção</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
