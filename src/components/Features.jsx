import React from 'react';

export default function Features({ onNavigate }) {
  const items = [
    {
      id: 'chat',
      title: 'Chat',
      image: '/images/chat.jpg',
      bg: 'bg-teal-700 dark:bg-teal-800',
      hoverBg: 'hover:bg-teal-800 dark:hover:bg-teal-900',
      textColor: 'text-white',
    },
    {
      id: 'exercises',
      title: 'Movimente!',
      image: '/images/exercises.jpg',
      bg: 'bg-red-700 dark:bg-red-800',
      hoverBg: 'hover:bg-red-800 dark:hover:bg-red-900',
      textColor: 'text-white',
    },
    {
      id: 'medications',
      title: 'Medicamentos',
      image: '/images/medications.jpg',
      bg: 'bg-blue-700 dark:bg-blue-800',
      hoverBg: 'hover:bg-blue-800 dark:hover:bg-blue-900',
      textColor: 'text-white',
    },
    {
      id: 'events',
      title: 'Eventos',
      image: '/images/events.jpg',
      bg: 'bg-purple-700 dark:bg-purple-800',
      hoverBg: 'hover:bg-purple-800 dark:hover:bg-purple-900',
      textColor: 'text-white',
    },
  ];

  return (
    <section id="recursos" className="w-full my-auto bg-white dark:bg-slate-950 py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`${item.bg} ${item.hoverBg} rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 group cursor-pointer flex flex-col overflow-hidden text-left w-full border-2 border-slate-900 dark:border-slate-800`}
            >
              <div className="w-full h-36 sm:h-44 overflow-hidden bg-slate-950 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                )}
              </div>
              <div className="px-4 py-3.5">
                <h3 className={`text-center text-xl font-black ${item.textColor}`}>
                  {item.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
