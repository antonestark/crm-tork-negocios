
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AgendamentoFormValues } from './schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentFormFields from './AppointmentFormFields';
import { registerAppointment } from '@/services/appointment-service';

interface AppointmentRegistrationProps {
  initialDate?: Date;
  onSuccess?: (appointmentId: string) => void;
}

export const AppointmentRegistration: React.FC<AppointmentRegistrationProps> = ({
  initialDate = new Date(),
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AgendamentoFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Register the appointment using the service
      const result = await registerAppointment(values);
      
      if (result.success) {
        toast.success(result.message);
        if (onSuccess && result.id) {
          onSuccess(result.id);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast.error(error.message || "Erro ao criar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Remove the Card wrapper, as the parent page already provides a styled container
    // <Card className="w-full max-w-2xl mx-auto">
    //   <CardHeader>
    //     <CardTitle>Registrar Novo Agendamento</CardTitle>
    //   </CardHeader>
    //   <CardContent>
        <AppointmentFormFields
          initialValues={{ date: initialDate }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
    //   </CardContent>
    // </Card>
  );
};

export default AppointmentRegistration;
