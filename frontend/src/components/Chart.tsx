interface ChartProps {
  trend?: Array<{
    date: string;
    stock: number;
    demand: number;
  }>;
  loading: boolean;
}

export default function Chart({ trend, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!trend || trend.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Demand Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxValue = Math.max(
    ...trend.map(point => Math.max(point.stock, point.demand))
  );

  const getX = (index: number) => padding + (index / (trend.length - 1)) * chartWidth;
  const getY = (value: number) => height - padding - (value / maxValue) * chartHeight;

  const stockPath = trend
    .map((point, index) => `${getX(index)},${getY(point.stock)}`)
    .join(' ');

  const demandPath = trend
    .map((point, index) => `${getX(index)},${getY(point.demand)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Demand Trend</h3>
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={height - padding - ratio * chartHeight}
              x2={width - padding}
              y2={height - padding - ratio * chartHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x={padding - 10}
              y={height - padding - ratio * chartHeight + 4}
              textAnchor="end"
              className="text-xs text-gray-500"
            >
              {Math.round(maxValue * ratio).toLocaleString()}
            </text>
          ))}

          {/* Stock line */}
          <polyline
            points={stockPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Demand line */}
          <polyline
            points={demandPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Legend */}
          <g transform={`translate(${width - 150}, 20)`}>
            <line x1="0" y1="10" x2="20" y2="10" stroke="#3b82f6" strokeWidth="2" />
            <text x="25" y="15" className="text-sm text-gray-700">Stock</text>
            <line x1="0" y1="30" x2="20" y2="30" stroke="#10b981" strokeWidth="2" />
            <text x="25" y="35" className="text-sm text-gray-700">Demand</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
