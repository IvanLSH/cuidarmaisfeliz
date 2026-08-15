import React from 'react';

export default function Features({ onNavigate }) {
  const items = [
    {
      id: 'exercises',
      title: 'Movimente!',
      image: '/images/exercises.jpg',
      bg: 'bg-red-700',
      hoverBg: 'hover:bg-red-800',
      textColor: 'text-white',
    },
    {
      id: 'medications',
      title: 'Medicamentos',
      image: '/images/medications.jpg',
      bg: 'bg-blue-700',
      hoverBg: 'hover:bg-blue-800',
      textColor: 'text-white',
    },
    {
      id: 'events',
      title: 'Eventos',
      image: '/images/events.jpg',
      bg: 'bg-purple-700',
      hoverBg: 'hover:bg-purple-800',
      textColor: 'text-white',
    },
  ];

  return (
    <section id="recursos" className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`${item.bg} ${item.hoverBg} ${
                index === 2 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto' : ''
              } rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 group cursor-pointer flex flex-col overflow-hidden text-left w-full`}
            >
              {/* Image */}
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Label */}
              <div className="px-5 py-3.5">
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
