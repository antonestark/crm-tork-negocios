
import { Header } from "@/components/layout/Header";
import { AgendamentoHeader } from "@/components/agendamento/AgendamentoHeader";
import { AgendamentoCalendar } from "@/components/agendamento/AgendamentoCalendar";
import { AgendamentoList } from "@/components/agendamento/AgendamentoList";
import { MetricasAgendamento } from "@/components/agendamento/MetricasAgendamento";

const Agendamento = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <AgendamentoHeader />
        <div className="mt-6">
          <MetricasAgendamento />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <AgendamentoCalendar />
          <AgendamentoList />
        </div>
      </main>
    </div>
  );
};

export default Agendamento;
