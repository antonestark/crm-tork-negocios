
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(2, { message: 'O título deve ter pelo menos 2 caracteres' }),
  description: z.string().optional(),
  area_id: z.string().min(1, { message: 'Selecione uma área' }),
  priority: z.string(),
  assigned_to: z.string().optional(),
  requested_by: z.string().optional(),
  due_date: z.date().optional(),
  status: z.string()
});

type FormValues = z.infer<typeof formSchema>;

interface Demand {
  id?: string;
  title: string;
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: Date;
  status?: string;
}

interface Area {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface DemandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Demand) => Promise<boolean>;
  demand?: Demand | null;
}

export const DemandFormDialog: React.FC<DemandFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  demand
}) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isEditing = !!demand?.id;
  
  useEffect(() => {
    if (open) {
      fetchAreas();
      fetchUsers();
    }
  }, [open]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: demand?.title || '',
      description: demand?.description || '',
      area_id: demand?.area_id || '',
      priority: demand?.priority || 'medium',
      assigned_to: demand?.assigned_to || '',
      requested_by: demand?.requested_by || '',
      due_date: demand?.due_date,
      status: demand?.status || 'pending'
    }
  });
  
  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setAreas(data || []);
    } catch (err) {
      console.error('Error fetching areas:', err);
    }
  };
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = await onSubmit({
        id: demand?.id,
        ...values
      });
      
      if (result) {
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving demand:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Demanda' : 'Nova Demanda'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título*</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da demanda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Não atribuído</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requested_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solicitante</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um solicitante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Não especificado</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Prazo</FormLabel>
                    <FormControl>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="delayed">Atrasado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada da demanda"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Demanda'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
