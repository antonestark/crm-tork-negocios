
import { Form } from "@/components/ui/form";
import { NameField } from "./form-fields/NameField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { TypeField } from "./form-fields/TypeField";
import { StatusField } from "./form-fields/StatusField";
import { FormActions } from "./form-fields/FormActions";
import { useAreaForm, AreaSubmitData } from "./hooks/useAreaForm";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField form={form} />
        <DescriptionField form={form} />
        <TypeField form={form} areaTypes={areaTypes} loadingTypes={loadingTypes} />
        <StatusField form={form} />
        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          isEditMode={!!initialValues} 
        />
      </form>
    </Form>
  );
};
