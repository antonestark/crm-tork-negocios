
import React from "react";
import { BaseLayout } from "@/components/layout/BaseLayout";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Separator } from "@/components/ui/separator";

const Planos = () => {
  return (
    <BaseLayout>
      {/* Removed px-4, max-w-7xl, mx-auto */}
      <div className="py-6"> 
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in px-4"> {/* Added px-4 */}
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            Planos e Preços
          </h1>
          <p className="text-xl text-blue-100/80">
            Escolha o plano ideal para o seu negócio. Todos os planos incluem acesso à nossa plataforma de gerenciamento de serviços e agendamentos.
          </p>
        </div>
        
        <Separator className="my-6 bg-blue-900/40 mx-4" /> {/* Added mx-4 */}
        
        <div className="animate-fade-in delay-100 px-4"> {/* Added px-4 */}
          <SubscriptionPlans />
        </div>
        
        <div className="mt-16 bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-8 animate-fade-in delay-200 mx-4"> {/* Added mx-4 */}
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-100">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div className="bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-300">Posso trocar de plano a qualquer momento?</h3>
              <p>Sim, você pode atualizar ou fazer downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.</p>
            </div>
            <div className="bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-300">Como funciona o período de teste?</h3>
              <p>Você pode começar com o plano gratuito e atualizar quando estiver pronto. Não há necessidade de cartão de crédito para o plano gratuito.</p>
            </div>
            <div className="bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-300">Há alguma taxa de configuração?</h3>
              <p>Não, não cobramos nenhuma taxa adicional de configuração além do preço mensal do plano.</p>
            </div>
            <div className="bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-300">Posso cancelar a qualquer momento?</h3>
              <p>Sim, você pode cancelar sua assinatura a qualquer momento e não será mais cobrado no próximo ciclo.</p>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Planos;
