interface KPICardsProps {
  kpis?: {
    totalStock: number;
    totalDemand: number;
    fillRate: number;
  };
  loading: boolean;
}

export default function KPICards({ kpis, loading }: KPICardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Stock',
      value: kpis?.totalStock?.toLocaleString() || '0',
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      title: 'Total Demand',
      value: kpis?.totalDemand?.toLocaleString() || '0',
      icon: '📈',
      color: 'text-green-600'
    },
    {
      title: 'Fill Rate',
      value: `${kpis?.fillRate?.toFixed(1) || '0'}%`,
      icon: '🎯',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
