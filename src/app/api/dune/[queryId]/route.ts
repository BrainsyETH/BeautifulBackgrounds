import { NextResponse } from 'next/server';
import { fetchDuneQuery, formatDuneData } from '@/lib/dune';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const id = parseInt(queryId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid query ID' }, { status: 400 });
  }

  const result = await fetchDuneQuery(id);

  if (!result) {
    return NextResponse.json(
      { error: 'Failed to fetch query results' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    data: formatDuneData(result),
    columns: result.result?.metadata?.column_names ?? [],
    rowCount: result.result?.metadata?.row_count ?? 0,
  });
}
