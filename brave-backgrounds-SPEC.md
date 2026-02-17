# Brave Backgrounds — Technical Specification

**Project:** Unofficial Brave NTP Photography Gallery & Web3 Analytics  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres)  
**Deploy:** Vercel  
**Author:** Evan (Brave Support / UX Designer)  
**Status:** Draft  

---

## 1. Project Overview

An unofficial site that:

1. Archives the photography wallpapers that ship on Brave Browser's New Tab Page (NTP)
2. Embeds Dune Analytics dashboards/charts from `https://dune.com/brainsy/brave-web3`

The NTP photos are **not** ads — they're curated landscape/nature photography delivered via Brave's "NTP Background Images" browser component. This site is independent and not affiliated with Brave Software, Inc.

---

## 2. Data Sources

### 2.1 NTP Background Images

Brave ships rotating wallpapers via a browser component called "Brave NTP background images component." These are NOT accessible via a public API or URL. The images live inside the browser's local component storage and are referenced internally via `brave://background-wallpaper/` URLs (not fetchable by web pages).

**Where the data actually lives:**

- **In the brave-core repo** (`backgrounds.ts`): Contains the default/fallback wallpaper metadata. Current file at `brave-core/components/brave_new_tab_ui/data/backgrounds.ts` has a single default entry. Historical entries are visible in git history.
- **In the NTP Background Images component** (`photo.json`): Delivered to browser clients via `brave://components`. Contains the full current rotation with metadata (filename, author, link, license). This file is on the user's local disk in a versioned component directory.

**Data shape** (from `backgrounds.ts` and `photo.json`):

```typescript
interface BraveBackground {
  type: 'brave';
  wallpaperImageUrl: string;    // e.g. "dylan-malval_sea-min.webp"
  author: string;               // e.g. "Dylan Malval"
  link: string;                 // photographer portfolio URL (may be empty)
  originalUrl: string;          // source/origin info
  license: string;              // e.g. "Unsplash License", "used with permission"
}
```

**Known photographers across all seasons** (extracted from git history of brave-core and GitHub issues):

| Season | Photographers |
|--------|-------------|
| Fall 2019 | Anders Jildén, Andreas Gücklhorn, Annie Spratt, Anton Repponen, Joseph Gardner, Matt Palmer, Pok Rie, Xavier Balderas Cejudo |
| 2020/2021 | Alex Plesovskich, Dylan Malval, Corwin Prescott, David Neeleman, Zane Lee, Will Christiansen |
| Fall 2021 | Dylan Malval, Nick Sorocka, Spencer Moore, Corwin Prescott, David Neeleman |
| Spring 2024 | 7 new images (photographers named in internal Brave Slack, some public: Ric Matkowski, Lawrence Braun, Pok Rie, Adrien Olichon, Luca Bravo, Ryan Stefan, Colton Everill) |

**Image acquisition strategy:**

Since `brave://` URLs aren't web-accessible, images must be manually extracted and hosted. Options:

1. **Manual extraction from local Brave install** — Locate the NTP Background Images component directory on disk, find `photo.json` + image files, upload to Supabase Storage or Cloudflare R2
2. **Automated extraction via CI** — GitHub Action that installs Brave, lets components download, extracts images, uploads to storage (more complex but keeps the archive current)
3. **Seed with placeholder gradients initially** — Ship the site with metadata only, add real images as they're extracted

**For MVP, use option 3 (placeholders) with a manual upload flow for real images later.**

### 2.2 Dune Analytics Embeds

Dashboard URL: `https://dune.com/brainsy/brave-web3`

Dune charts can be embedded via iframes using the format:

```html
<iframe src="https://dune.com/embeds/[query-id]/[visualization-id]" height="500" width="100%"></iframe>
```

To get embed URLs: Open any visualization on the dashboard → Click "Share" → Copy the embed iframe code. Dark mode can be toggled in the share menu.

**Store embed configurations in a config file** so they can be updated without code changes:

```typescript
// src/config/dune-embeds.ts
interface DuneEmbed {
  id: string;
  title: string;
  description: string;
  embedUrl: string;          // e.g. "https://dune.com/embeds/1234/5678"
  height: number;            // iframe height in px
  fullWidth: boolean;        // span full grid width
}
```

