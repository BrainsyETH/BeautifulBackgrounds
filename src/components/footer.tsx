import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              Brave Backgrounds
            </h3>
            <p className="mt-2 text-sm text-text-dim">
              An unofficial archive of Brave Browser&apos;s New Tab Page
              photography wallpapers.
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
                <a
                  href={siteConfig.links.brave}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-dim transition-colors hover:text-text-primary"
                >
                  Brave Browser &darr;
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Legal
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-text-dim">
              This site is not affiliated with or endorsed by Brave Software,
              Inc. All photographs are the property of their respective
              photographers and are used according to their individual licenses.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border-subtle pt-6 text-center text-xs text-text-dim">
          &copy; {new Date().getFullYear()} Brave Backgrounds
        </div>
      </div>
    </footer>
  );
}
