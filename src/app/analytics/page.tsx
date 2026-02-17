import type { Metadata } from 'next';
import { DuneGrid } from '@/components/dune-grid';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Analytics',
  description:
    'On-chain analytics from the Brave ecosystem powered by Dune Analytics.',
};

export default function AnalyticsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
          Web3 Analytics
        </h1>
        <p className="mt-2 text-text-secondary">
          On-chain data from the Brave ecosystem, powered by{' '}
          <a
            href={siteConfig.links.duneDashboard}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brave-orange hover:text-brave-orange-hover"
          >
            Dune Analytics
          </a>
        </p>
      </div>

      <DuneGrid />

      <div className="mt-8 text-center">
        <a
          href={siteConfig.links.duneDashboard}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brave-orange"
        >
          View full dashboard on Dune &rarr;
        </a>
      </div>
    </section>
  );
}
