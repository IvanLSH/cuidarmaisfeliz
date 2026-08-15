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
      <div className="bg-white rounded-3xl border-4 border-blue-700 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-800 text-white px-6 py-5 border-b-4 border-blue-950 flex items-center justify-between">
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

          {/* Newly Created Success Banner */}
          {createdIdoso && (
            <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-5 text-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-900 uppercase text-xs tracking-wider">
                  ✓ Idoso Cadastrado com Sucesso!
                </span>
                <button
                  onClick={() => setCreatedIdoso(null)}
                  className="text-xs text-emerald-800 underline font-bold"
                >
                  Fechar Aviso
                </button>
              </div>

              <p className="text-lg font-black text-slate-950">
                {createdIdoso.name}
              </p>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-400 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-600">Código de Acesso do Idoso:</p>
                  <p className="text-2xl font-black text-emerald-900 tracking-wider">
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
              <p className="text-xs text-emerald-900 font-bold">
                Compartilhe este código com o idoso para ele fazer login no aplicativo.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-1">
                Nome do Idoso
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Dona Maria da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-400 rounded-xl text-base font-bold text-slate-950 focus:border-blue-700 outline-none"
              />
            </div>

            {error && (
              <p className="text-xs font-black text-red-700 bg-red-100 p-2.5 rounded-lg border border-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-800 hover:bg-blue-900 text-white font-black text-base rounded-xl shadow-md cursor-pointer transition border border-blue-950"
            >
              {loading ? 'Gerando Código...' : '+ Gerar Código e Cadastrar Idoso'}
            </button>
          </form>

          {/* Registered Idosos List */}
          <div className="pt-4 border-t-2 border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
              Idosos Vinculados ({idososList.length})
            </h3>

            {idososList.length === 0 ? (
              <p className="text-xs font-bold text-slate-600 bg-slate-100 p-4 rounded-xl text-center">
                Nenhum idoso cadastrado ainda. Preencha o formulário acima para gerar o primeiro código.
              </p>
            ) : (
              <div className="space-y-2.5">
                {idososList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-base font-black text-slate-950">{item.name}</p>
                      <p className="text-xs font-bold text-slate-600">
                        Código: <strong className="text-blue-900 font-black">{item.code}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.code)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs rounded-lg cursor-pointer border border-slate-400"
                    >
                      Copiar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t-2 border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-black text-sm rounded-xl cursor-pointer hover:bg-slate-800"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
}
