'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { DuneQueryConfig } from '@/types';

interface DuneChartProps {
  config: DuneQueryConfig;
  data: Record<string, unknown>[];
  columns: string[];
}

const CHART_COLORS = [
  '#FB542B',
  '#FF6B42',
  '#9B93A8',
  '#6B6478',
  '#F0ECF5',
  '#2E2840',
];

const tooltipStyle = {
  backgroundColor: '#221D2E',
  border: '1px solid #2E2840',
  borderRadius: '8px',
  color: '#F0ECF5',
  fontSize: '12px',
};

export function DuneChart({ config, data, columns }: DuneChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-dim">
        No data available
      </div>
    );
  }

  // Use first column as X axis, rest as data series
  const xKey = columns[0];
  const dataKeys = columns.slice(1);

  const height = config.height || 350;

  switch (config.visualizationType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2840" />
            <XAxis dataKey={xKey} tick={{ fill: '#6B6478', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B6478', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2840" />
            <XAxis dataKey={xKey} tick={{ fill: '#6B6478', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B6478', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            {dataKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2840" />
            <XAxis dataKey={xKey} tick={{ fill: '#6B6478', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B6478', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              label={({ name }) => name}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-dim"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border-subtle/50 transition-colors hover:bg-bg-secondary"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2 text-text-secondary">
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}
