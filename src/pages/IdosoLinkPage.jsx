import React, { useState } from 'react';
import { validateIdosoCode } from '../api';

export default function IdosoLinkPage({ onLinkSuccess, onBack, darkMode, onToggleDarkMode }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Por favor, digite seu código de idoso.');
      return;
    }

    setLoading(true);

    try {
      const idosoUser = await validateIdosoCode(code);
      onLinkSuccess(idosoUser);
    } catch (err) {
      setError(err.message || 'Código não encontrado. Solicite o código ao seu cuidador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border-4 border-emerald-600 dark:border-emerald-500 shadow-2xl p-6 sm:p-10 text-center relative">
        
        {/* Dark Mode toggle top right */}
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

        <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black mx-auto mb-4 shadow-lg">
          <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          Entrar como Idoso(a)
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-slate-900 dark:text-slate-200 font-extrabold leading-relaxed">
          Digite o seu <strong className="text-emerald-900 dark:text-emerald-300 underline">Código Pessoal de Idoso</strong> gerado pelo seu cuidador para entrar:
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          
          <div className="max-w-md mx-auto">
            <label className="block text-xl font-black text-slate-950 dark:text-white mb-2 text-center">
              Seu Código (Ex: ID#9K2P) *
            </label>
            <input
              type="text"
              required
              placeholder="ID#9K2P"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full text-center px-6 py-5 rounded-2xl border-4 border-slate-400 dark:border-slate-700 focus:border-emerald-600 bg-emerald-50 dark:bg-slate-800 text-slate-950 dark:text-white font-black text-3xl tracking-widest outline-none uppercase shadow-inner"
            />
          </div>

          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-100 dark:bg-red-950 border-4 border-red-500 text-red-950 dark:text-red-200 rounded-2xl text-lg font-black flex items-center justify-center gap-2 text-center">
              <svg className="w-6 h-6 text-red-700 dark:text-red-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-md mx-auto py-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-black text-2xl shadow-xl transition cursor-pointer border-4 border-emerald-950 flex items-center justify-center gap-3"
          >
            {loading ? (
              'Entrando...'
            ) : (
              <>
                <span>Entrar no Aplicativo</span>
                <span className="text-3xl">→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <button
            type="button"
            onClick={onBack}
            className="text-lg font-black text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer underline"
          >
            ← Voltar à escolha de perfil
          </button>
        </div>

      </div>
    </div>
  );
}
