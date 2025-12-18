'use client';

import { useMemo } from 'react';

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: 'primary' | 'green' | 'yellow' | 'red';
  height?: number;
  showGrid?: boolean;
}

export default function TrendChart({
  data,
  title,
  subtitle,
  color = 'primary',
  height = 200,
  showGrid = true,
}: TrendChartProps) {
  const colorMap = {
    primary: {
      line: '#6366F1',
      fill: 'rgba(99, 102, 241, 0.1)',
      dot: '#818CF8',
    },
    green: {
      line: '#10B981',
      fill: 'rgba(16, 185, 129, 0.1)',
      dot: '#34D399',
    },
    yellow: {
      line: '#F59E0B',
      fill: 'rgba(245, 158, 11, 0.1)',
      dot: '#FBBF24',
    },
    red: {
      line: '#EF4444',
      fill: 'rgba(239, 68, 68, 0.1)',
      dot: '#F87171',
    },
  };

  const colors = colorMap[color];

  const { points, minValue, maxValue, trend } = useMemo(() => {
    if (data.length === 0) {
      return { points: '', minValue: 0, maxValue: 100, trend: 0 };
    }

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate trend (percentage change from first to last)
    const trendValue = data.length > 1
      ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
      : 0;

    // Normalize points to SVG coordinates
    const padding = 20;
    const chartWidth = 100;
    const chartHeight = 100;

    const xStep = chartWidth / (data.length - 1 || 1);
    const range = max - min || 1;

    const svgPoints = data
      .map((d, i) => {
        const x = padding + i * xStep;
        const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
        return `${x},${y}`;
      })
      .join(' ');

    // Create filled area path
    const firstX = padding;
    const lastX = padding + (data.length - 1) * xStep;
    const bottomY = padding + chartHeight;
    const fillPath = `${svgPoints} ${lastX},${bottomY} ${firstX},${bottomY}`;

    return {
      points: svgPoints,
      fillPath,
      minValue: min,
      maxValue: max,
      trend: trendValue,
    };
  }, [data]);

  const getTrendIcon = () => {
    if (trend > 5) return '📈';
    if (trend < -5) return '📉';
    return '➡️';
  };

  const getTrendColor = () => {
    if (trend > 5) return 'text-green-400';
    if (trend < -5) return 'text-red-400';
    return 'text-gray-400';
  };

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {trend > 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">{getTrendIcon()} Trend</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 140 140"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {showGrid && (
            <g opacity="0.1">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="20"
                  y1={20 + y}
                  x2="120"
                  y2={20 + y}
                  stroke="white"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}

          {/* Filled area */}
          {points && (
            <polygon
              points={`${points} ${120},${120} ${20},${120}`}
              fill={colors.fill}
            />
          )}

          {/* Line */}
          {points && (
            <polyline
              points={points}
              fill="none"
              stroke={colors.line}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {data.map((d, i) => {
            const x = 20 + (i * 100) / (data.length - 1 || 1);
            const y =
              20 + 100 - ((d.value - minValue) / (maxValue - minValue || 1)) * 100;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill={colors.dot} />
                <circle cx={x} cy={y} r="5" fill={colors.dot} opacity="0.3" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Data points legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div>
          {data[0].label || new Date(data[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
        {data.length > 2 && (
          <div className="text-center">
            {data[Math.floor(data.length / 2)].label ||
              new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}
        <div className="text-right">
          {data[data.length - 1].label ||
            new Date(data[data.length - 1].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Value range */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <div className="text-gray-400">
          Min: <span className="font-semibold text-white">{minValue}</span>
        </div>
        <div className="text-gray-400">
          Max: <span className="font-semibold text-white">{maxValue}</span>
        </div>
        <div className="text-gray-400">
          Latest: <span className="font-semibold text-white">{data[data.length - 1].value}</span>
        </div>
      </div>
    </div>
  );
}
