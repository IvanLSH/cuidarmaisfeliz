import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-12 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border-2 border-emerald-950">
            Suporte
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-3">
            Entre em Contato
          </h1>
          <p className="mt-3 text-lg text-slate-800 font-bold">
            Tem alguma dúvida ou sugestão? Envie uma mensagem para nossa equipe de apoio.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border-2 border-slate-300 shadow-md">
          {submitted ? (
            <div className="p-6 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 rounded-xl text-center">
              <svg className="w-12 h-12 mx-auto text-emerald-800 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-black">Mensagem enviada com sucesso!</h3>
              <p className="text-base font-bold mt-1">Obrigado pelo contato. Responderemos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-extrabold text-slate-950 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 bg-white text-slate-950 font-bold text-base focus:border-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-extrabold text-slate-950 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 bg-white text-slate-950 font-bold text-base focus:border-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-extrabold text-slate-950 mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escreva sua mensagem aqui..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 bg-white text-slate-950 font-bold text-base focus:border-emerald-700 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg py-4 rounded-xl shadow transition cursor-pointer border border-emerald-950"
              >
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
