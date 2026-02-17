'use client';

import { DuneChart } from './dune-chart';
import type { DuneQueryConfig } from '@/types';

interface DuneChartCardProps {
  config: DuneQueryConfig;
  data: Record<string, unknown>[];
  columns: string[];
}

export function DuneChartCard({ config, data, columns }: DuneChartCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {config.title}
          </h3>
          {config.description && (
            <p className="mt-0.5 text-xs text-text-dim">
              {config.description}
            </p>
          )}
        </div>
        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-dim">
          Dune Analytics
        </span>
      </div>

      <div className="p-4">
        <DuneChart config={config} data={data} columns={columns} />
      </div>
    </div>
  );
}
