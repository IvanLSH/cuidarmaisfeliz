import React, { useState } from 'react';
import { getLoggedInCaregiver, getLinkedCaregiver, getLoggedInIdoso, getIdosoName } from '../api';
import IdosoManagementModal from './IdosoManagementModal';

const PAGE_COLORS = {
  exercises: {
    active: 'text-white bg-red-700 font-black shadow',
    hover: 'hover:text-red-700 hover:bg-red-50',
  },
  medications: {
    active: 'text-white bg-blue-700 font-black shadow',
    hover: 'hover:text-blue-700 hover:bg-blue-50',
  },
  events: {
    active: 'text-white bg-purple-700 font-black shadow',
    hover: 'hover:text-purple-700 hover:bg-purple-50',
  },
};

const DEFAULT_ACTIVE = 'text-white bg-slate-900 font-black shadow';
const DEFAULT_HOVER = 'hover:text-slate-600 hover:bg-slate-100';

export default function Navbar({ activePage, onNavigate, userRole, onChangeRole }) {
  const [isIdosoModalOpen, setIsIdosoModalOpen] = useState(false);

  const caregiverInfo = getLoggedInCaregiver();
  const linkedCaregiver = getLinkedCaregiver();
  const loggedInIdoso = getLoggedInIdoso();
  const idosoName = getIdosoName();

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'exercises', label: 'Exercícios' },
    { id: 'medications', label: 'Medicamentos' },
    { id: 'events', label: 'Eventos' },
  ];

  const handleNav = (id) => {
    onNavigate(id);
  };

  const isIdoso = userRole === 'idoso';

  const getActiveStyle = (id) => {
    if (activePage !== id) return '';
    return PAGE_COLORS[id]?.active || DEFAULT_ACTIVE;
  };

  const getHoverStyle = (id) => {
    return PAGE_COLORS[id]?.hover || DEFAULT_HOVER;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
          
          {/* TOP: Símbolo e Nome do App Centralizados Sem Sublinhado */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group border-none outline-none no-underline"
          >
            <div className={`rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform ${
              isIdoso ? 'w-11 h-11' : 'w-9 h-9'
            }`}>
              <svg className={isIdoso ? 'w-7 h-7' : 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.646a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className={`font-black text-slate-950 tracking-tight no-underline ${
              isIdoso ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}>
              Cuidado+Feliz
            </span>
          </button>

          {/* BOTTOM: Botões de Navegação e Ações */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
            

            {/* Ações do Cuidador / Idoso */}
            <div className="flex items-center gap-2">
              {!isIdoso && (
                <button
                  onClick={() => setIsIdosoModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-950 text-xs sm:text-sm font-black transition cursor-pointer"
                >
                  + Cadastrar Idoso
                </button>
              )}

              {isIdoso && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-black">
                  <span>{idosoName || 'Idoso'} {linkedCaregiver ? `(${linkedCaregiver.name})` : ''}</span>
                </div>
              )}

              <button
                onClick={onChangeRole}
                title="Clique para alternar o perfil"
                className={`px-3.5 py-2 rounded-xl border border-slate-300 font-extrabold transition flex items-center gap-1 cursor-pointer ${
                  isIdoso
                    ? 'bg-slate-100 text-slate-900 text-xs sm:text-sm hover:bg-slate-200'
                    : 'bg-slate-100 text-slate-900 text-xs sm:text-sm hover:bg-slate-200'
                }`}
              >
                <span>{isIdoso ? 'Perfil: Idoso' : 'Perfil: Cuidador'}</span>
                <svg className="w-3.5 h-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Idoso Management Modal for Caregivers */}
      <IdosoManagementModal
        isOpen={isIdosoModalOpen}
        onClose={() => setIsIdosoModalOpen(false)}
      />
    </>
  );
}
