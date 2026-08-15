import React, { useState, useEffect } from 'react';
import { getExercises } from '../api';

const DEFAULT_EXERCISES = [
  {
    id: 1,
    title: 'Alongamento Matinal Sentado',
    category: 'Alongamento',
    duration: '10 min',
    difficulty: 'Leve',
    description: 'Alongamentos suaves para o pescoço, ombros e costas, realizados confortavelmente em uma cadeira.',
  },
  {
    id: 2,
    title: 'Caminhada Leve e Mobilidade',
    category: 'Caminhada',
    duration: '15 min',
    difficulty: 'Moderado',
    description: 'Exercícios de marcha no lugar e rotação de tornozelos para melhorar o equilíbrio e a circulação.',
  },
  {
    id: 3,
    title: 'Fortalecimento de Pernas e Joelhos',
    category: 'Fortalecimento',
    duration: '12 min',
    difficulty: 'Leve',
    description: 'Movimentos simples de sentar e levantar para preservar a força muscular das pernas.',
  },
  {
    id: 4,
    title: 'Exercícios de Respiração e Relaxamento',
    category: 'Alongamento',
    duration: '8 min',
    difficulty: 'Muito Leve',
    description: 'Técnicas de respiração profunda para reduzir a ansiedade e promover o relaxamento corporal.',
  },
];

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES);

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await getExercises(selectedCategory);
        if (data && data.length > 0) {
          setExercises(data);
        }
      } catch (err) {
        console.warn('API não conectada para exercícios, usando filtro local:', err.message);
      }
    }
    loadExercises();
  }, [selectedCategory]);

  const categories = ['Todos', 'Alongamento', 'Caminhada', 'Fortalecimento'];

  const filteredExercises = selectedCategory === 'Todos'
    ? exercises
    : exercises.filter(e => e.category === selectedCategory);

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-4 py-1.5 bg-red-800 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border-2 border-red-950">
            Saúde & Movimento
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-3">
            Guia de Exercícios em Vídeo
          </h1>
          <p className="mt-3 text-lg text-slate-800 font-bold">
            Vídeos guiados com exercícios seguros para manter a mobilidade, equilíbrio e bem-estar.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-base font-extrabold transition cursor-pointer border-2 ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white border-red-950 shadow-md'
                  : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden hover:border-red-600 transition flex flex-col"
            >
              {/* Simulated Video Player Banner - Red theme */}
              <div className="relative h-48 bg-red-700 flex items-center justify-center text-white border-b-2 border-slate-900">
                <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-lg border-2 border-white">
                  <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950 text-xs font-black rounded border border-slate-700 text-white">
                  ⏱️ {exercise.duration}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-white text-slate-950 text-xs font-black rounded border border-slate-900">
                  {exercise.difficulty}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-950 mb-2">
                    {exercise.title}
                  </h3>
                  <p className="text-slate-800 text-base font-medium leading-relaxed mb-4">
                    {exercise.description}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-black text-red-950 bg-red-100 border border-red-300 px-3 py-1 rounded-full">
                    {exercise.category}
                  </span>
                  <button className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-extrabold text-base rounded-xl transition cursor-pointer border border-red-950">
                    Assistir Aula
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
