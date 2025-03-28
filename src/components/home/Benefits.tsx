
import React from 'react';
import { RocketIcon, BarChart3, Heart } from "lucide-react";

export function Benefits() {
  return (
    <section className="py-16 md:py-20 px-4 relative">
      <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Benefícios Revolucionários
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {/* Benefício 1: Eficiência */}
          <div className="flex flex-col items-center p-6 bg-slate-800/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
              <RocketIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Aumento de Eficiência</h3>
            <p className="text-slate-400 text-sm">
              Automatize o atendimento com chatbots 24h e centralize sua comunicação, permitindo que sua equipe
              foque em tarefas estratégicas.
            </p>
          </div>
          {/* Benefício 2: Análise */}
          <div className="flex flex-col items-center p-6 bg-slate-800/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/20">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Análise e Otimização</h3>
            <p className="text-slate-400 text-sm">
              Relatórios detalhados e monitoramento em tempo real para acompanhar o desempenho das
              campanhas e ajustar estratégias.
            </p>
          </div>
          {/* Benefício 3: Atendimento */}
          <div className="flex flex-col items-center p-6 bg-slate-800/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-cyan-500/20">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Melhoria no Atendimento</h3>
            <p className="text-slate-400 text-sm">
              Integração com IA permite respostas mais rápidas e personalizadas, aumentando a satisfação do cliente
              e gerando mais vendas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
