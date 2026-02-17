import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Beautiful Backgrounds',
  description:
    'A curated gallery of stunning photography wallpapers from browser New Tab Pages.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://beautiful-backgrounds.vercel.app',
  ogImage: '/og-image.png',
  links: {
    braveCore: 'https://github.com/nickel-browser/nickel-core',
    brave: 'https://brave.com',
  },
};
