import React, { useState } from 'react';
import { login, register } from '../api';
import { isSupabaseConfigured } from '../supabaseClient';

export default function LoginPage({ onLoginSuccess, onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States
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
      
      // Auto login on successful registration
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden">

          {/* Header strip */}
          <div className="bg-blue-800 border-b-4 border-blue-950 px-8 py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-900 mx-auto mb-3 shadow-md border-2 border-blue-200">
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

          {/* Supabase Status Indicator */}
          {!isSupabaseConfigured && (
            <div className="bg-amber-100 border-b-2 border-amber-300 px-4 py-2 text-center text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5">
              <span>Modo Demonstração Local (Sem arquivo .env do Supabase)</span>
            </div>
          )}

          {/* Tabs: Entrar / Criar Conta */}
          <div className="flex border-b-2 border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => switchTab(false)}
              className={`flex-1 py-3 text-base font-black transition cursor-pointer border-b-4 ${
                !isRegistering
                  ? 'border-blue-800 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`flex-1 py-3 text-base font-black transition cursor-pointer border-b-4 ${
                isRegistering
                  ? 'border-blue-800 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-emerald-100 border-2 border-emerald-500 text-emerald-950 rounded-xl text-sm font-bold">
                <svg className="w-5 h-5 text-emerald-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-red-100 border-2 border-red-400 text-red-900 rounded-xl text-sm font-bold">
                <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {!isRegistering ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1.5">
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
                      className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1 cursor-pointer font-bold text-xs"
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
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cuidador@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1">
                    Senha (mínimo 6 caracteres) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-400 focus:border-blue-700 bg-white text-slate-950 font-bold text-base outline-none"
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

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm font-extrabold text-slate-600 hover:text-slate-900 cursor-pointer underline"
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
