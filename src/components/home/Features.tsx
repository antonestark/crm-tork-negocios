
import React from 'react';
import { CheckCircle2, RocketIcon } from "lucide-react";

export function Features() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900 relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-slate-800/80"></div>
      <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text Content & List */}
        <div className="animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Funcionalidades Que Fazem A Diferença
          </h2>
          <ul className="space-y-4 sm:space-y-5 text-slate-300">
            {[
              "Gestão Centralizada", 
              "Integração com Inteligência Artificial",
              "Integração com Múltiplos Sistemas",
              "Redução de Custos Operacionais",
              "Acompanhamento Contínuo de Leads",
              "Escalabilidade do Atendimento"
            ].map((item, index) => (
              <li key={index} className="flex items-center group">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition duration-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                </div>
                <span className="group-hover:text-blue-300 transition duration-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Features Image */}
        <div className="hidden md:flex justify-center animate-fade-in delay-200">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-slate-400">Mark-10 Interface</div>
                </div>
                <div className="h-48 bg-slate-900/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <RocketIcon className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-300">Plataforma Integrada de Comunicação</p>
                    <p className="text-xs text-blue-400 mt-2">Inteligência Artificial & Automação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