The initial set of embeds will be populated by Evan from his Dune dashboard. The config should support adding/removing/reordering embeds easily.

---

## 3. Database Schema (Supabase / Postgres)

### 3.1 `backgrounds` table

```sql
CREATE TABLE backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,               -- e.g. "dylan-malval-sea"
  filename TEXT NOT NULL,                   -- original filename from photo.json
  author TEXT NOT NULL,                     -- photographer name
  author_url TEXT,                          -- photographer portfolio/social link
  season TEXT NOT NULL,                     -- e.g. "Spring 2024", "Fall 2021"
  license TEXT,                             -- e.g. "Unsplash License", "used with permission"
  original_url TEXT,                        -- source info
  description TEXT,                         -- brief description of the image
  image_url TEXT,                           -- URL to hosted image (Supabase Storage or R2)
  thumbnail_url TEXT,                       -- smaller version for grid
  width INT,                                -- original image width in px
  height INT,                               -- original image height in px
  dominant_color TEXT,                       -- hex color for placeholder bg
  is_current BOOLEAN DEFAULT false,          -- currently in NTP rotation
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_backgrounds_season ON backgrounds(season);
CREATE INDEX idx_backgrounds_author ON backgrounds(author);
CREATE INDEX idx_backgrounds_is_current ON backgrounds(is_current);
```

### 3.2 `dune_embeds` table (optional — could also just use config file)

```sql
CREATE TABLE dune_embeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  height INT DEFAULT 500,
  full_width BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 Supabase Storage

Create a bucket called `backgrounds` with public read access for serving images.

---

## 4. Project Structure

```
brave-backgrounds/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with nav, footer
│   │   ├── page.tsx                # Home — hero + featured photos + analytics preview
│   │   ├── gallery/
│   │   │   └── page.tsx            # Full gallery grid with filters
│   │   ├── photo/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual photo detail page
│   │   ├── analytics/
│   │   │   └── page.tsx            # Dune dashboards page
│   │   └── about/
│   │       └── page.tsx            # About + data sources explanation
│   ├── components/
│   │   ├── nav.tsx                 # Fixed top navigation
│   │   ├── footer.tsx              # Footer with disclaimer
│   │   ├── photo-card.tsx          # Gallery grid card
│   │   ├── photo-grid.tsx          # Responsive grid container
│   │   ├── photo-lightbox.tsx      # Full-screen image viewer
│   │   ├── season-filter.tsx       # Filter pills by season
│   │   ├── dune-embed.tsx          # Iframe wrapper for Dune charts
│   │   ├── dune-grid.tsx           # Grid layout for embeds
│   │   ├── stats-bar.tsx           # Key stats display
│   │   └── hero.tsx                # Landing hero section
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── queries.ts              # Data fetching functions
│   │   └── utils.ts                # Helpers (slug generation, etc.)
│   ├── config/
│   │   ├── dune-embeds.ts          # Dune embed configurations
│   │   └── site.ts                 # Site metadata, social links
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── public/
│   └── og-image.png                # Open Graph preview image
├── seed/
│   └── backgrounds.ts              # Seed script for initial data
├── supabase/
│   └── migrations/
│       └── 001_create_tables.sql   # Schema migration
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 5. Pages & Routes

### 5.1 Home (`/`)

- Hero section with project title, tagline, and "Unofficial" badge
- Stats bar: total wallpapers, photographers, seasons, "since 2019"
- Featured photos section: 6 latest backgrounds in a grid (link to `/gallery`)
- Analytics preview: 1-2 featured Dune embeds (link to `/analytics`)
- About blurb

### 5.2 Gallery (`/gallery`)

- Filter bar with season pills: "All", "Spring 2024", "Fall 2021", "2020/2021", "Fall 2019"
- Responsive photo grid (masonry or uniform aspect ratio)
- Each card shows: image, photographer name on hover, season badge
- Click opens lightbox OR navigates to `/photo/[slug]`
- Sort by: newest first (default), photographer name

