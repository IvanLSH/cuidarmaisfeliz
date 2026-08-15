import React, { useState, useEffect } from 'react';
import { getEvents } from '../api';

const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Encontro de Dança e Convivência Senior',
    date: '20 de Agosto, 2026',
    time: '14:30 às 16:30',
    location: 'Centro Comunitário de Apoio ao Idoso',
    category: 'Lazer & Social',
    description: 'Uma tarde especial de música leve, dança adaptada e interação social para promover alegria e mobilidade.',
    badge: 'Gratuito',
  },
  {
    id: 2,
    title: 'Palestra: Saúde da Memória e Bem-Estar',
    date: '25 de Agosto, 2026',
    time: '09:00 às 10:30',
    location: 'Auditório da Saúde - Sala 02',
    category: 'Saúde & Palestra',
    description: 'Dicas práticas de geriatria e neuropsicologia para exercitar a memória e manter a mente sempre ativa.',
    badge: 'Vagas Limitadas',
  },
  {
    id: 3,
    title: 'Oficina Prática de Jardinagem Terapêutica',
    date: '28 de Agosto, 2026',
    time: '15:00 às 17:00',
    location: 'Parque Municipal - Espaço Verde',
    category: 'Oficina',
    description: 'Aprenda técnicas de plantio de ervas medicinais e flores em um ambiente tranquilo ao ar livre.',
    badge: 'Gratuito',
  },
  {
    id: 4,
    title: 'Caminhada Guiada no Parque',
    date: '02 de Setembro, 2026',
    time: '08:00 às 09:30',
    location: 'Parque Central - Ponto de Encontro 1',
    category: 'Atividade Física',
    description: 'Caminhada suave acompanhada por educadores físicos e profissionais de enfermagem.',
    badge: 'Gratuito',
  },
];

export default function EventsPage({ onNavigate }) {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [confirmedEvents, setConfirmedEvents] = useState({});

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('API não conectada para eventos, usando lista padrao:', err.message);
      }
    }
    loadEvents();
  }, []);

  const toggleRSVP = (id) => {
    setConfirmedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="py-10 bg-slate-100 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-4 py-1.5 bg-purple-800 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border-2 border-purple-950">
            Comunidade & Lazer
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white mt-3">
            Divulgação de Eventos
          </h1>
          <p className="mt-3 text-lg text-slate-800 dark:text-slate-300 font-bold">
            Participe de oficinas, palestras de saúde e encontros comunitários preparados especialmente para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => {
            const isConfirmed = !!confirmedEvents[event.id];

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-md hover:border-purple-600 transition overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3.5 py-1 bg-purple-800 text-white text-xs font-black rounded-full border border-purple-950">
                      {event.category}
                    </span>
                    <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white text-xs font-black rounded border border-slate-400 dark:border-slate-700">
                      {event.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-3">
                    {event.title}
                  </h3>

                  <p className="text-slate-800 dark:text-slate-300 text-base font-medium leading-relaxed mb-6">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-950 dark:text-white">Data:</span> {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-950 dark:text-white">Horário:</span> {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-950 dark:text-white">Local:</span> {event.location}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    {isConfirmed ? 'Presença Confirmada' : 'Ainda não confirmado'}
                  </span>
                  <button
                    onClick={() => toggleRSVP(event.id)}
                    className={`px-5 py-2.5 text-sm font-black rounded-xl transition cursor-pointer border ${
                      isConfirmed
                        ? 'bg-emerald-700 text-white border-emerald-950 hover:bg-emerald-800'
                        : 'bg-purple-800 text-white border-purple-950 hover:bg-purple-900 shadow'
                    }`}
                  >
                    {isConfirmed ? 'Confirmado' : 'Confirmar Presença'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-8 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-950 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-slate-950 dark:border-slate-700 transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>← Voltar à Página Inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
}
