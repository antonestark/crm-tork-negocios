"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addTenantSchema, AddTenantFormValues } from './schema'; // Reutilizar schema, ajustar se necessário para edição
import { supabase } from '@/integrations/supabase/client';
import { Tenant, TenantUpdate } from '@/types/supabase'; // Usar Tenant e TenantUpdate
import { useQueryClient } from '@tanstack/react-query';

interface EditTenantFormProps {
  tenant: Tenant | null; // Tenant data to edit
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // children?: React.ReactNode; // Trigger is handled outside now
}

export function EditTenantForm({ tenant, open, onOpenChange }: EditTenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Adapt schema if needed for update (e.g., some fields might not be updatable)
  const editTenantSchema = addTenantSchema; // For now, assume same validation

  const form = useForm<AddTenantFormValues>({
    resolver: zodResolver(editTenantSchema),
    defaultValues: { // Initialize with default or tenant data
      name: "",
      user_limit: 1,
      connection_limit: 1,
      status: "inactive",
      tier: "",
      trial_days: 0,
      smtp_host: "",
      smtp_port: undefined,
      smtp_user: "",
      smtp_password: "",
      smtp_secure: true,
      asaas_token: "",
      customer_id: "",
      // Add asaas_status if it's editable
      asaas_status: "", // Initialize asaas_status
    },
  });

  // Populate form with tenant data when dialog opens or tenant changes
  useEffect(() => {
    if (tenant && open) {
      form.reset({
        name: tenant.name,
         user_limit: tenant.user_limit ?? 1,
         connection_limit: tenant.connection_limit ?? 1,
         // Ensure status is one of the allowed enum values or default to inactive
         status: (tenant.status === 'active' || tenant.status === 'inactive' || tenant.status === 'trial') ? tenant.status : "inactive",
         tier: tenant.tier ?? "",
         trial_days: tenant.trial_days ?? 0,
        smtp_host: tenant.smtp_host ?? "",
        smtp_port: tenant.smtp_port ?? undefined,
        smtp_user: tenant.smtp_user ?? "",
        smtp_password: "", // Don't prefill password fields
        smtp_secure: tenant.smtp_secure ?? true,
        asaas_token: "", // Don't prefill token fields
        customer_id: tenant.customer_id ?? "",
        asaas_status: tenant.asaas_status ?? "", // Populate asaas_status
      });
    } else if (!open) {
       form.reset(); // Reset form when dialog closes
    }
  }, [tenant, open, form]);

  const onSubmit = async (values: AddTenantFormValues) => {
    if (!tenant) return; // Should not happen if form is open

    setIsSubmitting(true);

    try {
      const tenantToUpdate: Partial<TenantUpdate> = {
        name: values.name,
        user_limit: values.user_limit,
        connection_limit: values.connection_limit,
        status: values.status,
        tier: values.tier || null,
        trial_days: values.trial_days || null,
        smtp_host: values.smtp_host || null,
        smtp_port: values.smtp_port || null,
        smtp_user: values.smtp_user || null,
        // Only include password/token if changed? Requires form state tracking or separate fields
        // smtp_password: values.smtp_password || null,
        // asaas_token: values.asaas_token || null,
        smtp_secure: values.smtp_secure,
        customer_id: values.customer_id || null,
        asaas_status: values.asaas_status || null, // Include asaas_status
        updated_at: new Date().toISOString(), // Update timestamp
      };

      // Handle sensitive fields (only update if a new value is provided)
      if (values.smtp_password) {
        tenantToUpdate.smtp_password = values.smtp_password;
      }
      if (values.asaas_token) {
        tenantToUpdate.asaas_token = values.asaas_token;
      }


      const { error: updateError } = await supabase
        .from('tenants')
        .update(tenantToUpdate)
        .eq('id', tenant.id); // Match the specific tenant ID

      if (updateError) {
        console.error("Tenant update error:", updateError);
        throw new Error(`Falha ao atualizar inquilino: ${updateError.message}`);
      }

      toast({
        title: "Sucesso!",
        description: `Inquilino "${values.name}" atualizado com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ['tenants'] }); // Refetch tenants list
      onOpenChange(false); // Close the dialog

    } catch (error: any) {
      console.error("Error updating tenant:", error);
      toast({
        title: "Erro ao atualizar inquilino",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // DialogTrigger is now handled outside this component
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Inquilino: {tenant?.name}</DialogTitle>
          <DialogDescription>
            Modifique os detalhes da empresa abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
           {/* Reuse the same form structure as AddTenantForm, potentially factoring it out */}
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             {/* Basic Info */}
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Nome da Empresa *</FormLabel>
                   <FormControl>
                     <Input placeholder="Nome Fantasia" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             {/* Limits & Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                 control={form.control}
                 name="user_limit"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Limite Usuários</FormLabel>
                     <FormControl>
                       <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                <FormField
                 control={form.control}
                 name="connection_limit"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Limite Conexões</FormLabel>
                     <FormControl>
                       <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                 control={form.control}
                 name="status"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}> {/* Use value prop */}
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Selecione o status" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="active">Ativo</SelectItem>
                         <SelectItem value="inactive">Inativo</SelectItem>
                         <SelectItem value="trial">Teste</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                <FormField
                 control={form.control}
                 name="tier"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Plano</FormLabel>
                     <FormControl>
                       <Input placeholder="Ex: Basic, Pro" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                <FormField
                 control={form.control}
                 name="trial_days"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Dias de Teste</FormLabel>
                     <FormControl>
                       <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
             {/* Add Asaas Status Field */}
             <FormField
               control={form.control}
               name="asaas_status"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Status Asaas</FormLabel>
                   <FormControl>
                     <Input placeholder="Status no Asaas" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             {/* SMTP Configuration */}
             <h3 className="text-lg font-semibold pt-4 border-t mt-4">Configuração SMTP (Opcional)</h3>
              <FormField
               control={form.control}
               name="smtp_host"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Host SMTP</FormLabel>
                   <FormControl>
                     <Input placeholder="smtp.example.com" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                 control={form.control}
                 name="smtp_port"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Porta SMTP</FormLabel>
                     <FormControl>
                       <Input type="number" placeholder="465" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                <FormField
                 control={form.control}
                 name="smtp_user"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Usuário SMTP</FormLabel>
                     <FormControl>
                       <Input placeholder="usuario@example.com" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
                <FormField
                 control={form.control}
                 name="smtp_password"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Senha SMTP (deixar em branco para não alterar)</FormLabel>
                     <FormControl>
                       <Input type="password" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
              <FormField
               control={form.control}
               name="smtp_secure"
               render={({ field }) => (
                 <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                     <Checkbox
                       checked={field.value}
                       onCheckedChange={field.onChange}
                     />
                   </FormControl>
                   <div className="space-y-1 leading-none">
                     <FormLabel>Usar Conexão Segura (SSL/TLS)</FormLabel>
                   </div>
                 </FormItem>
               )}
             />

              {/* Asaas Configuration */}
             <h3 className="text-lg font-semibold pt-4 border-t mt-4">Configuração Asaas (Opcional)</h3>
              <FormField
               control={form.control}
               name="asaas_token"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Token Asaas (deixar em branco para não alterar)</FormLabel>
                   <FormControl>
                     <Input type="password" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
              <FormField
               control={form.control}
               name="customer_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Customer ID Asaas</FormLabel>
                   <FormControl>
                     <Input placeholder="cus_..." {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                   Cancelar
                 </Button>
               </DialogClose>
               <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting ? "Salvando..." : "Salvar Alterações"}
               </Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 }
