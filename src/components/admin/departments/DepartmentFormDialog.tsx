import React, { useState, useEffect } from 'react'; // Import useEffect
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Department, User } from '@/types/admin';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import * as z from 'zod'; // Import zod

// Define Zod schema for validation
const departmentFormSchema = z.object({
  name: z.string().min(1, { message: "O nome do departamento é obrigatório." }),
  description: z.string().optional(),
  // Add other fields if they become editable
  // parent_id: z.string().nullable().optional(), 
  // manager_id: z.string().nullable().optional(),
});

// Infer the type from the schema
type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: Partial<Department>) => Promise<boolean | void>; // Adjust onSave return type if needed
  department?: Department | null;
  departments?: Department[]; // Keep for potential parent selection later
  users?: User[]; // Keep for potential manager selection later
  isEditing?: boolean;
}

const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  department,
  departments = [], 
  users = [],
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema), // Use zodResolver
    defaultValues: {
      name: '', // Initialize all fields
      description: '',
      // parent_id: null,
      // manager_id: null,
      ...(department ? { // Spread existing department data if editing
          name: department.name,
          description: department.description || '',
          // parent_id: department.parent_id,
          // manager_id: department.manager_id,
        } : {}) 
    }
  });

  // Reset form when department changes (for editing) or dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: department?.name || '',
        description: department?.description || '',
        // parent_id: department?.parent_id || null,
        // manager_id: department?.manager_id || null,
      });
    } else {
       // Optionally reset fully when closing if desired
       // form.reset({ name: '', description: '', parent_id: null, manager_id: null });
    }
  }, [department, open, form]);


  const handleSubmit = async (data: DepartmentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Pass only the validated data to onSave
      // Ensure onSave in context expects Partial<Department> or DepartmentFormValues
      await onSave(data); 
      // No need to cast 'as Department' if onSave expects Partial or the form values type
      
      // onSave should handle closing the dialog on success
      // onOpenChange(false); // Let the context handle closing
      // form.reset(); // Reset is handled by useEffect now
    } catch (error) {
      console.error('Error submitting department form:', error);
      // Toast error should be handled in the context's onSave function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border border-blue-900/40 text-slate-100"> {/* Dark theme */}
        <DialogHeader>
          <DialogTitle className="text-slate-100">{isEditing ? 'Editar Departamento' : 'Criar Departamento'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Nome*</FormLabel> {/* Dark theme */}
                  <FormControl>
                    <Input 
                      placeholder="Nome do departamento" 
                      {...field} 
                      className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" // Dark theme
                    />
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
                  <FormLabel className="text-slate-300">Descrição</FormLabel> {/* Dark theme */}
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do departamento" 
                      {...field} 
                      rows={3} 
                      className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" // Dark theme
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* TODO: Add fields for parent_id and manager_id if needed */}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 text-white hover:bg-green-700"> {/* Style submit */}
                {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentFormDialog;
