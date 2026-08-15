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
  chat: {
    active: 'text-white bg-teal-700 font-black shadow',
    hover: 'hover:text-teal-700 hover:bg-teal-50',
  },
};

const DEFAULT_ACTIVE = 'text-white bg-slate-900 font-black shadow';
const DEFAULT_HOVER = 'hover:text-slate-600 hover:bg-slate-100';

export default function Navbar({ activePage, onNavigate, userRole, onChangeRole, darkMode, onToggleDarkMode }) {
  const [isIdosoModalOpen, setIsIdosoModalOpen] = useState(false);

  const caregiverInfo = getLoggedInCaregiver();
  const linkedCaregiver = getLinkedCaregiver();
  const loggedInIdoso = getLoggedInIdoso();
  const idosoName = getIdosoName();

  const handleNav = (id) => {
    onNavigate(id);
  };

  const isIdoso = userRole === 'idoso';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm py-3 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
          
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group border-none outline-none no-underline"
          >
            <div className={`rounded-xl bg-slate-900 dark:bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform ${
              isIdoso ? 'w-11 h-11' : 'w-9 h-9'
            }`}>
              <svg className={isIdoso ? 'w-7 h-7' : 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.646a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className={`font-black text-slate-950 dark:text-white tracking-tight no-underline ${
              isIdoso ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}>
              Cuidar+Feliz
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {!isIdoso && (
              <button
                onClick={() => setIsIdosoModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 hover:bg-blue-200 dark:hover:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-100 text-xs sm:text-sm font-black transition cursor-pointer"
              >
                + Cadastrar Idoso
              </button>
            )}

            {isIdoso && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 text-xs sm:text-sm font-black">
                <span>{idosoName || 'Idoso'} {linkedCaregiver ? `(${linkedCaregiver.name})` : ''}</span>
              </div>
            )}

            <button
              onClick={onChangeRole}
              title="Clique para alternar o perfil"
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold transition flex items-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
            >
              <span>{isIdoso ? 'Perfil: Idoso' : 'Perfil: Cuidador'}</span>
              <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
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
          </div>

        </div>
      </header>

      <IdosoManagementModal
        isOpen={isIdosoModalOpen}
        onClose={() => setIsIdosoModalOpen(false)}
      />
    </>
  );
}
