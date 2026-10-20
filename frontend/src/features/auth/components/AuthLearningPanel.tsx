'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { AuthLearningPanelProps } from '../types/authLayout.types';

export const AuthLearningPanel = memo(function AuthLearningPanel({
  imageSrc = '/auth-learning-daylight.jpg',
  imageAlt = 'A student writing in her notebook beside a laptop in a sunlit library',
}: AuthLearningPanelProps) {
  return (
    <aside aria-label="Learning with Neurolearn" className="hidden lg:flex min-w-0 items-center justify-center bg-dashboard-panel p-6 xl:p-8">
      <figure className="w-full max-w-[40rem]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-dashboard-panel">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1408px) 640px, 46vw"
            priority
            className="object-cover"
          />
        </div>
        <figcaption className="px-1 pt-5">
          <p className="text-xl font-semibold tracking-tight text-dashboard-text">A little curiosity goes a long way.</p>
          <p className="mt-2 text-sm leading-6 text-dashboard-muted">Make space for new ideas. Learn at your own pace.</p>
        </figcaption>
      </figure>
    </aside>
  );
});

AuthLearningPanel.displayName = 'AuthLearningPanel';
