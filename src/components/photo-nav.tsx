'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PhotoNavProps {
  prevSlug: string | null;
  nextSlug: string | null;
}

export function PhotoNav({ prevSlug, nextSlug }: PhotoNavProps) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/');
      } else if (e.key === 'ArrowLeft' && prevSlug) {
        router.push(`/photo/${prevSlug}`);
      } else if (e.key === 'ArrowRight' && nextSlug) {
        router.push(`/photo/${nextSlug}`);
      }
    },
    [router, prevSlug, nextSlug]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Escape hint */}
      <button
        onClick={() => router.push('/')}
        className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
      >
        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
          ESC
        </kbd>
        Home
      </button>

      {/* Prev arrow */}
      {prevSlug && (
        <Link
          href={`/photo/${prevSlug}`}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          aria-label="Previous photo"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}

      {/* Next arrow */}
      {nextSlug && (
        <Link
          href={`/photo/${nextSlug}`}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          aria-label="Next photo"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </>
  );
}
