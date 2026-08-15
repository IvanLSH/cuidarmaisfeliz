import React from 'react';

export default function RoleSelectionPage({ onSelectRole, darkMode, onToggleDarkMode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-2xl p-6 sm:p-10 text-center relative">
        
        {/* Dark mode toggle top right */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            className="absolute top-6 right-6 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
          >
            <svg className="w-4 h-4 text-amber-500 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {darkMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
            <span>{darkMode ? 'Claro' : 'Escuro'}</span>
          </button>
        )}

        {/* Logo & Welcome */}
        <div className="w-18 h-18 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold mx-auto mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.646a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Bem-vindo ao Cuidado+Feliz
        </h1>
        
        <p className="mt-3 text-lg font-bold text-slate-800 dark:text-slate-300 max-w-lg mx-auto">
          Para personalizar sua experiência, por favor selecione quem utilizará este dispositivo:
        </p>

        {/* Selection Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Option: Idoso */}
          <button
            onClick={() => onSelectRole('idoso')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-4 shadow-md">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition-colors">
                Sou Idoso(a)
              </h2>
              <p className="mt-3 text-slate-900 dark:text-slate-200 text-base font-bold leading-relaxed">
                Interface com <strong className="text-emerald-900 dark:text-emerald-300 underline">letras maiores</strong>, botões destacados e navegação super simples e acessível.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-emerald-900 dark:text-emerald-300 font-black text-xl">
              <span>Entrar como Idoso</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* Option: Cuidador */}
          <button
            onClick={() => onSelectRole('cuidador')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-950 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center mb-4 shadow-md">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                Sou Cuidador(a)
              </h2>
              <p className="mt-3 text-slate-900 dark:text-slate-200 text-base font-bold leading-relaxed">
                Modo completo para gerenciar medicamentos, acompanhar rotinas de exercícios e eventos comunitários.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-blue-300 dark:border-blue-700 flex items-center justify-between text-blue-900 dark:text-blue-300 font-black text-xl">
              <span>Entrar como Cuidador</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>

        <p className="mt-8 text-sm font-bold text-slate-700 dark:text-slate-400">
          Você poderá alterar seu perfil a qualquer momento no botão superior do aplicativo.
        </p>
      </div>
    </div>
  );
}
