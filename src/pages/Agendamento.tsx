
import { useState } from "react";
import { BaseLayout } from "@/components/layout/BaseLayout";
import { AgendamentoHeader } from "@/components/agendamento/AgendamentoHeader";
import { AgendamentoCalendar } from "@/components/agendamento/AgendamentoCalendar";
import { AgendamentoList } from "@/components/agendamento/AgendamentoList";
import { MetricasAgendamento } from "@/components/agendamento/MetricasAgendamento";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentRegistration from "@/components/agendamento/AppointmentRegistration";
import { SubscriptionBanner } from "@/components/agendamento/SubscriptionBanner";

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
    <BaseLayout>
      {/* Removed px-4, max-w-7xl, mx-auto */}
      <div className="py-6"> 
        <div className="animate-fade-in px-4"> {/* Added px-4 */}
          <AgendamentoHeader 
            selectedDate={selectedDate} 
            onDateSelect={handleDateChange} 
          />
        </div>
        
        {/* Subscription Banner Removed */}
        
        <div className="mt-6 animate-fade-in delay-100 px-4"> {/* Added px-4 */}
          <MetricasAgendamento selectedDate={selectedDate} />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 animate-fade-in delay-200 px-4"> {/* Added px-4 */}
          <TabsList className="bg-slate-900/70 backdrop-blur-md p-1 border border-blue-900/40 rounded-lg overflow-hidden">
            <TabsTrigger 
              value="calendar" 
              className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
            >
              <span className="relative z-10">Calendário</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
            >
              <span className="relative z-10">Registrar Agendamento</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-6">
              <AgendamentoCalendar onDateChange={handleDateChange} />
              <AgendamentoList selectedDate={selectedDate} />
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-6">
              <AppointmentRegistration 
                initialDate={selectedDate}
                onSuccess={handleAppointmentSuccess}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default Agendamento;
