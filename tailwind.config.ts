import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F0B15',
        'bg-secondary': '#1A1425',
        'bg-card': '#221D2E',
        'border-subtle': '#2E2840',
        'brave-orange': '#FB542B',
        'brave-orange-hover': '#FF6B42',
        'text-primary': '#F0ECF5',
        'text-secondary': '#9B93A8',
        'text-dim': '#6B6478',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        '16/10': '16 / 10',
        '21/9': '21 / 9',
      },
    },
  },
  plugins: [],
};

export default config;
