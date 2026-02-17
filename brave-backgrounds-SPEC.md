# Brave Backgrounds — Technical Specification

**Project:** Unofficial Brave NTP Photography Gallery
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS
**Data:** Static JSON + automated GitHub Actions pipeline
**Deploy:** Vercel
**Author:** Evan (Brave Support / UX Designer)
**Status:** v3 — Backgrounds-focused (no external database)

---

## 1. Project Overview

An unofficial site that archives the photography wallpapers that ship on Brave Browser's New Tab Page (NTP).

The NTP photos are **not** ads — they're curated landscape/nature photography delivered via Brave's "NTP Background Images" browser component. This site is independent and not affiliated with Brave Software, Inc.

### Architecture Decisions

| Concern | Approach |
|---------|----------|
| Database | **None** — static JSON file (`data/backgrounds.json`) in the repo |
| Image storage | **In-repo** — `public/backgrounds/` committed by GitHub Action |
| Image pipeline | **Automated** — weekly GitHub Action installs Brave, extracts images |
| Data fetching | **Static imports** — JSON imported at build time |
| Deploy | **Vercel** — auto-deploys on push |

---

## 2. Data Source — NTP Background Images

Brave ships rotating wallpapers via a browser component called "Brave NTP background images component." These are NOT accessible via a public API or URL. The images live inside the browser's local component storage and are referenced internally via `brave://background-wallpaper/` URLs (not fetchable by web pages).

**Where the data actually lives:**

- **In the brave-core repo** (`backgrounds.ts`): Contains the default/fallback wallpaper metadata. Historical entries are visible in git history.
- **In the NTP Background Images component** (`photo.json`): Delivered to browser clients via `brave://components`. Contains the full current rotation with metadata (filename, author, link, license).

**Image access method:**

Images can be found by opening a New Tab in Brave, then in DevTools (F12) → Network tab → look for the photographer name in `.jpg` format. Example: `brave://background-wallpaper/colton-everill.jpg`

**Data shape** (from `photo.json`):

```typescript
interface BraveBackground {
  type: 'brave';
  wallpaperImageUrl: string;    // e.g. "colton-everill.jpg"
  author: string;               // e.g. "Colton Everill"
  link: string;                 // photographer portfolio URL
  originalUrl: string;          // source/origin info
  license: string;              // e.g. "Unsplash License", "used with permission"
}
```

**Known photographers across all seasons:**

| Season | Photographers |
|--------|-------------|
| Fall 2019 | Anders Jildén, Andreas Gücklhorn, Annie Spratt, Anton Repponen, Joseph Gardner, Matt Palmer, Pok Rie, Xavier Balderas Cejudo |
| 2020/2021 | Alex Plesovskich, Dylan Malval, Zane Lee, Will Christiansen |
| Fall 2021 | Dylan Malval, Nick Sorocka, Spencer Moore, Corwin Prescott (×2), David Neeleman |
| Spring 2024 | Ric Matkowski, Lawrence Braun, Pok Rie, Adrien Olichon, Luca Bravo, Ryan Stefan, Colton Everill |

---

## 3. Data Layer (No Database)

### 3.1 `data/backgrounds.json`

All background metadata lives in a single JSON file, committed to the repo. This file is updated automatically by the GitHub Action when new wallpapers are detected.

```typescript
interface Background {
  slug: string;            // URL-friendly ID, e.g. "sp24-colton-everill"
  filename: string;        // image filename, e.g. "colton-everill.jpg"
  author: string;
  author_url: string;
  season: string;          // e.g. "Spring 2024"
  license: string;
  original_url: string;
  description: string;
  image_url: string | null;      // path to hosted image, null = placeholder
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  dominant_color: string;        // hex color for placeholder gradient
  is_current: boolean;           // currently in NTP rotation
  sort_order: number;
}
```

### 3.2 Image Storage

Images are stored in `public/backgrounds/` and served as static assets by Next.js/Vercel.

- Estimated size: ~25 images × ~500KB = ~12MB (manageable in git)
- Format: `.jpg` as delivered by Brave component
- New seasons add ~5-8 images per year

---

## 4. Automated Image Pipeline

### 4.1 GitHub Action (`.github/workflows/extract-backgrounds.yml`)

**Schedule:** Weekly (Monday 06:00 UTC) + manual trigger

**Pipeline:**

```
1. Checkout repo
2. Install Brave Browser on Ubuntu runner
3. Launch Brave headless → triggers NTP component download
4. Wait for photo.json to appear (polls every 10s, up to 3 min)
5. Run extraction script (scripts/extract-backgrounds.sh)
6. Script parses photo.json, copies images, merges into backgrounds.json
7. If new images found → commit + push
8. Vercel auto-deploys on new commit
```

### 4.2 Extraction Script (`scripts/extract-backgrounds.sh`)

- Searches Brave user data for `photo.json`
- Parses metadata using embedded Node.js
- Copies image files to `public/backgrounds/`
- Merges new entries into `data/backgrounds.json`
- Marks old images as `is_current: false`
- Idempotent — safe to run multiple times

---

## 5. Project Structure

