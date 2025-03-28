
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, RocketIcon, BarChart3, MessageSquare } from "lucide-react";

export function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-16 md:py-20 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            Transforme Sua Comunicação Em Vendas com o Mark-10
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-slate-300">
            Atendimento automatizado com IA para garantir respostas rápidas. Sua equipe pode
            atender de qualquer lugar, sem perder a produtividade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/demonstracao')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/30 border-0 rounded-full"
            >
              Agendar Demonstração
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/planos')} 
              className="border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-full"
            >
              Contratar Agora <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="hidden md:flex justify-center animate-fade-in delay-100">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-xl opacity-30"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-700/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="h-10 w-10 text-blue-400" />
                </div>
                <div className="h-24 bg-slate-700/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-10 w-10 text-indigo-400" />
                </div>
                <div className="col-span-2 h-32 bg-slate-700/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <RocketIcon className="h-12 w-12 text-purple-400 mb-2" />
                    <span className="text-gray-300 text-sm">Interface IA</span>
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
