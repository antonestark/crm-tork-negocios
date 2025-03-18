
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AreaType } from "../types";

export const areaFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  status: z.enum(["active", "inactive"]).default("active")
});

export type AreaFormValues = z.infer<typeof areaFormSchema>;

export type AreaSubmitData = {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  type: string;
}

export const useAreaForm = (
  onSubmit: (values: AreaSubmitData) => Promise<void>,
  initialValues?: AreaSubmitData
) => {
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

  return {
    form,
    areaTypes,
    loadingTypes,
    handleSubmit
  };
};
