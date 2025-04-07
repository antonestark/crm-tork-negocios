
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
      contact_name: initialValues?.contact_name || "", // Adicionado valor padrão
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

  function applyCpfMask(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function applyCnpjMask(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

  // Determine document type and set appropriate mask
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, '');

    if (rawValue.length > 11) {
      setDocumentMask(CNPJ_MASK);
      const masked = applyCnpjMask(rawValue);
      form.setValue('document', masked);
    } else {
      setDocumentMask(CPF_MASK);
      const masked = applyCpfMask(rawValue);
      form.setValue('document', masked);
    }
  };

  // Helper function to handle form submission.
  const handleSubmit = (values: ClientFormValues) => {
    const newValues = { ...values };

    if (newValues.birth_date && newValues.birth_date.includes('/')) {
      const [day, month, year] = newValues.birth_date.split('/');
      newValues.birth_date = `${year}-${month}-${day}`;
    }

    onSubmit(newValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