### 5.3 Photo Detail (`/photo/[slug]`)

- Full-width hero image
- Metadata sidebar: photographer, portfolio link, season, license, original URL
- "Download" button (links to full-res hosted image)
- Related photos (same photographer or same season)
- Back to gallery link

### 5.4 Analytics (`/analytics`)

- Section header explaining the Dune data
- Grid of Dune embed iframes, loaded from config
- Each embed in a card with title, description, and "View on Dune" link
- Support for full-width and half-width cards
- Link to full dashboard: `https://dune.com/brainsy/brave-web3`

### 5.5 About (`/about`)

- Explanation of what NTP backgrounds are
- How the data is sourced (component extraction, brave-core repo)
- Disclaimer: unofficial, not affiliated with Brave Software
- Credits to photographers
- Link to brave-core repo, Brave website

---

## 6. Design System

### 6.1 Colors

```css
/* Dark theme inspired by Brave's dark mode */
--bg-primary: #0F0B15;          /* Deep purple-black */
--bg-secondary: #1A1425;        /* Slightly lighter */
--bg-card: #221D2E;             /* Card backgrounds */
--border: #2E2840;              /* Subtle borders */

--brave-orange: #FB542B;        /* Brave's signature orange — use for accents */
--brave-orange-hover: #FF6B42;

--text-primary: #F0ECF5;
--text-secondary: #9B93A8;
--text-dim: #6B6478;
```

### 6.2 Typography

- **Headings:** `Playfair Display` (serif, editorial feel for a photography site)
- **Body:** `DM Sans` (clean sans-serif)
- Import via Google Fonts or `next/font`

### 6.3 Design Notes

- Dark theme throughout — photography-forward, images should be the star
- Minimal chrome, generous whitespace
- Cards with subtle borders, no heavy shadows
- Hover states: slight lift + border color change to `--brave-orange`
- "Unofficial" badge visible in nav (orange outline pill)
- Responsive: single column on mobile, 2-3 columns on desktop
- Lightbox should be dark with blur backdrop
- Season filter pills as horizontal scrollable row on mobile

---

## 7. Component Specifications

### 7.1 `<PhotoCard />`

```typescript
interface PhotoCardProps {
  slug: string;
  imageUrl: string | null;       // null = show placeholder gradient
  thumbnailUrl: string | null;
  author: string;
  season: string;
  description?: string;
  dominantColor?: string;        // for placeholder bg
  featured?: boolean;            // larger card, spans 2 columns
}
```

- Aspect ratio: `16/10` default, `21/9` for featured
- Overlay on hover: gradient from bottom with author name + season badge
- If no `imageUrl`, render a gradient placeholder using `dominantColor` or a generated gradient
- Click navigates to `/photo/[slug]`

### 7.2 `<DuneEmbed />`

```typescript
interface DuneEmbedProps {
  title: string;
  description?: string;
  embedUrl: string;
  height?: number;               // default 400
  fullWidth?: boolean;
}
```

- Wraps an iframe in a styled card
- Card header with title + "Dune Analytics" badge
- Lazy-load iframe (use `loading="lazy"` or IntersectionObserver)
- Footer link: "View on Dune →"
- Loading state: shimmer placeholder while iframe loads

### 7.3 `<SeasonFilter />`

```typescript
interface SeasonFilterProps {
  seasons: string[];
  activeSeason: string;
  onChange: (season: string) => void;
}
```

- Horizontal row of pill buttons
- Active state: filled with `--brave-orange`
- Scrollable on mobile with `overflow-x: auto`

### 7.4 `<PhotoLightbox />`

- Full-screen overlay, `z-index: 200`
- Dark backdrop with blur
- Image centered, max 90vw / 80vh
- Photographer name, description, links below image
- Close on Escape key, click backdrop, or X button
- Arrow keys for prev/next navigation

---

## 8. Data Fetching

### 8.1 Gallery data

Use React Server Components to fetch from Supabase:

