import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              Beautiful Backgrounds
            </h3>
            <p className="mt-2 text-sm text-text-dim">
              A curated gallery of stunning photography wallpapers from
              browser New Tab Pages.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Links
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/gallery"
                  className="text-sm text-text-dim transition-colors hover:text-text-primary"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-dim transition-colors hover:text-text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-dim transition-colors hover:text-text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Legal
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-text-dim">
              This site is not affiliated with or endorsed by{' '}
              <a
                href="https://brave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary"
              >
                Brave Software, Inc
              </a>
              . All photographs are the property of their respective
              photographers and are used according to their individual licenses.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border-subtle pt-6 text-center text-xs text-text-dim">
          &copy; {new Date().getFullYear()} Beautiful Backgrounds
        </div>
      </div>
    </footer>
  );
}
