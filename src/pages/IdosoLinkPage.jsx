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

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          Entrar como Idoso(a)
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-slate-900 dark:text-slate-200 font-extrabold leading-relaxed">
          Digite o seu <strong className="text-emerald-900 dark:text-emerald-300 underline">Código Pessoal de Idoso</strong> :
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
