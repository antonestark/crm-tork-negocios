
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead } from '@/types/admin';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  status: z.string(),
  assigned_to: z.string().optional().nullable()
});

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Lead>) => void;
  lead?: Lead | null;
  users: { id: string; name: string }[];
}

export const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  lead,
  users
}) => {
  const isEditing = !!lead;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      company: lead?.company || '',
      source: lead?.source || '',
      notes: lead?.notes || '',
      status: lead?.status || 'neutro',
      assigned_to: lead?.assigned_to || null
    }
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      id: lead?.id,
      ...data
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresa" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <FormControl>
                      <Input placeholder="Origem do lead" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="qualificado">Qualificado</SelectItem>
                        <SelectItem value="neutro">Neutro</SelectItem>
                        <SelectItem value="não qualificado">Não Qualificado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || undefined}
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
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o lead"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Lead'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
