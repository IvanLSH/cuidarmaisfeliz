import React, { useState } from 'react';
import { getLoggedInCaregiver, getLinkedCaregiver, getLoggedInIdoso, getIdosoName } from '../api';
import IdosoManagementModal from './IdosoManagementModal';

const PAGE_COLORS = {
  exercises: {
    active: 'text-red-800 border-b-4 border-red-700',
    hover: 'hover:text-red-700',
  },
  medications: {
    active: 'text-blue-800 border-b-4 border-blue-700',
    hover: 'hover:text-blue-700',
  },
  events: {
    active: 'text-purple-800 border-b-4 border-purple-700',
    hover: 'hover:text-purple-700',
  },
};

const DEFAULT_ACTIVE = 'text-slate-900 border-b-4 border-slate-700';
const DEFAULT_HOVER = 'hover:text-slate-600';

export default function Navbar({ activePage, onNavigate, userRole, onChangeRole }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
  };

  const isIdoso = userRole === 'idoso';

  const getActiveStyle = (id) => {
    if (activePage !== id) return '';
    return PAGE_COLORS[id]?.active || DEFAULT_ACTIVE;
  };

  const getHoverStyle = (id) => {
    return PAGE_COLORS[id]?.hover || DEFAULT_HOVER;
  };

  const getMobileActiveStyle = (id) => {
    if (activePage !== id) return 'text-slate-900 bg-slate-100 hover:bg-slate-200';
    const map = {
      exercises: 'bg-red-700 text-white',
      medications: 'bg-blue-700 text-white',
      events: 'bg-purple-700 text-white',
    };
    return map[id] || 'bg-slate-900 text-white';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isIdoso ? 'h-20' : 'h-16'}`}>

            {/* Logo / Title */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center space-x-3 cursor-pointer text-left"
            >
              <div className={`rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md ${
                isIdoso ? 'w-11 h-11' : 'w-9 h-9'
              }`}>
                <svg className={isIdoso ? 'w-7 h-7' : 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.646a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className={`font-extrabold text-slate-950 tracking-tight ${
                isIdoso ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}>
                Cuidado+Feliz
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center font-bold ${
              isIdoso ? 'gap-8 text-lg font-extrabold' : 'gap-6 text-base'
            }`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`transition-colors cursor-pointer pb-1 ${
                    activePage === item.id
                      ? getActiveStyle(item.id) + ' font-black'
                      : `text-slate-700 ${getHoverStyle(item.id)}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Caregiver Actions / Linked Idoso Badge & Role Switcher */}
            <div className="hidden md:flex items-center space-x-3">
              {!isIdoso && (
                <button
                  onClick={() => setIsIdosoModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 border-2 border-blue-400 text-blue-950 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
                >
                  <span>+ Cadastrar Idoso</span>
                </button>
              )}

              {isIdoso && (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 text-sm font-black flex items-center gap-1.5">
                  <span>{idosoName || 'Idoso'} {linkedCaregiver ? `(Cuidador: ${linkedCaregiver.name})` : ''}</span>
                </div>
              )}

              <button
                onClick={onChangeRole}
                title="Clique para alternar o perfil de acesso"
                className={`px-3.5 py-2 rounded-xl border-2 font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                  isIdoso
                    ? 'bg-slate-100 text-slate-900 border-slate-400 text-base hover:bg-slate-200'
                    : 'bg-slate-100 text-slate-900 border-slate-400 text-sm hover:bg-slate-200'
                }`}
              >
                <span>{isIdoso ? 'Perfil: Idoso' : 'Perfil: Cuidador'}</span>
                <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            {/* Mobile: Role badge + Hamburger */}
            <div className="md:hidden flex items-center space-x-2">
              {!isIdoso && (
                <button
                  onClick={() => setIsIdosoModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 border-2 border-blue-400 text-blue-950 text-xs font-black"
                >
                  + Idoso
                </button>
              )}

              <button
                onClick={onChangeRole}
                className="px-3 py-1.5 rounded-lg bg-slate-100 border-2 border-slate-400 text-slate-900 text-xs font-black"
              >
                {isIdoso ? (idosoName || 'Idoso') : 'Cuidador'}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="p-2 rounded-lg text-slate-900 hover:bg-slate-200 focus:outline-none"
                aria-label="Alternar menu"
              >
                {isMenuOpen ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b-2 border-slate-300 px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-extrabold ${
                  isIdoso ? 'text-xl' : 'text-lg'
                } ${getMobileActiveStyle(item.id)}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Idoso Management Modal for Caregivers */}
      <IdosoManagementModal
        isOpen={isIdosoModalOpen}
        onClose={() => setIsIdosoModalOpen(false)}
      />
    </>
  );
}
