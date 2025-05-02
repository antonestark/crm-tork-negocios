"use client";

import React, { useState } from 'react';
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
  DialogTrigger,
  DialogClose, // Import DialogClose
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
import { useToast } from "@/hooks/use-toast"; // Assuming use-toast hook exists
import { addTenantSchema, AddTenantFormValues } from './schema';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { Database, TablesInsert } from '@/types/supabase'; // Import generic types
import { useQueryClient } from '@tanstack/react-query'; // To invalidate queries

interface AddTenantFormProps {
  // Expect children to be a function that receives an object with an onOpen handler
  children: (props: { onOpen: () => void }) => React.ReactNode;
}

// Removed generateSchemaName function

export function AddTenantForm({ children }: AddTenantFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddTenantFormValues>({
    resolver: zodResolver(addTenantSchema),
    defaultValues: {
      name: "",
      // identity removed
      user_limit: 1,
      connection_limit: 1,
      status: "inactive",
      tier: "",
      trial_days: 0,
      smtp_host: "",
      smtp_port: undefined, // Use undefined for optional numbers
      smtp_user: "",
      smtp_password: "",
      smtp_secure: true,
      asaas_token: "",
      customer_id: "",
    },
  });

  const onSubmit = async (values: AddTenantFormValues) => {
    setIsSubmitting(true);
    // schemaName generation removed

    try {
      // Schema creation logic removed

      // Insert tenant metadata - RLS approach
      const tenantToInsert: Partial<TablesInsert<'tenants'>> = {
        name: values.name, // Required
        // schema_name removed
        // identity removed
        user_limit: values.user_limit,
        connection_limit: values.connection_limit,
        status: values.status,
        tier: values.tier || null,
        trial_days: values.trial_days || null,
        smtp_host: values.smtp_host || null,
        smtp_port: values.smtp_port || null,
        smtp_user: values.smtp_user || null,
        smtp_password: values.smtp_password || null, // Still consider security
        smtp_secure: values.smtp_secure,
        asaas_token: values.asaas_token || null, // Still consider security
        customer_id: values.customer_id || null,
        // created_at and updated_at are handled by the database
      };

      // Call the database function instead of direct insert
      console.log("Calling create_tenant_as_admin with:", tenantToInsert);
      const { data: tenantData, error: rpcError } = await supabase
        .rpc('create_tenant_as_admin', { tenant_data: tenantToInsert })
        .select() // Select the returned tenant data
        .single(); // Expecting a single row back

      if (rpcError) {
        console.error("RPC create_tenant_as_admin error:", rpcError);
        throw new Error(`Falha ao criar inquilino via RPC: ${rpcError.message}`);
      }
      console.log("Tenant created successfully via RPC:", tenantData);

      // Logic to create the initial user for the tenant should happen here,
      // likely by calling another function or Supabase Auth method.
      // This needs to be implemented separately.

      toast({
        title: "Sucesso!",
        description: `Inquilino "${values.name}" criado com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ['tenants'] }); // Refetch tenants list
      setOpen(false); // Close the dialog
      form.reset(); // Reset form fields

    } catch (error: any) {
      console.error("Error creating tenant:", error);
      toast({
        title: "Erro ao criar inquilino",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Render the trigger element by calling the children function */}
      {children({ onOpen: () => setOpen(true) })}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Inquilino</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para registrar uma nova empresa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
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
            {/* Identity field removed from form */}

            {/* Limits & Status */}
             <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="user_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite Usuários</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
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
                      <Input type="number" min="1" {...field} />
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <Input type="number" placeholder="465" {...field} />
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
                    <FormLabel>Senha SMTP</FormLabel>
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
                  <FormLabel>Token Asaas</FormLabel>
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
                {isSubmitting ? "Criando..." : "Criar Inquilino"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
