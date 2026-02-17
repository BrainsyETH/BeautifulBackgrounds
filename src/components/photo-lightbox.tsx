'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { adjustBrightness, getImagePath } from '@/lib/utils';
import type { Background } from '@/types';

interface PhotoLightboxProps {
  background: Background;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function PhotoLightbox({
  background,
  onClose,
  onPrev,
  onNext,
}: PhotoLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const hasImage = background.image_url !== null;
  const imageSrc = hasImage ? getImagePath(background.filename) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev/Next arrows */}
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Previous"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Next"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${background.description} by ${background.author}`}
            width={1920}
            height={1200}
            className="max-h-[80vh] w-auto rounded-lg object-contain"
            priority
          />
        ) : (
          <div
            className="flex h-[50vh] w-[80vw] max-w-4xl items-center justify-center rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${background.dominant_color}, ${adjustBrightness(background.dominant_color, 40)})`,
            }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-white/30">
              {background.description}
            </span>
          </div>
        )}

        {/* Info below image */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-white">
            {background.author}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {background.description} &middot; {background.season}
          </p>
        </div>
      </div>
    </div>
  );
}
