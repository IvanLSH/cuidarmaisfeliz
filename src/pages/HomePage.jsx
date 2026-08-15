import React from 'react';
import Features from '../components/Features';

export default function HomePage({ onNavigate }) {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center my-auto py-8 bg-white dark:bg-slate-950 transition-colors">
      <Features onNavigate={onNavigate} />
    </div>
  );
}
