import React from 'react';

export default function Hero({ onNavigate }) {
  return (
    <section id="inicio" className="py-16 sm:py-24 bg-slate-50 border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-6 border-2 border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Plataforma de Atenção ao Idoso
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
          Cuidado, Saúde e Bem-Estar para a{' '}
          <span className="text-emerald-700 underline decoration-emerald-500 decoration-4">
            Melhor Idade
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-800 max-w-2xl mx-auto font-bold leading-relaxed">
          Guia de exercícios em vídeo, controle simples de medicamentos e divulgação de eventos comunitários — tudo em um só lugar.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('exercises')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-lg shadow-md transition-all text-center cursor-pointer border-2 border-red-950"
          >
            Ver Exercícios
          </button>
          <button
            onClick={() => onNavigate('medications')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-lg shadow-md transition-all text-center cursor-pointer border-2 border-blue-950"
          >
            Meus Remédios
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-lg shadow-md transition-all text-center cursor-pointer border-2 border-purple-950"
          >
            Ver Eventos
          </button>
        </div>
      </div>
    </section>
  );
}