```
brave-backgrounds/
├── .github/
│   └── workflows/
│       └── extract-backgrounds.yml    # Weekly automated extraction
├── scripts/
│   └── extract-backgrounds.sh         # Image extraction script
├── data/
│   └── backgrounds.json               # All background metadata (auto-updated)
├── public/
│   └── backgrounds/                   # Images (auto-committed by Action)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with nav, footer, fonts
│   │   ├── globals.css                # Tailwind + base styles
│   │   ├── page.tsx                   # Home — hero, stats, featured
│   │   ├── gallery/
│   │   │   ├── page.tsx               # Gallery with season filtering
│   │   │   └── gallery-content.tsx    # Client-side filter + lightbox state
│   │   ├── photo/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Photo detail with metadata sidebar
│   │   └── about/
│   │       └── page.tsx               # About, data sources, disclaimer
│   ├── components/
│   │   ├── nav.tsx                    # Fixed nav with mobile menu
│   │   ├── footer.tsx                 # Footer with disclaimer
│   │   ├── hero.tsx                   # Landing hero section
│   │   ├── stats-bar.tsx              # Key stats (wallpapers, photographers, etc.)
│   │   ├── photo-card.tsx             # Gallery card with hover overlay
│   │   ├── photo-grid.tsx             # Responsive grid container
│   │   ├── photo-lightbox.tsx         # Full-screen image viewer with keyboard nav
│   │   └── season-filter.tsx          # Filter pills (URL-param based)
│   ├── lib/
│   │   ├── backgrounds.ts            # Query functions over JSON data
│   │   └── utils.ts                   # Color adjustment, slugify, etc.
│   ├── config/
│   │   └── site.ts                    # Site metadata, URLs
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
└── brave-backgrounds-SPEC.md
```

---

## 6. Pages & Routes

### 6.1 Home (`/`)

- Hero section with project title, tagline, and "Unofficial" badge
- Stats bar: total wallpapers, photographers, seasons, "since 2019"
- Featured photos: current NTP rotation in a grid (links to `/gallery`)
- About blurb explaining what the site is

### 6.2 Gallery (`/gallery`)

- Season filter pills: "All", "Spring 2024", "Fall 2021", "2020/2021", "Fall 2019"
- URL-param based filtering (`/gallery?season=Spring+2024`) for shareable links
- Responsive photo grid (1 col mobile, 2-3 cols desktop)
- Cards show: image (or gradient placeholder), author + season on hover
- First card in "All" view spans 2 columns (featured)
- Count display: "25 wallpapers"

### 6.3 Photo Detail (`/photo/[slug]`)

- Full-width hero image (50-70vh)
- Gradient overlay fading to page background
- Metadata sidebar: photographer, portfolio link, season, license, filename
- "Currently in rotation" badge for active wallpapers
- Download button (direct link to image)
- Related wallpapers (same author, then same season)
- Back to gallery link
- Static generation via `generateStaticParams`

### 6.4 About (`/about`)

- What NTP backgrounds are
- How data is sourced (component extraction, brave-core repo, weekly automation)
- Season links to filtered gallery
- Disclaimer: unofficial, not affiliated with Brave Software

---

## 7. Design System

### 7.1 Colors

```css
--bg-primary: #0F0B15;          /* Deep purple-black */
--bg-secondary: #1A1425;        /* Slightly lighter */
--bg-card: #221D2E;             /* Card backgrounds */
--border: #2E2840;              /* Subtle borders */

--brave-orange: #FB542B;        /* Accent color */
--brave-orange-hover: #FF6B42;

--text-primary: #F0ECF5;
--text-secondary: #9B93A8;
--text-dim: #6B6478;
```

### 7.2 Typography

- **Headings:** `Playfair Display` (serif, editorial feel)
- **Body:** `DM Sans` (clean sans-serif)
- Loaded via Google Fonts `<link>` tag

### 7.3 Design Notes

- Dark theme throughout — photography-forward
- Minimal chrome, generous whitespace
- Cards with subtle borders, no heavy shadows
- Hover: slight lift (`-translate-y-0.5`) + orange border
- "Unofficial" badge: orange outline pill in nav and hero
- Mobile-first responsive design
- Season filter: horizontal scrollable pills on mobile
- Lightbox: dark backdrop with blur, keyboard navigation (Escape, arrows)

---

## 8. Component Specifications

### 8.1 `<PhotoCard />`

- Aspect ratio: `16/10` default, `21/9` for featured
- Overlay on hover: gradient from bottom with author name + season badge
- If no `image_url`: gradient placeholder using `dominant_color`
- Click navigates to `/photo/[slug]`

### 8.2 `<SeasonFilter />`

- Horizontal pill buttons, scrollable on mobile
- Active state: filled `--brave-orange`
- Updates URL search params for shareable filters

### 8.3 `<PhotoLightbox />`

- Full-screen overlay, `z-index: 200`
- Dark backdrop with blur
- Close on Escape, backdrop click, or X button
- Arrow keys + buttons for prev/next navigation

---

## 9. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://brave-backgrounds.vercel.app
```

---

## 10. Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4",
    "autoprefixer": "^10",
    "postcss": "^8",
    "eslint": "^8",
    "eslint-config-next": "^14"
  }
}
```

---

## 11. Build & Deploy

```bash
# Local dev
npm install
npm run dev

# Production build
npm run build

# Manual image extraction (requires Brave installed locally)
bash scripts/extract-backgrounds.sh
```

Vercel settings:
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Environment variables: `NEXT_PUBLIC_SITE_URL`

---

## 12. Disclaimer Requirements

Visible on every page:

- **Nav:** "Unofficial" badge (orange outline pill)
- **Footer:** "This site is not affiliated with or endorsed by Brave Software, Inc. All photographs are the property of their respective photographers and are used according to their individual licenses."
- **About page:** Full explanation of data sources and independent status

---

## 13. Future Enhancements (Post-MVP)

- **Dominant color extraction** — Auto-detect from images during extraction pipeline
- **Image optimization** — Convert to WebP/AVIF during extraction, generate thumbnails
- **Photographer profiles** — Dedicated pages per photographer with all contributions
- **RSS feed** — Notify followers when new seasonal images are added
- **Search** — Full-text search across photographer names and descriptions
