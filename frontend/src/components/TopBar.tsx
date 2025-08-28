interface TopBarProps {
  dateRange: number;
  onDateRangeChange: (range: number) => void;
}

export default function TopBar({ dateRange, onDateRangeChange }: TopBarProps) {
  const ranges = [
    { value: 7, label: '7d' },
    { value: 14, label: '14d' },
    { value: 30, label: '30d' }
  ];

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">SupplySight</div>
        <div className="flex gap-2">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => onDateRangeChange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
