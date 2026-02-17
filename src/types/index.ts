export interface Background {
  slug: string;
  filename: string;
  author: string;
  author_url: string;
  season: string;
  license: string;
  original_url: string;
  description: string;
  image_url: string | null;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  dominant_color: string;
  is_current: boolean;
  sort_order: number;
}

export interface DuneQueryConfig {
  id: string;
  title: string;
  description: string;
  queryId: number;
  visualizationType: 'bar' | 'line' | 'area' | 'pie' | 'table';
  fullWidth?: boolean;
  height?: number;
}

export interface DuneQueryResult {
  execution_id: string;
  query_id: number;
  state: string;
  result: {
    rows: Record<string, unknown>[];
    metadata: {
      column_names: string[];
      column_types: string[];
      row_count: number;
    };
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    duneDashboard: string;
    braveCore: string;
    brave: string;
  };
}
