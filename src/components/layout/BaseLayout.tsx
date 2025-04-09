
import React from 'react';
import { Header } from './Header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      {/* Animated Background Elements - Conditional for Dark/Light */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Light mode subtle pattern */}
        <div className="absolute w-full h-full bg-white/50 dark:bg-transparent"></div>
        
        {/* Dark mode elements that only show in dark mode */}
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent dark:visible invisible opacity-0 dark:opacity-100 transition-opacity"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent dark:visible invisible opacity-0 dark:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent dark:visible invisible opacity-0 dark:opacity-100 transition-opacity"></div>
      </div>
      
      <Header />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
