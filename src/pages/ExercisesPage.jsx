import React, { useState, useEffect } from 'react';
import { getExercises } from '../api';

const DEFAULT_EXERCISES = [
  {
    id: 1,
    title: 'Alongamento Matinal Sentado',
    category: 'Alongamento',
    duration: '12 min',
    difficulty: 'Leve',
    description: 'Alongamentos suaves para o pescoço, ombros e costas, realizados confortavelmente em uma cadeira.',
    videoUrl: 'https://www.youtube.com/watch?v=a4N2lSqqGJY',
    embedUrl: 'https://www.youtube.com/embed/a4N2lSqqGJY',
  },
  {
    id: 2,
    title: 'Caminhada Leve e Mobilidade',
    category: 'Caminhada',
    duration: '8 min',
    difficulty: 'Moderado',
    description: 'Exercícios de marcha no lugar e rotação de tornozelos para melhorar o equilíbrio e a circulação.',
    videoUrl: 'https://www.youtube.com/watch?v=4gvEVu8ITPY',
    embedUrl: 'https://www.youtube.com/embed/4gvEVu8ITPY',
  },
  {
    id: 3,
    title: 'Fortalecimento de Pernas e Joelhos',
    category: 'Fortalecimento',
    duration: '8 min',
    difficulty: 'Leve',
    description: 'Movimentos simples de sentar e levantar para preservar a força muscular das pernas.',
    videoUrl: 'https://www.youtube.com/watch?v=iClCQNo6dZ4',
    embedUrl: 'https://www.youtube.com/embed/iClCQNo6dZ4',
  },
  {
    id: 4,
    title: 'Exercícios de Respiração e Relaxamento',
    category: 'Alongamento',
    duration: '2 min',
    difficulty: 'Muito Leve',
    description: 'Técnicas de respiração profunda para reduzir a ansiedade e promover o relaxamento corporal.',
    videoUrl: 'https://www.youtube.com/watch?v=kiEmbhvv7Fo',
    embedUrl: 'https://www.youtube.com/embed/kiEmbhvv7Fo',
  },
];

export default function ExercisesPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES);

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await getExercises(selectedCategory);
        if (data && data.length > 0) {
          const merged = data.map((item) => {
            const match = DEFAULT_EXERCISES.find(d => d.title === item.title);
            return match ? { ...item, ...match } : item;
          });
          setExercises(merged);
        }
      } catch (err) {
        console.warn('API não conectada para exercícios, usando lista local:', err.message);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden hover:border-red-600 transition flex flex-col"
            >
              <div className="relative w-full aspect-video bg-slate-950 border-b-2 border-slate-900">
                {exercise.embedUrl ? (
                  <iframe
                    src={exercise.embedUrl}
                    title={exercise.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Vídeo indisponível
                  </div>
                )}
                
                <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 text-white text-xs font-black rounded border border-slate-700 backdrop-blur-sm pointer-events-none">
                  Duração: {exercise.duration}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 text-slate-950 text-xs font-black rounded border border-slate-900 backdrop-blur-sm pointer-events-none">
                  {exercise.difficulty}
                </div>
              </div>

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
                  
                  {exercise.videoUrl && (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-extrabold text-base rounded-xl transition cursor-pointer border border-red-950 inline-flex items-center gap-1.5"
                    >
                      <span>Abrir no YouTube</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-950 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-slate-950 transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>← Voltar à Página Inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
}
