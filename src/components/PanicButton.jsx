import React, { useState } from 'react';
import { triggerPanicAlert, getLinkedCaregiver, getLoggedInIdoso, getIdosoName } from '../api';

export default function PanicButton({ userRole }) {
  const isIdoso = userRole === 'idoso';
  const [sending, setSending] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);

  if (!isIdoso) return null;

  const linkedCaregiver = getLinkedCaregiver();
  const loggedInIdoso = getLoggedInIdoso();
  const idosoName = getIdosoName();

  const handlePanicClick = async () => {
    if (!linkedCaregiver?.code) {
      alert('Atenção: Nenhum cuidador vinculado a este perfil de idoso.');
      return;
    }

    setSending(true);
    try {
      await triggerPanicAlert(
        linkedCaregiver.code,
        loggedInIdoso?.code || 'ID-UNKNOWN',
        idosoName || 'Idoso'
      );
      setSentAlert(true);
    } catch (err) {
      console.warn('Erro ao acionar botão de pânico:', err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Panic SOS Button for Idosos */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handlePanicClick}
          disabled={sending}
          className="px-6 py-4 rounded-3xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xl shadow-2xl border-4 border-red-950 flex items-center gap-3 cursor-pointer transition animate-bounce hover:animate-none"
        >
          <div className="w-8 h-8 rounded-full bg-white text-red-700 flex items-center justify-center font-black text-lg shadow shrink-0">
            🚨
          </div>
          <span>{sending ? 'Enviando...' : 'PÂNICO'}</span>
        </button>
      </div>

      {/* Confirmation Modal for Idoso */}
      {sentAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-red-600 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black mx-auto text-3xl shadow">
              🚨
            </div>
            <h3 className="text-2xl font-black text-red-700">
              ALERTA DE PÂNICO ENVIADO!
            </h3>
            <p className="text-slate-900 font-extrabold text-lg leading-relaxed">
              O seu alarme de emergência foi enviado para o seu cuidador (<strong className="underline">{linkedCaregiver?.name || 'Cuidador'}</strong>).
            </p>
            <p className="text-sm font-bold text-slate-600 bg-red-50 p-3 rounded-xl border border-red-200">
              O alarme sonoro está tocando no dispositivo do cuidador até que ele venha lhe atender.
            </p>
            <button
              onClick={() => setSentAlert(false)}
              className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-black text-lg rounded-xl shadow cursor-pointer transition border border-red-950"
            >
              OK, Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
