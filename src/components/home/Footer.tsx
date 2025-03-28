
import React from 'react';

export function Footer() {
  return (
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
  );
}
