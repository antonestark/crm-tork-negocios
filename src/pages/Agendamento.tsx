
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AgendamentoHeader } from "@/components/agendamento/AgendamentoHeader";
import { AgendamentoCalendar } from "@/components/agendamento/AgendamentoCalendar";
import { AgendamentoList } from "@/components/agendamento/AgendamentoList";
import { MetricasAgendamento } from "@/components/agendamento/MetricasAgendamento";

const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <AgendamentoHeader selectedDate={selectedDate} onDateSelect={handleDateChange} />
        <div className="mt-6">
          <MetricasAgendamento selectedDate={selectedDate} />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <AgendamentoCalendar onDateChange={handleDateChange} />
          <AgendamentoList selectedDate={selectedDate} />
        </div>
      </main>
    </div>
  );
};

export default Agendamento;
