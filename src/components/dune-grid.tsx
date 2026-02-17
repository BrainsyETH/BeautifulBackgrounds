import { duneQueries } from '@/config/dune-queries';
import { fetchDuneQuery, formatDuneData } from '@/lib/dune';
import { siteConfig } from '@/config/site';
import { DuneChartCard } from './dune-chart-card';

export async function DuneGrid() {
  if (duneQueries.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
        <p className="text-text-secondary">
          No analytics queries configured yet.
        </p>
        <p className="mt-2 text-sm text-text-dim">
          Add your Dune query IDs to{' '}
          <code className="rounded bg-bg-secondary px-1.5 py-0.5 text-brave-orange">
            src/config/dune-queries.ts
          </code>{' '}
          to display charts here.
        </p>
        <a
          href={siteConfig.links.duneDashboard}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-brave-orange hover:text-brave-orange-hover"
        >
          View Dashboard on Dune &rarr;
        </a>
      </div>
    );
  }

  const results = await Promise.all(
    duneQueries.map(async (query) => {
      const result = await fetchDuneQuery(query.queryId);
      return {
        config: query,
        data: result ? formatDuneData(result) : [],
        columns: result?.result?.metadata?.column_names ?? [],
      };
    })
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {results.map(({ config, data, columns }) => (
        <div
          key={config.id}
          className={config.fullWidth ? 'sm:col-span-2' : ''}
        >
          <DuneChartCard config={config} data={data} columns={columns} />
        </div>
      ))}
    </div>
  );
}
