import React from 'react';

export default function Footer({ onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'exercises', label: 'Exercícios' },
    { id: 'medications', label: 'Medicamentos' },
    { id: 'events', label: 'Eventos' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-200 py-12 border-t-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo / Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
              👵
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Cuidado+Feliz
            </span>
          </button>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-base font-bold">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="hover:text-emerald-400 text-slate-200 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm font-semibold text-slate-400">
            &copy; {new Date().getFullYear()} Cuidado+Feliz. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
