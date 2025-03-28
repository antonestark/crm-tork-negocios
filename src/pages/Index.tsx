
import React from 'react';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  RocketIcon, 
  BarChart3, 
  Heart, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight 
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-x-hidden no-scrollbar">
      <AuthHeader hideNavigation={true} />

      {/* Hero Section */}
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

      {/* Benefícios Section */}
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

      {/* Funcionalidades Section */}
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
      
      {/* Depoimentos Section */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Veja O Que Dizem Nossos Clientes
          </h2>
          <p className="text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto">
            Milhares de empresas já transformaram sua comunicação com o Mark-10. Confira como nossa plataforma tem revolucionado o atendimento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Depoimento 1 */}
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm text-left transition-all duration-300 hover:bg-slate-700/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 italic mb-4">
                "Agora podemos enviar promoções e novidades para todos os nossos contatos em questão de minutos. A plataforma é muito intuitiva e o suporte é excelente."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mr-4 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">RS</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Renata Souza</p>
                  <p className="text-sm text-blue-400">Diretora de Marketing</p>
                </div>
              </div>
            </div>
            {/* Depoimento 2 */}
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm text-left transition-all duration-300 hover:bg-slate-700/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 italic mb-4">
                "Com os chatbots 24h, conseguimos reduzir o tempo de resposta e aumentar nossa taxa de conversão em mais de 30%. O Mark-10 tornou nosso atendimento mais eficiente e profissional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mr-4 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">LM</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Lucas Martins</p>
                  <p className="text-sm text-purple-400">Gestor de Vendas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
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

      {/* FAQ Section */}
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

      {/* Footer Section */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-900/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-0 w-80 h-80 bg-indigo-900/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Mark-10</h3>
            <p className="text-sm max-w-md mx-auto">
              Transformando a comunicação digital para empresas de todos os tamanhos com automação inteligente.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="#" className="text-sm hover:text-blue-400 transition-colors">Termos de Uso</a>
            <a href="#" className="text-sm hover:text-blue-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="text-sm hover:text-blue-400 transition-colors">Suporte</a>
            <a href="#" className="text-sm hover:text-blue-400 transition-colors">Contato</a>
          </div>
          <div className="text-xs">
            <p className="mb-2">Mark-10 não possui qualquer relação com as marcas Meta Inc, WhatsApp Inc.</p>
            <p>&copy; {new Date().getFullYear()} Mark-10 | Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
