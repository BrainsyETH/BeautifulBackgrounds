import { Hero } from '@/components/hero';
import { PhotoGrid } from '@/components/photo-grid';
import { getAllBackgrounds } from '@/lib/backgrounds';

export default function HomePage() {
  const backgrounds = getAllBackgrounds().filter((bg) => bg.image_url !== null);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <PhotoGrid backgrounds={backgrounds} />
      </section>
    </>
  );
}
