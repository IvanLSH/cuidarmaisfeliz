import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function HomePage({ onNavigate }) {
  return (
    <div>
      {/*<Hero onNavigate={onNavigate} />*/}
      <Features onNavigate={onNavigate} />

      {/* Call to action section */}
      {/*<section className="py-16 bg-slate-950 text-white border-t-4 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tem dúvidas ou precisa de ajuda?
          </h2>
          <p className="text-slate-300 font-bold text-lg max-w-2xl mx-auto mb-8">
            Nossa equipe e rede de apoio estão prontas para auxiliar idosos e familiares.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-10 py-4 rounded-xl bg-white text-slate-950 font-black text-lg shadow-lg hover:bg-slate-100 transition-all cursor-pointer border-2 border-slate-300"
          >
            Falar com Suporte
          </button>
        </div>
      </section>*/}
    </div>
  );
}
