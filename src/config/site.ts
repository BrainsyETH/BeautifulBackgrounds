import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Brave Backgrounds',
  description:
    'An unofficial archive of the photography wallpapers that ship on Brave Browser\'s New Tab Page, paired with Web3 analytics from Dune.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://brave-backgrounds.vercel.app',
  ogImage: '/og-image.png',
  links: {
    duneDashboard: 'https://dune.com/brainsy/brave-web3',
    braveCore: 'https://github.com/nickel-browser/nickel-core',
    brave: 'https://brave.com',
  },
};
