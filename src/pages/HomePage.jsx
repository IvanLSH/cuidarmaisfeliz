import React from 'react';
import Features from '../components/Features';

export default function HomePage({ onNavigate }) {
  return (
    <div>
      <Features onNavigate={onNavigate} />
    </div>
  );
}
