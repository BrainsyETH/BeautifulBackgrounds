import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Beautiful Backgrounds.',
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
        Privacy Policy
      </h1>

      <div className="mt-8 space-y-8 text-text-secondary">
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Unofficial
          </h2>
          <p className="mt-3 leading-relaxed">
            Beautiful Backgrounds is an unofficial project. It is
            not endorsed by{' '}
            <a
              href="https://brave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Brave Software, Inc.
            </a>{' '}
            or the{' '}
            <a
              href="https://brave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Brave Browser
            </a>
            . The name &ldquo;Brave&rdquo; and any related trademarks are the
            property of Brave Software, Inc.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Data We Collect
          </h2>
          <p className="mt-3 leading-relaxed">
            This site does not collect, store, or process any personal data. We
            do not use cookies, tracking pixels, analytics services, or any
            other form of user tracking. There are no user accounts, forms, or
            data submission mechanisms on this site.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Third-Party Services
          </h2>
          <p className="mt-3 leading-relaxed">
            This site is hosted on Vercel. Vercel may collect standard server
            logs (such as IP addresses and request timestamps) as part of its
            infrastructure. We do not have access to or control over this data.
            Please refer to{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Vercel&apos;s Privacy Policy
            </a>{' '}
            for details.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Photography &amp; Licensing
          </h2>
          <p className="mt-3 leading-relaxed">
            The photographs displayed on this site were originally sourced from{' '}
            <a
              href="https://brave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Brave Browser
            </a>
            &apos;s New Tab Page component. All images are the
            property of their respective photographers. If you are a
            photographer and would like your work removed, please{' '}
            <a
              href="https://github.com/BrainsyETH/BeautifulBackgrounds/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              open an issue on our GitHub repository
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Changes to This Policy
          </h2>
          <p className="mt-3 leading-relaxed">
            We may update this privacy policy from time to time. Any changes
            will be reflected on this page.
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
          <p className="text-sm leading-relaxed text-text-dim">
            <strong className="text-text-primary">In short:</strong> This is a simple gallery site
            that respects your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
