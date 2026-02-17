import type { DuneQueryResult } from '@/types';

const DUNE_API_BASE = 'https://api.dune.com/api/v1';

export async function fetchDuneQuery(queryId: number): Promise<DuneQueryResult | null> {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) {
    console.warn('DUNE_API_KEY not set — skipping Dune fetch for query', queryId);
    return null;
  }

  try {
    const res = await fetch(`${DUNE_API_BASE}/query/${queryId}/results`, {
      headers: { 'X-Dune-API-Key': apiKey },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      console.error(`Dune API error for query ${queryId}: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error(`Failed to fetch Dune query ${queryId}:`, err);
    return null;
  }
}

/**
 * Format Dune row data for Recharts.
 * Automatically detects date/number columns and returns formatted data.
 */
export function formatDuneData(
  result: DuneQueryResult
): Record<string, unknown>[] {
  if (!result?.result?.rows) return [];

  return result.result.rows.map((row) => {
    const formatted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      // Shorten date strings for chart labels
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        formatted[key] = value.slice(0, 10);
      } else {
        formatted[key] = value;
      }
    }
    return formatted;
  });
}
