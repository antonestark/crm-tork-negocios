import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AgendamentoFormDialog } from "./AgendamentoFormDialog";
import { Card } from "@/components/ui/card"; // Manter Card se for usado no container
import { useSchedulingData } from "@/hooks/use-scheduling-data";
import { addDays, startOfWeek, format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import CalendarioMensal from "./CalendarioMensal";
import GradeHorariosSemanal from "./GradeHorariosSemanal"; // Importar o novo componente

export const AgendamentoExterno: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<{ start: string; end: string; date: Date } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Semana atual (segunda a domingo)
  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Busca agendamentos de todos os dias da semana visível
  // Idealmente, isso seria otimizado para buscar apenas uma vez para a semana
  // ou usar um hook que gerencie isso de forma mais eficiente.
  // Por simplicidade, vamos manter a busca por dia aqui, mas ciente da otimização.
  const bookingsByDay = weekDates.map(date => {
    const { bookings } = useSchedulingData(date); // Cada dia busca seus bookings
    return bookings;
  });

  // Dias disponíveis do mês (exemplo: todos os dias do mês)
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const availableDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handler para clique no horário (vindo da GradeHorariosSemanal)
  const handleHorarioClick = (horario: { start: string; end: string }, date: Date) => {
    setSelectedHorario({ ...horario, date });
    setDialogOpen(true);
  };

  // Handler para seleção de data (vindo do CalendarioMensal ou GradeHorariosSemanal)
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Função para passar os dados para o formulário
  const handleFormSubmit = async (data: any) => {
    // O próprio AgendamentoFormDialog já chama createBooking via onSubmit
    // Apenas retornamos para fechar o dialog se sucesso
    return data;
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-background py-8">
      <div className="w-full max-w-6xl border border-border rounded-2xl shadow-lg bg-background p-8 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold flex items-center gap-2 text-primary">
            <span className="material-icons text-primary">schedule</span>
            Agendamento Externo
          </div>
          <div className="text-sm text-muted-foreground">
            (GMT-03:00) Horário Padrão de Brasília - São Paulo
          </div>
        </div>
        <div className="flex gap-8">
          {/* Calendário mensal à esquerda */}
          <div className="flex flex-col items-center justify-center w-[320px] min-w-[260px] max-w-[340px]">
            <div className="mb-4 font-semibold text-primary text-center">Selecione um horário</div>
            <div className="rounded-2xl border border-border p-4 bg-card shadow-md w-full flex items-center justify-center">
              <CalendarioMensal
                selected={selectedDate}
                onSelect={handleDateSelect} // Usar o handler
                availableDays={availableDays}
              />
            </div>
          </div>
          {/* Grade semanal - Usar o componente reutilizável */}
          <GradeHorariosSemanal
            weekDates={weekDates}
            selectedDate={selectedDate}
            bookingsByDay={bookingsByDay}
            onHorarioClick={handleHorarioClick} // Passar o handler
            onDateSelect={handleDateSelect} // Passar o handler
          />
        </div>
      </div>
      {selectedHorario && (
        <AgendamentoFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleFormSubmit}
          selectedDate={selectedHorario.date}
          startTime={selectedHorario.start}
          endTime={selectedHorario.end}
        />
      )}
    </div>
  );
};

export default AgendamentoExterno;
