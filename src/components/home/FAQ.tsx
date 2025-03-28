
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900 relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-slate-950/70"></div>
      <div className="container mx-auto max-w-3xl relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Perguntas Frequentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "O que é o Mark-10?",
              a: "Mark-10 é uma plataforma de gerenciamento de WhatsApp que ajuda empresas a automatizar o atendimento, enviar mensagens em massa e centralizar a comunicação com seus clientes. Nosso sistema também oferece integração com IA para respostas automáticas e personalizadas."
            },
            {
              q: "O Mark-10 é seguro?",
              a: "Sim, a segurança é nossa prioridade. Utilizamos criptografia e seguimos as melhores práticas para proteger seus dados e conversas."
            },
            {
              q: "Quantos atendentes posso ter em cada plano?",
              a: "O número de atendentes varia por plano: Básico (5), Standard (10) e Pro (20). Você pode escolher o que melhor se adapta à sua equipe."
            },
            {
              q: "Posso usar o Mark-10 para enviar mensagens em massa via WhatsApp?",
              a: "Sim, nosso Plano Pro permite o disparo de mensagens em massa, seguindo as políticas do WhatsApp para evitar bloqueios."
            },
            {
              q: "Preciso de conhecimento técnico para usar o Mark-10?",
              a: "Não, a plataforma foi desenhada para ser intuitiva e fácil de usar, mesmo para quem não tem conhecimento técnico avançado. Oferecemos também suporte para auxiliar na configuração."
            },
            {
              q: "Como funciona o cancelamento?",
              a: "Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel de controle, sem burocracia."
            }
          ].map((item, index) => (
            <AccordionItem key={index} value={`item-${index+1}`} className="border-b border-slate-800">
              <AccordionTrigger className="py-4 text-slate-200 hover:text-blue-400 text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
