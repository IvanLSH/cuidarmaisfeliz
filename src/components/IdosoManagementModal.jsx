import React, { useState, useEffect } from 'react';
import { registerIdoso, getIdososByCaregiver, getLoggedInCaregiver } from '../api';

export default function IdosoManagementModal({ isOpen, onClose, onIdosoAdded }) {
  const caregiver = getLoggedInCaregiver();
  const caregiverCode = caregiver?.code || 'CF#7X9K';
  const caregiverName = caregiver?.name || 'Cuidador Demo';

  const [idososList, setIdososList] = useState([]);
  const [name, setName] = useState('');
  const [createdIdoso, setCreatedIdoso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadIdosos();
    }
  }, [isOpen]);

  async function loadIdosos() {
    try {
      const list = await getIdososByCaregiver(caregiverCode);
      setIdososList(list);
    } catch (err) {
      console.warn('Erro ao carregar idosos:', err);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError('');
    setLoading(true);

    try {
      const newIdoso = await registerIdoso(name.trim(), caregiverCode, caregiverName);
      setCreatedIdoso(newIdoso);
      setName('');
      await loadIdosos();
      if (onIdosoAdded) onIdosoAdded(newIdoso);
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar idoso.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-blue-700 dark:border-blue-600 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-blue-800 dark:bg-blue-950 text-white px-6 py-5 border-b-4 border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-900 flex items-center justify-center font-black shadow">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black">Cadastrar Idoso</h2>
              <p className="text-xs text-blue-200 font-bold">Gere um código de acesso exclusivo para o idoso</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-blue-900 rounded-xl transition cursor-pointer font-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">

          {createdIdoso && (
            <div className="bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 rounded-2xl p-5 text-emerald-950 dark:text-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-900 dark:text-emerald-200 uppercase text-xs tracking-wider">
                  ✓ Idoso Cadastrado com Sucesso!
                </span>
                <button
                  onClick={() => setCreatedIdoso(null)}
                  className="text-xs text-emerald-800 dark:text-emerald-300 underline font-bold"
                >
                  Fechar Aviso
                </button>
              </div>

              <p className="text-lg font-black text-slate-950 dark:text-white">
                {createdIdoso.name}
              </p>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-400 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400">Código de Acesso do Idoso:</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300 tracking-wider">
                    {createdIdoso.code}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(createdIdoso.code)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer transition"
                >
                  {copiedCode ? '✓ Copiado!' : 'Copiar Código'}
                </button>
              </div>
              <p className="text-xs text-emerald-900 dark:text-emerald-200 font-bold">
                Compartilhe este código com o idoso para ele fazer login no aplicativo.
              </p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200">
                Nome do Idoso / Familiar *
              </label>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                idososList.length >= 3 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-700' 
                  : 'bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700'
              }`}>
                {idososList.length} / 3 cadastrados
              </span>
            </div>

            <input
              type="text"
              required
              disabled={idososList.length >= 3}
              placeholder={idososList.length >= 3 ? "Limite máximo de 3 idosos atingido" : "Ex: Dona Maria da Silva"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-700 rounded-xl text-base font-bold text-slate-950 dark:text-white focus:border-blue-700 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500"
            />

            {error && (
              <p className="text-xs font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950 p-2.5 rounded-lg border border-red-300 dark:border-red-800">
                {error}
              </p>
            )}

            {idososList.length >= 3 && (
              <p className="text-xs font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 p-3 rounded-xl border border-amber-400 dark:border-amber-700">
                Atenção: O plano de cuidador permite cadastrar no máximo 3 idosos vinculados.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || idososList.length >= 3}
              className="w-full py-3.5 bg-blue-800 hover:bg-blue-900 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-black text-base rounded-xl shadow-md cursor-pointer transition border border-blue-950"
            >
              {loading ? 'Gerando Código...' : idososList.length >= 3 ? 'Limite de 3 Idosos Atingido' : '+ Gerar Código e Cadastrar Idoso'}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 mb-3 uppercase tracking-wider">
              Idosos Vinculados ({idososList.length})
            </h3>

            {idososList.length === 0 ? (
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
                Nenhum idoso cadastrado ainda. Preencha o formulário acima para gerar o primeiro código.
              </p>
            ) : (
              <div className="space-y-2.5">
                {idososList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-base font-black text-slate-950 dark:text-white">{item.name}</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Código: <strong className="text-blue-900 dark:text-blue-300 font-black">{item.code}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.code)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-lg cursor-pointer border border-slate-400 dark:border-slate-600"
                    >
                      Copiar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4 border-t-2 border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-black text-sm rounded-xl cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
}
