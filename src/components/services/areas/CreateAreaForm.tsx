
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAreaForm, AreaSubmitData } from "./hooks/useAreaForm";
import { NameField } from "./form-fields/NameField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { StatusField } from "./form-fields/StatusField";
import { TypeField } from "./form-fields/TypeField";
import { FormActions } from "./form-fields/FormActions";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField form={form} />
        <DescriptionField form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusField form={form} />
          <TypeField 
            form={form} 
            areaTypes={areaTypes} 
            loadingTypes={loadingTypes} 
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