```typescript
// src/lib/queries.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getBackgrounds(season?: string) {
  let query = supabase
    .from('backgrounds')
    .select('*')
    .order('sort_order', { ascending: true });

  if (season && season !== 'All') {
    query = query.eq('season', season);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBackgroundBySlug(slug: string) {
  const { data, error } = await supabase
    .from('backgrounds')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getSeasons(): Promise<string[]> {
  const { data } = await supabase
    .from('backgrounds')
    .select('season')
    .order('season');

  const seasons = [...new Set(data?.map(d => d.season))];
  return seasons;
}
```

### 8.2 Dune embeds

Read from config file (no database needed for MVP):

```typescript
// src/config/dune-embeds.ts
export const duneEmbeds: DuneEmbed[] = [
  {
    id: 'bat-overview',
    title: 'BAT Token Overview',
    description: 'Key metrics for the Basic Attention Token',
    embedUrl: 'https://dune.com/embeds/QUERY_ID/VIZ_ID',
    height: 500,
    fullWidth: true,
  },
  // Evan: Add your actual embed URLs here.
  // Get them from dune.com/brainsy/brave-web3 → Share → Embed
];
```

---

## 9. Seed Data

Create a seed script that populates the `backgrounds` table with known photographer data. Images will be null initially (placeholder gradients shown).

