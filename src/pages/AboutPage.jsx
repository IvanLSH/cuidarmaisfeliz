import React from 'react';

export default function AboutPage() {
  const stats = [
    { label: 'Idosos Atendidos', value: '500+' },
    { label: 'Exercícios em Vídeo', value: '30+' },
    { label: 'Eventos Realizados', value: '120+' },
    { label: 'Comunidades Parceiras', value: '15' },
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Acolhimento',
      description: 'Recebemos cada pessoa com carinho e respeito, valorizando suas histórias e experiências de vida.',
    },
    {
      icon: '♿',
      title: 'Acessibilidade',
      description: 'Plataforma pensada para ser simples e acessível, com navegação intuitiva para todas as idades.',
    },
    {
      icon: '💚',
      title: 'Saúde Integral',
      description: 'Promovemos o cuidado do corpo e da mente através de exercícios adaptados e atividades de socialização.',
    },
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border-2 border-emerald-950">
            Quem Somos
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-3">
            Sobre o Cuidado+Feliz
          </h1>
          <p className="mt-4 text-slate-800 text-lg font-semibold leading-relaxed">
            Somos uma plataforma dedicada ao bem-estar e à qualidade de vida da pessoa idosa. Conectamos saúde, comunidade e tecnologia para promover autonomia e alegria na melhor idade.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-emerald-100 p-6 rounded-2xl text-center border-2 border-emerald-400 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 mb-1">
                {stat.value}
              </div>
              <div className="text-base font-extrabold text-slate-900">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((item, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-300 shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-black text-slate-950 mb-2">{item.title}</h3>
              <p className="text-slate-800 text-base font-medium leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Card */}
        <div className="bg-emerald-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-emerald-950">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Nossa Missão
            </h2>
            <p className="text-white text-lg font-medium leading-relaxed mb-6">
              Oferecer ferramentas acessíveis e acolhedoras que ajudem idosos a gerenciar sua saúde, manter-se ativos fisicamente e participar de atividades comunitárias — fortalecendo vínculos sociais e promovendo uma vida com mais qualidade e dignidade.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-emerald-950 text-white rounded-xl text-sm font-extrabold border border-emerald-700">
                💚 Saúde & Bem-Estar
              </span>
              <span className="px-4 py-2 bg-emerald-950 text-white rounded-xl text-sm font-extrabold border border-emerald-700">
                🤝 Comunidade
              </span>
              <span className="px-4 py-2 bg-emerald-950 text-white rounded-xl text-sm font-extrabold border border-emerald-700">
                ♿ Acessibilidade
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
