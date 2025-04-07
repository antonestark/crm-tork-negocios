
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppointmentRegistration } from '@/components/agendamento/AppointmentRegistration';
import { Loader2 } from 'lucide-react';

const AgendamentoExterno: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSuccess = (appointmentId: string) => {
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </div>
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        <Card className="w-full max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-md border-blue-900/40 shadow-xl">
          <CardHeader className="border-b border-blue-900/30 space-y-2">
            <CardTitle className="text-2xl font-bold text-white">Agendamento de Visita</CardTitle>
            <CardDescription className="text-slate-300">
              Preencha o formulário abaixo para agendar sua visita
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white">Agendamento Realizado com Sucesso!</h3>
                <p className="text-slate-300">Entraremos em contato para confirmar sua visita.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Fazer Novo Agendamento
                </button>
              </div>
            ) : (
              <AppointmentRegistration
                initialDate={new Date()}
                onSuccess={handleSuccess}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgendamentoExterno;
