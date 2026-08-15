import React, { useState } from 'react';

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

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'exercises', label: 'Exercícios' },
    { id: 'medications', label: 'Medicamentos' },
    { id: 'events', label: 'Eventos' },
    { id: 'about', label: 'Sobre' },
    { id: 'contact', label: 'Contato' },
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

  // Mobile active background per page
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
    <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${isIdoso ? 'h-20' : 'h-16'}`}>

          {/* Logo / Title */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer text-left"
          >
            <div className={`rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md ${
              isIdoso ? 'w-11 h-11 text-2xl' : 'w-9 h-9 text-xl'
            }`}>
              👵
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

          {/* Role Switcher (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onChangeRole}
              title="Clique para alternar o perfil de acesso"
              className={`px-3.5 py-2 rounded-xl border-2 font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                isIdoso
                  ? 'bg-slate-100 text-slate-900 border-slate-400 text-base hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-900 border-slate-400 text-sm hover:bg-slate-200'
              }`}
            >
              <span>{isIdoso ? '👵 Idoso' : '🧑‍⚕️ Cuidador'}</span>
              <span className="text-slate-500 text-xs">🔄</span>
            </button>
          </div>

          {/* Mobile: Role badge + Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onChangeRole}
              className="px-3 py-1.5 rounded-lg bg-slate-100 border-2 border-slate-400 text-slate-900 text-xs font-black"
            >
              {isIdoso ? '👵 Idoso' : '🧑‍⚕️ Cuidador'}
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
  );
}
