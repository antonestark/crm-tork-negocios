
import React from 'react';

export function Testimonials() {
  return (
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
  );
}
