
import React from "react";
import { Header } from "@/components/layout/Header";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Separator } from "@/components/ui/separator";

const Planos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Planos e Preços
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha o plano ideal para o seu negócio. Todos os planos incluem acesso à nossa plataforma de gerenciamento de serviços e agendamentos.
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <SubscriptionPlans />
        
        <div className="mt-16 bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">Posso trocar de plano a qualquer momento?</h3>
              <p>Sim, você pode atualizar ou fazer downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Como funciona o período de teste?</h3>
              <p>Você pode começar com o plano gratuito e atualizar quando estiver pronto. Não há necessidade de cartão de crédito para o plano gratuito.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Há alguma taxa de configuração?</h3>
              <p>Não, não cobramos nenhuma taxa adicional de configuração além do preço mensal do plano.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Posso cancelar a qualquer momento?</h3>
              <p>Sim, você pode cancelar sua assinatura a qualquer momento e não será mais cobrado no próximo ciclo.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Planos;
