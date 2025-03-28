
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from "lucide-react";

export function PricingPlans() {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950 relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-slate-900/70"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Planos Perfeitos Para Suas Necessidades
        </h2>
        <p className="text-slate-400 mb-8 md:mb-12 max-w-xl mx-auto">
          Escolha o plano que mais se adapta ao seu negócio e comece a transformar sua comunicação hoje mesmo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Plano Básico */}
          <div className="bg-slate-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
            <div className="p-1 bg-gradient-to-r from-blue-400/50 to-blue-500/50"></div>
            <div className="p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 tracking-wider">PLANO BÁSICO</h3>
              <p className="text-4xl font-bold mb-1 text-white">R$99<span className="text-2xl">,90</span><span className="text-lg font-normal text-slate-400">/Mês</span></p>
              <ul className="space-y-3 text-slate-300 my-6 text-left flex-grow">
                {[
                  "5 atendentes",
                  "1 conexão de WhatsApp",
                  "Gestão centralizada de contatos",
                  "Chatbot para autoatendimento 24h",
                  "Integração com IA para análise de dados"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 mt-auto rounded-full" 
                onClick={() => navigate('/planos/basico')}
              >
                ESCOLHER PLANO <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Plano Standard (Destaque) */}
          <div className="bg-gradient-to-b from-slate-800/60 to-slate-800/90 rounded-xl backdrop-blur-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5"></div>
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">MAIS POPULAR</span>
            <div className="p-6 md:p-8 relative z-10 flex flex-col h-full">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 tracking-wider mt-4">PLANO STANDARD</h3>
              <p className="text-4xl font-bold mb-1 text-white">R$159<span className="text-2xl">,90</span><span className="text-lg font-normal text-slate-400">/Mês</span></p>
              <ul className="space-y-3 text-slate-300 my-6 text-left flex-grow">
                {[
                  "10 atendentes",
                  "1 conexão de WhatsApp",
                  "Chatbot inteligente para autoatendimento",
                  "IA para respostas automáticas e personalizadas",
                  "Relatórios avançados de desempenho"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white mt-auto shadow-lg shadow-blue-500/20 border-0 rounded-full" 
                onClick={() => navigate('/planos/standard')}
              >
                ESCOLHER PLANO <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Plano Pro */}
          <div className="bg-slate-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col">
            <div className="p-1 bg-gradient-to-r from-indigo-400/50 to-indigo-500/50"></div>
            <div className="p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2 tracking-wider">PLANO PRO</h3>
              <p className="text-4xl font-bold mb-1 text-white">R$269<span className="text-2xl">,90</span><span className="text-lg font-normal text-slate-400">/Mês</span></p>
              <ul className="space-y-3 text-slate-300 my-6 text-left flex-grow">
                {[
                  "20 atendentes",
                  "1 conexão de WhatsApp",
                  "Painel de atendimento integrado",
                  "Disparos de mensagens em massa",
                  "IA avançada para personalização"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 mt-auto rounded-full" 
                onClick={() => navigate('/planos/pro')}
              >
                ESCOLHER PLANO <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
