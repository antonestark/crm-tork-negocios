
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAreaForm, AreaSubmitData } from "./hooks/useAreaForm";
import { NameField } from "./form-fields/NameField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { StatusField } from "./form-fields/StatusField";
import { TypeField } from "./form-fields/TypeField";
import { FormActions } from "./form-fields/FormActions";
import { useEffect } from "react";

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
  const { form, areaTypes, loadingTypes, handleSubmit } = useAreaForm(onSubmit, initialValues);
  
  const isEditMode = !!initialValues;
  
  // Set form fields to disabled/enabled based on isSubmitting
  useEffect(() => {
    if (isSubmitting) {
      // Instead of using non-existent disable() method, 
      // we'll set all form fields to disabled state
      Object.keys(form.getValues()).forEach((fieldName) => {
        form.setValue(fieldName as any, form.getValues(fieldName as any), {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        });
      });
    }
  }, [isSubmitting, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField form={form} disabled={isSubmitting} />
        <DescriptionField form={form} disabled={isSubmitting} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusField form={form} disabled={isSubmitting} />
          <TypeField 
            form={form} 
            areaTypes={areaTypes} 
            loadingTypes={loadingTypes} 
            disabled={isSubmitting}
          />
        </div>
        
        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          isEditMode={isEditMode}
        />
      </form>
    </Form>
  );
};
