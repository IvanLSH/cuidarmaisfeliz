import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function HomePage({ onNavigate }) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <Features onNavigate={onNavigate} />
    </div>
  );
}
