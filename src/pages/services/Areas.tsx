import { Header } from "@/components/layout/Header";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const areaFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  status: z.string().default("active")
});

const AreasPage = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof areaFormSchema>>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "common",
      status: "active"
    }
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
        type: "common",
        status: "active"
      });
    }
  }, [open, form]);

  useEffect(() => {
    fetchAreas();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('area_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_areas' 
      }, () => {
        fetchAreas();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_areas")
        .select(`
          *,
          users:responsible_id (first_name, last_name)
        `)
        .order("name", { ascending: true });
      
      if (error) {
        toast.error("Erro ao carregar áreas");
        throw error;
      }
      
      setAreas(data || []);
    } catch (error) {
      console.error("Erro ao buscar áreas:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof areaFormSchema>) => {
    try {
      // Make sure values.name is defined (it should be due to the schema)
      if (!values.name) {
        toast.error("Nome da área é obrigatório");
        return;
      }
      
      // Ensure type is defined
      if (!values.type) {
        values.type = "common"; // Default value
      }
      
      // Ensure status is defined
      if (!values.status) {
        values.status = "active"; // Default value
      }
      
      console.log("Submitting area:", values);
      
      const { error } = await supabase
        .from("service_areas")
        .insert({
          name: values.name,
          description: values.description || null,
          type: values.type,
          status: values.status
        });
        
      if (error) {
        console.error("Error creating area:", error);
        toast.error("Falha ao criar área");
        throw error;
      }
      
      toast.success("Área criada com sucesso");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar área:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Áreas de Controle</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Área
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Área</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da área" {...field} />
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
                          <Textarea placeholder="Descrição (opcional)" {...field} value={field.value || ''} />
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
                        <Select onValueChange={field.onChange} value={field.value || 'common'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="common">Áreas Comuns</SelectItem>
                            <SelectItem value="bathroom">Banheiros</SelectItem>
                            <SelectItem value="private">Salas Privativas</SelectItem>
                            <SelectItem value="external">Áreas Externas</SelectItem>
                            <SelectItem value="ac">Ar Condicionado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Criar Área</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <Card key={area.id} className="p-4 hover:bg-slate-50 cursor-pointer">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-medium">{area.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex-grow">
                    {area.description || "Sem descrição"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                      {area.type === 'common' ? 'Áreas Comuns' : 
                       area.type === 'bathroom' ? 'Banheiros' : 
                       area.type === 'private' ? 'Salas Privativas' : 
                       area.type === 'external' ? 'Áreas Externas' : 
                       area.type === 'ac' ? 'Ar Condicionado' : 
                       area.type}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${
                      area.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AreasPage;
