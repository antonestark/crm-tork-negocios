import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { AreaType } from "./types";

const areaFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  status: z.enum(["active", "inactive"]).default("active")
});

type AreaFormValues = z.infer<typeof areaFormSchema>;

// Define the correct type for what the form will submit
type AreaSubmitData = {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  type: string;
}

interface CreateAreaFormProps {
  onSubmit: (values: AreaSubmitData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialValues?: AreaSubmitData;
}

export const CreateAreaForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  initialValues 
}: CreateAreaFormProps) => {
  const [areaTypes, setAreaTypes] = useState<AreaType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  
  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      type: "",
      status: "active"
    }
  });

  // Set form values if initialValues changes
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Fetch area types on component mount
  useEffect(() => {
    // If areas data is loaded, set loading to false
    if (areaTypes && areaTypes.length > 0) {
      setLoadingTypes(false);
    } else {
      // Load area types
      const fetchAreaTypes = async () => {
        try {
          setLoadingTypes(true);
          const { data, error } = await supabase
            .from('area_types')
            .select('id, name, code')
            .order('name');
            
          if (error) throw error;
          
          // Use a proper type assertion
          const typedData = data as unknown as AreaType[];
          setAreaTypes(typedData || []);
          
          // If we have area types, set the first one as default
          if (data && data.length > 0 && !initialValues) {
            form.setValue('type', (typedData[0] as AreaType).code);
          }
        } catch (error) {
          console.error('Error fetching area types:', error);
        } finally {
          setLoadingTypes(false);
        }
      };
      
      fetchAreaTypes();
    }
  }, [form, initialValues, areaTypes.length]);

  const handleSubmit = async (values: AreaFormValues) => {
    await onSubmit({
      name: values.name,
      description: values.description,
      type: values.type,
      status: values.status,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <Textarea 
                  placeholder="Descrição (opcional)" 
                  {...field} 
                  value={field.value || ''} 
                />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTypes ? "Carregando tipos..." : "Selecione o tipo"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingTypes ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : areaTypes.length > 0 ? (
                    areaTypes.map((type) => (
                      <SelectItem key={type.id} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-types" disabled>Nenhum tipo cadastrado</SelectItem>
                  )}
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} value={field.value || 'active'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {initialValues ? 'Cancelar' : 'Cancelar'}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (initialValues ? 'Atualizando...' : 'Criando...') 
              : (initialValues ? 'Atualizar Área' : 'Criar Área')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
