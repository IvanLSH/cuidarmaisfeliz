import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold">
          &copy; {new Date().getFullYear()} Cuidado+Feliz. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