```typescript
// seed/backgrounds.ts
const backgrounds = [
  // Spring 2024
  { slug: 'sp24-ric-matkowski', filename: 'ric-matkowski.webp', author: 'Ric Matkowski', author_url: '', season: 'Spring 2024', license: 'used with permission', description: 'Mountain landscape at golden hour', dominant_color: '#2d3436', sort_order: 1 },
  { slug: 'sp24-lawrence-braun', filename: 'lawrence-braun.webp', author: 'Lawrence Braun', author_url: '', season: 'Spring 2024', license: 'used with permission', description: 'Ocean cliffs at sunrise', dominant_color: '#0d1b2a', sort_order: 2 },
  { slug: 'sp24-pok-rie', filename: 'pok-rie-spring24.webp', author: 'Pok Rie', author_url: 'https://www.pexels.com/@pok-rie-33563', season: 'Spring 2024', license: 'Pexels License', description: 'Aerial ocean view', dominant_color: '#003049', sort_order: 3 },
  { slug: 'sp24-adrien-olichon', filename: 'adrien-olichon.webp', author: 'Adrien Olichon', author_url: 'https://unsplash.com/@adrienolichon', season: 'Spring 2024', license: 'Unsplash License', description: 'Mountain range vista', dominant_color: '#1b4332', sort_order: 4 },
  { slug: 'sp24-luca-bravo', filename: 'luca-bravo.webp', author: 'Luca Bravo', author_url: 'https://unsplash.com/@lucabravo', season: 'Spring 2024', license: 'Unsplash License', description: 'Alpine lake reflection', dominant_color: '#0b132b', sort_order: 5 },
  { slug: 'sp24-ryan-stefan', filename: 'ryan-stefan.webp', author: 'Ryan Stefan', author_url: '', season: 'Spring 2024', license: 'used with permission', description: 'Desert canyon sunset', dominant_color: '#d62828', sort_order: 6 },
  { slug: 'sp24-colton-everill', filename: 'colton-everill.webp', author: 'Colton Everill', author_url: '', season: 'Spring 2024', license: 'used with permission', description: 'Forest waterfall', dominant_color: '#132a13', sort_order: 7 },

  // Fall 2021
  { slug: 'f21-dylan-malval-sea', filename: 'dylan-malval_sea.webp', author: 'Dylan Malval', author_url: 'https://www.instagram.com/vass_captures/', season: 'Fall 2021', license: 'used with permission', description: 'Dramatic seascape', dominant_color: '#14213d', sort_order: 10 },
  { slug: 'f21-nick-sorocka', filename: 'nick-sorocka.webp', author: 'Nick Sorocka', author_url: '', season: 'Fall 2021', license: 'used with permission', description: 'Mountain wilderness', dominant_color: '#1c1c1c', sort_order: 11 },
  { slug: 'f21-spencer-moore', filename: 'spencer-moore.webp', author: 'Spencer Moore', author_url: '', season: 'Fall 2021', license: 'used with permission', description: 'Pacific coastline', dominant_color: '#003049', sort_order: 12 },
  { slug: 'f21-corwin-prescott-beach', filename: 'corwin-prescott_beach.avif', author: 'Corwin Prescott', author_url: '', season: 'Fall 2021', license: 'used with permission', description: 'Beach at twilight', dominant_color: '#240046', sort_order: 13 },
  { slug: 'f21-corwin-prescott-canyon', filename: 'corwin-prescott_canyon.avif', author: 'Corwin Prescott', author_url: '', season: 'Fall 2021', license: 'used with permission', description: 'Canyon formations', dominant_color: '#d62828', sort_order: 14 },
  { slug: 'f21-david-neeleman', filename: 'david-neeleman.avif', author: 'David Neeleman', author_url: '', season: 'Fall 2021', license: 'used with permission', description: 'Aerial landscape', dominant_color: '#2d6a4f', sort_order: 15 },

  // 2020/2021
  { slug: '2021-alex-plesovskich', filename: 'alex-plesovskich.avif', author: 'Alex Plesovskich', author_url: 'https://unsplash.com/@aples', season: '2020/2021', license: 'Unsplash License', description: 'Abstract nature scene', dominant_color: '#10002b', sort_order: 20 },
  { slug: '2021-dylan-malval-valley', filename: 'dylan-malval_valley.avif', author: 'Dylan Malval', author_url: 'https://www.instagram.com/vass_captures/', season: '2020/2021', license: 'used with permission', description: 'Valley vista', dominant_color: '#1b4332', sort_order: 21 },
  { slug: '2021-zane-lee', filename: 'zane-lee.avif', author: 'Zane Lee', author_url: '', season: '2020/2021', license: 'used with permission', description: 'Forested mountains', dominant_color: '#132a13', sort_order: 22 },
  { slug: '2021-will-christiansen', filename: 'will-christiansen.avif', author: 'Will Christiansen', author_url: '', season: '2020/2021', license: 'used with permission', description: 'Desert starscape', dominant_color: '#0d1321', sort_order: 23 },

  // Fall 2019 (original set)
  { slug: '2019-anders-jilden', filename: 'anders-jilden.webp', author: 'Anders Jildén', author_url: 'https://unsplash.com/@andersjilden', season: 'Fall 2019', license: 'Unsplash License', description: 'Northern landscapes', dominant_color: '#0d1b2a', sort_order: 30 },
  { slug: '2019-andreas-gucklhorn', filename: 'andreas-gucklhorn.webp', author: 'Andreas Gücklhorn', author_url: 'https://unsplash.com/@draufsicht', season: 'Fall 2019', license: 'Unsplash License', description: 'Solar panels landscape', dominant_color: '#003049', sort_order: 31 },
  { slug: '2019-annie-spratt', filename: 'annie-spratt.webp', author: 'Annie Spratt', author_url: 'https://unsplash.com/@anniespratt', season: 'Fall 2019', license: 'Unsplash License', description: 'Countryside path', dominant_color: '#2d6a4f', sort_order: 32 },
  { slug: '2019-anton-repponen', filename: 'anton-repponen.webp', author: 'Anton Repponen', author_url: 'https://unsplash.com/@repponen', season: 'Fall 2019', license: 'Unsplash License', description: 'Arctic scenery', dominant_color: '#1b263b', sort_order: 33 },
  { slug: '2019-joseph-gardner', filename: 'joseph-gardner.webp', author: 'Joseph Gardner', author_url: 'https://unsplash.com/@josephgardnerphotography', season: 'Fall 2019', license: 'Unsplash License', description: 'Mountain lake', dominant_color: '#14213d', sort_order: 34 },
  { slug: '2019-matt-palmer', filename: 'matt-palmer.webp', author: 'Matt Palmer', author_url: 'https://unsplash.com/@mattpalmer', season: 'Fall 2019', license: 'Unsplash License', description: 'Glacial landscape', dominant_color: '#1c1c1c', sort_order: 35 },
  { slug: '2019-pok-rie', filename: 'pok-rie.webp', author: 'Pok Rie', author_url: 'https://www.pexels.com/@pok-rie-33563', season: 'Fall 2019', license: 'Pexels License', description: 'Tropical waters', dominant_color: '#005f73', sort_order: 36 },
  { slug: '2019-xavier-balderas', filename: 'xavier-balderas.webp', author: 'Xavier Balderas Cejudo', author_url: 'https://unsplash.com/@xavibalderas', season: 'Fall 2019', license: 'Unsplash License', description: 'Aurora borealis', dominant_color: '#0a0908', sort_order: 37 },
];
```

