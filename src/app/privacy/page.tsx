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
            No Affiliation
          </h2>
          <p className="mt-3 leading-relaxed">
            Beautiful Backgrounds is an independent, unofficial project. It is
            not affiliated with, endorsed by, or in any way officially connected
            to Brave Software, Inc. or the Brave Browser. The name
            &ldquo;Brave&rdquo; and any related trademarks are the property of
            Brave Software, Inc.
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
            for details. Google Fonts are loaded for typography, which may
            result in requests to Google&apos;s servers.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Photography &amp; Licensing
          </h2>
          <p className="mt-3 leading-relaxed">
            The photographs displayed on this site were originally sourced from
            Brave Browser&apos;s New Tab Page component. All images are the
            property of their respective photographers and are used under their
            individual licenses (primarily the Unsplash License). If you are a
            photographer and would like your work removed, please open an issue
            on our GitHub repository.
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
            <strong className="text-text-primary">In short:</strong> We
            don&apos;t track you, we don&apos;t collect your data, and we
            aren&apos;t affiliated with Brave. This is a simple gallery site
            that respects your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
