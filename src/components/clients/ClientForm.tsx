
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/clients';

// Import refactored components and schema
import { 
  clientFormSchema, 
  ClientFormValues, 
  CPF_MASK,
  CNPJ_MASK,
  DocumentField,
  CompanyFields,
  ContactFields,
  MetaFields
} from './form';

// Re-export the ClientFormValues type so it can be imported from this file
export type { ClientFormValues };

interface ClientFormProps {
  onSubmit: (values: ClientFormValues) => void;
  initialValues?: Partial<Client>;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialValues }) => {
  // State to track document type
  const [documentMask, setDocumentMask] = useState<string>(CPF_MASK);

  // Define your form.
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      company_name: initialValues?.company_name || "",
      razao_social: initialValues?.razao_social || "",
      document: initialValues?.document || "",
      birth_date: initialValues?.birth_date || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      tags: initialValues?.tags || [],
      status: initialValues?.status || "",
    },
    mode: "onChange",
  });

  // Determine document type and set appropriate mask
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters for comparison
    const value = event.target.value.replace(/\D/g, '');
    
    // Set mask based on length
    if (value.length > 11) {
      setDocumentMask(CNPJ_MASK);
    } else {
      setDocumentMask(CPF_MASK);
    }
    
    // Update form value
    form.setValue('document', event.target.value);
  };

  // Helper function to handle form submission.
  const handleSubmit = (values: ClientFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Company Information Fields */}
        <CompanyFields form={form} />
        
        {/* Document Field with special masking */}
        <DocumentField 
          form={form} 
          documentMask={documentMask} 
          onDocumentChange={handleDocumentChange} 
        />
        
        {/* Contact Information Fields */}
        <ContactFields form={form} />
        
        {/* Metadata Fields */}
        <MetaFields form={form} />
        
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
};
