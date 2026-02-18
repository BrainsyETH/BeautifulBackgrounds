export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Beautiful Backgrounds
      </h1>
      <p className="mt-2 max-w-lg text-sm text-text-secondary">
        A curated gallery of the stunning photography wallpapers from{' '}
        <a
          href="https://brave.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brave-orange hover:text-brave-orange-hover"
        >
          Brave Browser
        </a>
        &apos;s New Tab Page. This is an unofficial project.
      </p>
    </section>
  );
}
