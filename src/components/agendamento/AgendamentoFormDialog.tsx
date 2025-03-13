
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isValid, parse, format } from 'date-fns';
import { BookingEvent } from '@/hooks/use-scheduling-data';
import { toast } from 'sonner';
import { AgendamentoFormFields } from './AgendamentoFormFields';
import { AgendamentoFormValues, createBookingData } from './schema';

interface AgendamentoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<BookingEvent, 'id' | 'date'>) => Promise<any>;
  selectedDate?: Date;
}

export const AgendamentoFormDialog: React.FC<AgendamentoFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  selectedDate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AgendamentoFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate the date and time formats
      const dateStr = format(values.date, 'yyyy-MM-dd');
      const startDateTime = parse(`${dateStr} ${values.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDateTime = parse(`${dateStr} ${values.end_time}`, 'yyyy-MM-dd HH:mm', new Date());
      
      if (!isValid(startDateTime) || !isValid(endDateTime)) {
        throw new Error('Data ou hora inválida');
      }
      
      // Create booking data object to submit
      const bookingData = createBookingData(values);
      
      // Try to submit and handle success/failure
      const result = await onSubmit(bookingData);
      
      if (result) {
        onOpenChange(false);
        toast.success("Agendamento criado com sucesso");
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      // Check for specific database constraint errors
      if (error.message?.includes('conflito com outro agendamento')) {
        toast.error("Este horário já está reservado. Por favor, escolha outro horário.");
      } else if (error.message?.includes('check_end_after_start')) {
        toast.error("O horário de término deve ser posterior ao horário de início.");
      } else if (error.message?.includes('validate_customer_id')) {
        toast.error("ID do cliente inválido. Deve ser numérico.");
      } else if (error.message?.includes('Já existe um agendamento confirmado para este email')) {
        toast.error("Já existe um agendamento confirmado para este email na mesma data.");
      } else if (error.message?.includes('Já existe um agendamento confirmado para este telefone')) {
        toast.error("Já existe um agendamento confirmado para este telefone na mesma data.");
      } else {
        toast.error(error.message || "Erro ao criar agendamento. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <AgendamentoFormFields 
          onSubmit={handleSubmit}
          selectedDate={selectedDate}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
