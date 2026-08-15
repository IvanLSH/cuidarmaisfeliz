import React, { useState } from 'react';
import { validateCaregiverCode } from '../api';

export default function IdosoLinkPage({ onLinkSuccess, onBack }) {
  const [idosoName, setIdosoName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idosoName.trim()) {
      setError('Por favor, digite seu nome ou como prefere ser chamado(a).');
      return;
    }
    
    if (!code.trim()) {
      setError('Por favor, digite o código do seu cuidador.');
      return;
    }

    setLoading(true);

    try {
      const caregiver = await validateCaregiverCode(code, idosoName);
      onLinkSuccess(caregiver);
    } catch (err) {
      setError(err.message || 'Código não encontrado. Verifique com seu cuidador.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCode = () => {
    if (!idosoName) {
      setIdosoName('Dona Maria');
    }
    setCode('CF#7X9K');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl border-4 border-emerald-600 shadow-2xl p-6 sm:p-10 text-center">
        
        {/* Header Icon & Title */}
        <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-5xl font-black mx-auto mb-4 shadow-lg">
          👵
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
          Cadastro & Vinculação
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-slate-900 font-extrabold leading-relaxed">
          Preencha seu nome e digite o <strong className="text-emerald-900 underline">código de vinculação</strong> fornecido pelo seu cuidador ou familiar:
        </p>

        {/* Code & Name Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          
          {/* Nome do Idoso */}
          <div className="max-w-md mx-auto">
            <label className="block text-xl font-black text-slate-950 mb-2 text-center">
              1. Seu Nome Completo ou Apelido *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Dona Maria ou Seu João"
              value={idosoName}
              onChange={(e) => {
                setIdosoName(e.target.value);
                setError('');
              }}
              className="w-full text-center px-6 py-4 rounded-2xl border-4 border-slate-400 focus:border-emerald-600 bg-white text-slate-950 font-black text-2xl outline-none shadow-inner"
            />
          </div>

          {/* Código do Cuidador */}
          <div className="max-w-md mx-auto">
            <label className="block text-xl font-black text-slate-950 mb-2 text-center">
              2. Código do Cuidador (Ex: CF#7X9K) *
            </label>
            <input
              type="text"
              required
              placeholder="CF#7X9K"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full text-center px-6 py-4 rounded-2xl border-4 border-slate-400 focus:border-emerald-600 bg-emerald-50 text-slate-950 font-black text-3xl tracking-widest outline-none uppercase shadow-inner"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-100 border-4 border-red-500 text-red-950 rounded-2xl text-lg font-black flex items-center justify-center gap-2 text-center">
              <span className="text-2xl">⚠️</span>
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
              'Verificando...'
            ) : (
              <>
                <span>Confirmar e Entrar</span>
                <span className="text-3xl">→</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Button */}
        <div className="mt-8 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl max-w-md mx-auto">
          <p className="text-base font-extrabold text-emerald-950 mb-2">
            💡 Está testando o aplicativo?
          </p>
          <button
            type="button"
            onClick={fillDemoCode}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base rounded-xl shadow cursor-pointer border border-emerald-950"
          >
            Preencher Demo (Dona Maria / CF#7X9K)
          </button>
        </div>

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
