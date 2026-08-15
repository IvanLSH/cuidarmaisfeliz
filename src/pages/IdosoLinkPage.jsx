import React, { useState } from 'react';
import { validateIdosoCode } from '../api';

export default function IdosoLinkPage({ onLinkSuccess, onBack }) {
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl border-4 border-emerald-600 shadow-2xl p-6 sm:p-10 text-center">
        
        {/* Header Icon & Title */}
        <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black mx-auto mb-4 shadow-lg">
          <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
          Entrar como Idoso(a)
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-slate-900 font-extrabold leading-relaxed">
          Digite o seu <strong className="text-emerald-900 underline">Código Pessoal de Idoso</strong> gerado pelo seu cuidador para entrar:
        </p>

        {/* Code Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          
          {/* Código do Idoso */}
          <div className="max-w-md mx-auto">
            <label className="block text-xl font-black text-slate-950 mb-2 text-center">
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
              className="w-full text-center px-6 py-5 rounded-2xl border-4 border-slate-400 focus:border-emerald-600 bg-emerald-50 text-slate-950 font-black text-3xl tracking-widest outline-none uppercase shadow-inner"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-100 border-4 border-red-500 text-red-950 rounded-2xl text-lg font-black flex items-center justify-center gap-2 text-center">
              <svg className="w-6 h-6 text-red-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
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



        {/* Back Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onBack}
            className="text-lg font-black text-slate-700 hover:text-slate-950 cursor-pointer underline"
          >
            ← Voltar à escolha de perfil
          </button>
        </div>

      </div>
    </div>
  );
}
