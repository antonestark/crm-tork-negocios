
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AgendamentoHeader } from "@/components/agendamento/AgendamentoHeader";
import { AgendamentoCalendar } from "@/components/agendamento/AgendamentoCalendar";
import { AgendamentoList } from "@/components/agendamento/AgendamentoList";
import { MetricasAgendamento } from "@/components/agendamento/MetricasAgendamento";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentRegistration from "@/components/agendamento/AppointmentRegistration";

const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>("calendar");

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAppointmentSuccess = (appointmentId: string) => {
    console.log(`Agendamento criado com sucesso, ID: ${appointmentId}`);
    setActiveTab("calendar");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <AgendamentoHeader 
          selectedDate={selectedDate} 
          onDateSelect={handleDateChange} 
        />
        
        <div className="mt-6">
          <MetricasAgendamento selectedDate={selectedDate} />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="register">Registrar Agendamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              <AgendamentoCalendar onDateChange={handleDateChange} />
              <AgendamentoList selectedDate={selectedDate} />
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <AppointmentRegistration 
              initialDate={selectedDate}
              onSuccess={handleAppointmentSuccess}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Agendamento;
