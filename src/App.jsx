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
import PanicModal from './components/PanicModal';
import PanicButton from './components/PanicButton';

import { clearToken } from './api';

export default function App() {
  const [appState, setAppState] = useState(() => {
    return localStorage.getItem('cuidado_feliz_role') || null;
  });

  const [activePage, setActivePage] = useState('home');

  const handleSelectRole = (role) => {
    if (role === 'cuidador') {
      setAppState('cuidador_login');
    } else {
      setAppState('idoso_link');
    }
  };

  const handleLoginSuccess = () => {
    setAppState('cuidador');
    localStorage.setItem('cuidado_feliz_role', 'cuidador');
  };

  const handleIdosoLinkSuccess = () => {
    setAppState('idoso');
    localStorage.setItem('cuidado_feliz_role', 'idoso');
  };

  const handleChangeRole = () => {
    setAppState(null);
    localStorage.removeItem('cuidado_feliz_role');
    clearToken();
    setActivePage('home');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  if (!appState) {
    return <RoleSelectionPage onSelectRole={handleSelectRole} />;
  }

  if (appState === 'cuidador_login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setAppState(null)}
      />
    );
  }

  if (appState === 'idoso_link') {
    return (
      <IdosoLinkPage
        onLinkSuccess={handleIdosoLinkSuccess}
        onBack={() => setAppState(null)}
      />
    );
  }

  const userRole = appState;
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

      <PanicModal userRole={userRole} />
      <PanicButton userRole={userRole} />
    </div>
  );
}
