
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
import { Loader2 } from 'lucide-react'; // Import Loader2

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
  onSubmit: (data: Partial<Lead>) => Promise<boolean>; // Changed onSubmit to match parent
  lead?: Lead | null;
  users: { id: string; name: string }[];
  isSaving?: boolean; // Add isSaving prop
}

export const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  lead,
  users,
  isSaving // Destructure isSaving
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
      {/* Apply dark theme styles to DialogContent */}
      <DialogContent className="sm:max-w-[525px] bg-slate-900 border border-blue-900/40 text-slate-100">
        <DialogHeader>
          {/* Apply dark theme styles to DialogTitle */}
          <DialogTitle className="text-slate-100">{isEditing ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Nome*</FormLabel> {/* Style Label */}
                  <FormControl>
                    {/* Style Input */}
                    <Input placeholder="Nome do contato" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                    <FormLabel className="text-slate-300">Email</FormLabel> {/* Style Label */}
                    <FormControl>
                      {/* Style Input */}
                      <Input placeholder="Email" type="email" {...field} value={field.value || ''} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                    <FormLabel className="text-slate-300">Telefone</FormLabel> {/* Style Label */}
                    <FormControl>
                      {/* Style Input */}
                      <Input placeholder="Telefone" {...field} value={field.value || ''} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                    <FormLabel className="text-slate-300">Empresa</FormLabel> {/* Style Label */}
                    <FormControl>
                      {/* Style Input */}
                      <Input placeholder="Empresa" {...field} value={field.value || ''} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                    <FormLabel className="text-slate-300">Origem</FormLabel> {/* Style Label */}
                    <FormControl>
                      {/* Style Input */}
                      <Input placeholder="Origem do lead" {...field} value={field.value || ''} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                    <FormLabel className="text-slate-300">Status</FormLabel> {/* Style Label */}
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        {/* Style SelectTrigger */}
                        <SelectTrigger className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      {/* Style SelectContent */}
                      <SelectContent className="bg-slate-900 border-blue-900/40 text-slate-100"> 
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
                    <FormLabel className="text-slate-300">Responsável</FormLabel> {/* Style Label */}
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        {/* Style SelectTrigger */}
                        <SelectTrigger className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                      </FormControl>
                      {/* Style SelectContent */}
                      <SelectContent className="bg-slate-900 border-blue-900/40 text-slate-100"> 
                        <SelectItem value="unassigned">Não atribuído</SelectItem>
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
                    <FormLabel className="text-slate-300">Observações</FormLabel> {/* Style Label */}
                    <FormControl>
                      {/* Style Textarea */}
                      <Textarea 
                        placeholder="Observações adicionais sobre o lead"
                        className="min-h-[80px] bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              {/* Style Submit Button and disable when saving */}
              <Button 
                type="submit" 
                className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={isSaving} // Disable button when isSaving is true
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  isEditing ? 'Salvar Alterações' : 'Criar Lead'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
