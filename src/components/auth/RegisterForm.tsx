
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { registerSchema, RegisterFormValues } from './RegisterSchema';
import { RegisterFormFields } from './RegisterFormFields';
import { useRegisterSubmit } from './useRegisterSubmit';

export function RegisterForm() {
  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  const { isLoading, error, onSubmit } = useRegisterSubmit();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RegisterFormFields />

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando
            </>
          ) : (
            'Cadastrar'
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
