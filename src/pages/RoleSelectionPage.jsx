import React from 'react';

export default function RoleSelectionPage({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl border-2 border-slate-300 shadow-2xl p-6 sm:p-10 text-center">
        {/* Logo & Welcome */}
        <div className="w-18 h-18 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
          👵
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Bem-vindo ao Cuidado+Feliz
        </h1>
        
        <p className="mt-3 text-lg font-bold text-slate-800 max-w-lg mx-auto">
          Para personalizar sua experiência, por favor selecione quem utilizará este dispositivo:
        </p>

        {/* Selection Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Option: Idoso */}
          <button
            onClick={() => onSelectRole('idoso')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-4xl mb-4 shadow-md">
                👵
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 group-hover:text-emerald-900 transition-colors">
                Sou Idoso(a)
              </h2>
              <p className="mt-3 text-slate-900 text-base font-bold leading-relaxed">
                Interface com <strong className="text-emerald-900 underline">letras maiores</strong>, botões destacados e navegação super simples e acessível.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t-2 border-emerald-300 flex items-center justify-between text-emerald-900 font-black text-xl">
              <span>Entrar como Idoso</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* Option: Cuidador */}
          <button
            onClick={() => onSelectRole('cuidador')}
            className="group p-6 sm:p-8 rounded-2xl border-4 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl text-left"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-4xl mb-4 shadow-md">
                🧑‍⚕️
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 group-hover:text-blue-900 transition-colors">
                Sou Cuidador(a)
              </h2>
              <p className="mt-3 text-slate-900 text-base font-bold leading-relaxed">
                Modo completo para gerenciar medicamentos, acompanhar rotinas de exercícios e eventos comunitários.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-blue-300 flex items-center justify-between text-blue-900 font-black text-xl">
              <span>Entrar como Cuidador</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>

        <p className="mt-8 text-sm font-bold text-slate-700">
          Você poderá alterar seu perfil a qualquer momento no botão superior do aplicativo.
        </p>
      </div>
    </div>
  );
}
