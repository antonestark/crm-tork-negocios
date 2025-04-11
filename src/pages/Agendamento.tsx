
import { useState, useMemo } from "react"; // Manter apenas uma importação
import { BaseLayout } from "@/components/layout/BaseLayout";
import { AgendamentoHeader } from "@/components/agendamento/AgendamentoHeader";
import { MetricasAgendamento } from "@/components/agendamento/MetricasAgendamento";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentRegistration from "@/components/agendamento/AppointmentRegistration";
import CalendarioMensal from "@/components/agendamento/CalendarioMensal"; // Importar CalendarioMensal
import GradeHorariosSemanal from "@/components/agendamento/GradeHorariosSemanal"; // Importar GradeHorariosSemanal
import { AgendamentoFormDialog } from "@/components/agendamento/AgendamentoFormDialog"; // Importar Dialog
import { useSchedulingData } from "@/hooks/use-scheduling-data"; // Importar hook
import { addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"; // Importar date-fns

const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Usar Date, não Date | undefined
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<{ start: string; end: string; date: Date } | null>(null);

  // Semana atual (segunda a domingo)
  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Busca agendamentos de todos os dias da semana visível
  const bookingsByDay = weekDates.map(date => {
    const { bookings } = useSchedulingData(date);
    return bookings;
  });

  // Dias disponíveis do mês (exemplo: todos os dias do mês)
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const availableDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateChange = (date: Date) => { // Ajustar tipo para Date
    setSelectedDate(date);
  };

  const handleHorarioClick = (horario: { start: string; end: string }, date: Date) => {
    setSelectedHorario({ ...horario, date });
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    // A lógica de criação já está no hook useSchedulingData, que é usado pelo dialog
    // Apenas precisamos fechar o dialog no sucesso
    setDialogOpen(false); // Fechar dialog após submit (o dialog já mostra toast)
    return data; // Retornar dados pode ser útil
  };

  const handleAppointmentSuccess = (appointmentId: string) => {
    console.log(`Agendamento criado com sucesso (via Registrar), ID: ${appointmentId}`);
    // Não precisa mudar de aba aqui, pois já estamos na aba correta
  };

  return (
    <BaseLayout>
      <div className="py-6">
        <div className="animate-fade-in px-4">
          <AgendamentoHeader
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
          />
        </div>

        <div className="mt-6 animate-fade-in delay-100 px-4">
          <MetricasAgendamento selectedDate={selectedDate} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 animate-fade-in delay-200 px-4">
          <TabsList className="bg-muted/70 dark:bg-slate-900/70 backdrop-blur-md p-1 border border-border rounded-lg overflow-hidden">
            <TabsTrigger
              value="calendar"
              className="relative data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-blue-950 dark:data-[state=active]:to-indigo-950 data-[state=active]:text-primary-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:border-blue-500 text-muted-foreground dark:text-slate-400 transition-all duration-300"
            >
              <span className="relative z-10">Calendário</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="relative data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-blue-950 dark:data-[state=active]:to-indigo-950 data-[state=active]:text-primary-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:border-blue-500 text-muted-foreground dark:text-slate-400 transition-all duration-300"
            >
              <span className="relative z-10">Registrar Agendamento</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            {/* Usar a nova estrutura com CalendarioMensal e GradeHorariosSemanal */}
            <div className="flex gap-8 bg-card dark:bg-[#0a1627] border border-border rounded-lg p-6 shadow-lg">
              {/* Calendário mensal à esquerda */}
              <div className="flex flex-col items-center justify-center w-[320px] min-w-[260px] max-w-[340px]">
                <div className="rounded-lg border border-border p-4 bg-card dark:bg-[#101c36] shadow-md w-full flex items-center justify-center">
                  <CalendarioMensal
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    availableDays={availableDays}
                  />
                </div>
              </div>
              {/* Grade semanal */}
              <GradeHorariosSemanal
                weekDates={weekDates}
                selectedDate={selectedDate}
                bookingsByDay={bookingsByDay}
                onHorarioClick={handleHorarioClick}
                onDateSelect={handleDateChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="bg-card dark:bg-[#0a1627] border border-border rounded-lg p-6 shadow-lg">
              <AppointmentRegistration
                initialDate={selectedDate}
                onSuccess={handleAppointmentSuccess}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Dialog para agendamento via clique na grade */}
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
    </BaseLayout>
  );
};

export default Agendamento;
