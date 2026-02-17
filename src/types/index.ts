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

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    braveCore: string;
    brave: string;
  };
}
