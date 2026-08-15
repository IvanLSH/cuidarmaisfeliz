import React from 'react';

export default function RoleSelectionPage({ onSelectRole, darkMode, onToggleDarkMode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-2xl p-6 sm:p-10 text-center relative">
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Bem-vindo ao Cuidar+Feliz
        </h1>
        
        <p className="mt-3 text-lg font-bold text-slate-800 dark:text-slate-300 max-w-lg mx-auto">
          Por favor selecione quem utilizará este dispositivo:
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <button
            onClick={() => onSelectRole('idoso')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition-colors">
                Sou Idoso(a)
              </h2>
              <p className="mt-3 text-slate-900 dark:text-slate-200 text-base font-bold leading-relaxed">
                Interface com <strong className="text-emerald-900 dark:text-emerald-300 underline">letras maiores</strong>, botões destacados e navegação simples e acessível.
              </p>
            </div>
            
          </button>

          <button
            onClick={() => onSelectRole('cuidador')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-950 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                Sou Cuidador(a)
              </h2>
              <p className="mt-3 text-slate-900 dark:text-slate-200 text-base font-bold leading-relaxed">
                Modo para gerenciar medicamentos, acompanhar rotinas de exercícios e eventos.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
