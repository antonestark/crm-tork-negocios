import React from "react";
import AgendamentoExterno from "@/components/agendamento/AgendamentoExterno";
// Remover import do ThemeToggle

const AgendamentoExternoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full py-6 flex justify-center items-center bg-transparent px-6"> {/* Centralizar novamente */}
        {/* Remover classes dark: */}
        <span className="text-3xl font-bold text-primary select-none" style={{ letterSpacing: 1 }}>
          Tork Negócios
        </span>
        {/* Remover o botão de toggle */}
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <AgendamentoExterno />
      </main>
    </div>
  );
};

export default AgendamentoExternoPage;
