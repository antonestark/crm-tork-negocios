
import React from 'react';
import { UserNav } from '@/components/auth/UserNav';
import { useLocation } from 'react-router-dom';

interface Link {
  href: string;
  label: string;
}

export const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links: Link[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leads', label: 'Leads' },
    { href: '/demands', label: 'Demandas' },
    { href: '/services', label: 'Serviços' },
  ];

  return (
    <header className="w-full px-6 py-4 bg-slate-900/90 backdrop-blur-lg border-b border-blue-900/40 flex items-center justify-between animate-fade-in shadow-[0_0_20px_rgba(56,189,248,0.2)]">
      <div className="relative z-10">
        {/* Neon glow effect on the logo */}
        <a href="/" className="font-bold text-xl bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          NextGenUX
        </a>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Keep existing nav items but apply the futuristic styling */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="text-slate-300 hover:text-cyan-400 transition-colors relative group"
            >
              {link.href === currentPath && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
              )}
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
            </a>
          ))}
        </nav>
        
        {/* Apply futuristic styling to user nav */}
        <UserNav className="z-10" />
      </div>
      
      {/* Add subtle animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
      </div>
    </header>
  );
};