---

## 10. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://brave-backgrounds.vercel.app
```

---

## 11. Key Implementation Details

### 11.1 Image Placeholders

When `image_url` is null (no real image uploaded yet), render a CSS gradient using `dominant_color`:

```tsx
function PlaceholderImage({ color, description }: { color: string; description: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, 30)})`,
      }}
    >
      <span className="text-white/30 text-xs uppercase tracking-widest">
        {description}
      </span>
    </div>
  );
}
```

### 11.2 Dune Embed Lazy Loading

Wrap Dune iframes in an IntersectionObserver so they only load when scrolled into view:

```tsx
'use client';
import { useRef, useState, useEffect } from 'react';

export function DuneEmbed({ embedUrl, height = 400 }: { embedUrl: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height }}>
      {visible ? (
        <iframe src={embedUrl} width="100%" height={height} style={{ border: 'none' }} loading="lazy" />
      ) : (
        <div className="animate-pulse bg-card rounded-lg w-full h-full" />
      )}
    </div>
  );
}
```

### 11.3 Gallery Filtering

Use URL search params for filter state so it's shareable:

```
/gallery                    → all photos
/gallery?season=Spring+2024 → filtered by season
```

Use `useSearchParams()` client-side to read the filter, refetch server-side with the param.

### 11.4 Open Graph / Social Previews

Generate OG images per photo page using Next.js `generateMetadata`:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const photo = await getBackgroundBySlug(params.slug);
  return {
    title: `${photo.author} — Brave Backgrounds`,
    description: `${photo.description} | NTP wallpaper from ${photo.season}`,
    openGraph: {
      images: [photo.image_url || '/og-image.png'],
    },
  };
}
```

---

## 12. Disclaimer Requirements

The following must be visible on every page:

- **Nav:** "Unofficial" badge (orange outline pill)
- **Footer:** "This site is not affiliated with or endorsed by Brave Software, Inc. All photographs are the property of their respective photographers and are used according to their individual licenses."
- **About page:** Full explanation of data sources and independent status

---

## 13. Future Enhancements (Post-MVP)

- **Automated image extraction** — GitHub Action with headless Brave to extract component images on a schedule
- **Image upload admin** — Simple auth-protected page to upload images and map them to database entries
- **NTP ad creatives section** — Pull from the public ads catalog (`https://ads-static.brave.com/v9/catalog`) to show New Tab Takeover sponsored images (separate from the photography)
- **Photographer profiles** — Dedicated pages per photographer with all their Brave contributions
- **RSS feed** — Notify followers when new seasonal images are added
- **Search** — Full-text search across photographer names and descriptions
- **Dune API integration** — Use Dune's API to fetch chart data directly instead of iframes for better UX

---

## 14. Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

---

## 15. Build & Deploy

```bash
# Local dev
npm install
npm run dev

# Seed database
npx tsx seed/backgrounds.ts

# Deploy
# Connect repo to Vercel, set env vars, deploy
```

Vercel settings:
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Summary for Claude Code

**Build a Next.js 14 App Router project** with:

1. A dark-themed photography gallery site using Tailwind CSS
2. Supabase for storing background metadata (seed with the data in Section 9)
3. Gallery page with season filtering via URL params
4. Individual photo detail pages at `/photo/[slug]`
5. Analytics page with Dune Analytics iframe embeds (configurable via `src/config/dune-embeds.ts`)
6. Placeholder gradients for images where `image_url` is null
7. "Unofficial" branding throughout
8. Colors: dark purple-black bg (`#0F0B15`), Brave orange accent (`#FB542B`)
9. Fonts: Playfair Display for headings, DM Sans for body
10. Responsive design, mobile-first
