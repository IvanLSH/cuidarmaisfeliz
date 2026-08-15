import React, { useState } from 'react';
import { login, register } from '../api';
import { isSupabaseConfigured } from '../supabaseClient';

export default function LoginPage({ onLoginSuccess, onBack, darkMode, onToggleDarkMode }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique a confirmação.');
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      setSuccessMsg(
        isSupabaseConfigured
          ? 'Conta de cuidador criada e gravada com sucesso no Supabase!'
          : 'Conta de cuidador criada com sucesso (Modo Demonstração local).'
      );
      
      setTimeout(async () => {
        try {
          await login(email.trim(), password);
          onLoginSuccess();
        } catch {
          setIsRegistering(false);
        }
      }, 1200);

    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (toRegister) => {
    setIsRegistering(toRegister);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full max-w-md relative">

        {/* Dark Mode toggle top right */}
        {onToggleDarkMode && (
          <div className="flex justify-end mb-3">
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
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
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden">

          <div className="bg-blue-800 dark:bg-blue-950 border-b-4 border-blue-950 dark:border-blue-900 px-8 py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-900 flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-blue-200">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Painel do Cuidador
            </h1>
            <p className="mt-1 text-blue-200 font-bold text-sm">
              {isRegistering ? 'Cadastre-se para gerenciar a rotina do idoso' : 'Entre com suas credenciais para acessar'}
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-amber-100 dark:bg-amber-950/80 border-b-2 border-amber-300 dark:border-amber-700 px-4 py-2 text-center text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center justify-center gap-1.5">
              <span>Modo Demonstração Local (Sem arquivo .env do Supabase)</span>
            </div>
          )}

          <div className="flex border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => switchTab(false)}
              className={`flex-1 py-3 text-base font-black transition cursor-pointer border-b-4 ${
                !isRegistering
                  ? 'border-blue-800 text-blue-900 dark:text-blue-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`flex-1 py-3 text-base font-black transition cursor-pointer border-b-4 ${
                isRegistering
                  ? 'border-blue-800 text-blue-900 dark:text-blue-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <div className="px-8 py-8">

            {successMsg && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 rounded-xl text-sm font-bold">
                <svg className="w-5 h-5 text-emerald-800 dark:text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {successMsg}
              </div>
            )}

            {error && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-950 border-2 border-red-400 text-red-900 dark:text-red-200 rounded-xl text-sm font-bold">
                <svg className="w-5 h-5 text-red-700 dark:text-red-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {!isRegistering ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1.5">
                    E-mail
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 cursor-pointer font-bold text-xs"
                      aria-label="Mostrar/ocultar senha"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white font-black text-lg shadow-md transition cursor-pointer border-2 border-blue-950 flex items-center justify-center gap-2"
                >
                  {loading ? 'Entrando...' : 'Entrar no Painel'}
                </button>

              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cuidador@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
                    Senha (mínimo 6 caracteres) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 dark:border-slate-700 focus:border-blue-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold text-base outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white font-black text-lg shadow-md transition cursor-pointer border-2 border-blue-950 flex items-center justify-center gap-2"
                >
                  {loading ? 'Criando Conta...' : 'Cadastrar Cuidador'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer underline"
              >
                ← Voltar à seleção de perfil
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
