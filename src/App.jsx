import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import IdosoLinkPage from './pages/IdosoLinkPage';
import HomePage from './pages/HomePage';
import ExercisesPage from './pages/ExercisesPage';
import MedicationsPage from './pages/MedicationsPage';
import EventsPage from './pages/EventsPage';
import ChatPage from './pages/ChatPage';

import { clearToken } from './api';

// app states: null → role selection | 'cuidador_login' → login screen | 'idoso_link' → idoso code screen | 'idoso' / 'cuidador' → app
export default function App() {
  const [appState, setAppState] = useState(() => {
    return localStorage.getItem('cuidado_feliz_role') || null;
  });

  const [activePage, setActivePage] = useState('home');

  // Called from RoleSelectionPage
  const handleSelectRole = (role) => {
    if (role === 'cuidador') {
      setAppState('cuidador_login'); // go to login screen first
    } else {
      setAppState('idoso_link'); // go to caregiver code entry screen first
    }
  };

  // Called from LoginPage on success
  const handleLoginSuccess = () => {
    setAppState('cuidador');
    localStorage.setItem('cuidado_feliz_role', 'cuidador');
  };

  // Called from IdosoLinkPage on success
  const handleIdosoLinkSuccess = () => {
    setAppState('idoso');
    localStorage.setItem('cuidado_feliz_role', 'idoso');
  };

  // Called from anywhere to reset to role selection
  const handleChangeRole = () => {
    setAppState(null);
    localStorage.removeItem('cuidado_feliz_role');
    clearToken();
    setActivePage('home');
  };

  // Scroll to top whenever activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // ── Role Selection ──
  if (!appState) {
    return <RoleSelectionPage onSelectRole={handleSelectRole} />;
  }

  // ── Cuidador Login ──
  if (appState === 'cuidador_login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setAppState(null)}
      />
    );
  }

  // ── Idoso Caregiver Code Linkage ──
  if (appState === 'idoso_link') {
    return (
      <IdosoLinkPage
        onLinkSuccess={handleIdosoLinkSuccess}
        onBack={() => setAppState(null)}
      />
    );
  }

  // ── App (idoso or cuidador) ──
  const userRole = appState; // 'idoso' or 'cuidador'
  const isIdoso = userRole === 'idoso';

  const renderPage = () => {
    switch (activePage) {
      case 'home':       return <HomePage onNavigate={setActivePage} userRole={userRole} />;
      case 'exercises':  return <ExercisesPage onNavigate={setActivePage} userRole={userRole} />;
      case 'medications':return <MedicationsPage onNavigate={setActivePage} userRole={userRole} />;
      case 'events':     return <EventsPage onNavigate={setActivePage} userRole={userRole} />;
      case 'chat':       return <ChatPage onNavigate={setActivePage} userRole={userRole} />;
      default:           return <HomePage onNavigate={setActivePage} userRole={userRole} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white ${
      isIdoso ? 'text-lg font-medium tracking-wide' : 'text-base'
    }`}>
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        userRole={userRole}
        onChangeRole={handleChangeRole}
      />

      <main className="flex-grow flex flex-col justify-center">
        {renderPage()}
      </main>

      <Footer onNavigate={setActivePage} userRole={userRole} />
    </div>
  );
}
