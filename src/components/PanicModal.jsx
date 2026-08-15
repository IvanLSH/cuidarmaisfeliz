import React, { useState, useEffect, useRef } from 'react';
import { getActivePanicAlert, dismissPanicAlert, getLoggedInCaregiver } from '../api';
import { alarmSound } from '../utils/audioAlert';

export default function PanicModal({ userRole }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const isIdoso = userRole === 'idoso';
  const caregiver = getLoggedInCaregiver();

  const pollingRef = useRef(null);

  useEffect(() => {
    // Only caregivers receive panic alerts
    if (isIdoso || !caregiver?.code) {
      if (activeAlert) {
        alarmSound.stop();
        setActiveAlert(null);
      }
      return;
    }

    const checkAlert = async () => {
      try {
        const alert = await getActivePanicAlert(caregiver.code);
        if (alert) {
          if (!activeAlert) {
            setActiveAlert(alert);
            alarmSound.start();
          }
        } else {
          if (activeAlert) {
            alarmSound.stop();
            setActiveAlert(null);
          }
        }
      } catch (err) {
        console.warn('Erro ao verificar alerta de pânico:', err.message);
      }
    };

    checkAlert();
    pollingRef.current = setInterval(checkAlert, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      alarmSound.stop();
    };
  }, [isIdoso, caregiver?.code]);

  const handleDismiss = async () => {
    alarmSound.stop();
    if (activeAlert) {
      await dismissPanicAlert(activeAlert.id, caregiver?.code);
    }
    setActiveAlert(null);
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-pulse">
      <div className="bg-white rounded-3xl border-8 border-red-600 shadow-2xl max-w-lg w-full overflow-hidden text-center p-6 sm:p-8 space-y-6">
        
        {/* Flashing Siren Icon */}
        <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title & Warning */}
        <div>
          <span className="px-4 py-1.5 bg-red-100 text-red-900 border-2 border-red-400 font-black text-xs uppercase tracking-widest rounded-full">
            🚨 ALERTA DE EMERGÊNCIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-red-700 mt-3">
            BOTÃO DE PÂNICO ACIONADO!
          </h2>
          <p className="text-slate-900 text-xl font-extrabold mt-3 leading-relaxed">
            O idoso <strong className="text-red-900 text-2xl underline">{activeAlert.idoso_name}</strong> precisa de ajuda imediata!
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 text-left space-y-1">
          <p className="text-sm font-bold text-slate-800">
            <strong>Idoso:</strong> {activeAlert.idoso_name}
          </p>
          <p className="text-sm font-bold text-slate-800">
            <strong>Código do Idoso:</strong> {activeAlert.idoso_code}
          </p>
          <p className="text-sm font-bold text-slate-800">
            <strong>Horário do Acionamento:</strong> {new Date(activeAlert.created_at).toLocaleTimeString('pt-BR')}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          className="w-full py-5 bg-red-700 hover:bg-red-800 text-white font-black text-2xl rounded-2xl shadow-xl border-4 border-red-950 transition cursor-pointer flex items-center justify-center gap-3"
        >
          <span>✓ ATENDER EMERGÊNCIA</span>
          <span className="text-sm bg-red-900 px-3 py-1 rounded-lg">Parar Alarme</span>
        </button>

      </div>
    </div>
  );
}
