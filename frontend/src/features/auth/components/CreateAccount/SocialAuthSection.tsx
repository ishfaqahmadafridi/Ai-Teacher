'use client';

import { memo } from 'react';
import { SOCIAL_PROVIDERS } from '../../constants';
import { getInputStyle, renderProviderIcon } from '../../utilities';
import { useSocialAuth } from '../../hooks/useSocialAuth';
import type { SocialAuthSectionProps, SocialProviderOption } from '../../types';

export const SocialAuthSection = memo(function SocialAuthSection(props: SocialAuthSectionProps) {
  const {
    showDivider = true,
    dividerText = 'Or sign up with',
  } = props;

  const { getClickHandler } = useSocialAuth(props);

  return (
    <>
      {showDivider && (
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 text-[#64748b] uppercase tracking-wider">{dividerText}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {SOCIAL_PROVIDERS.map((item: SocialProviderOption) => (
          <button
            key={item.id}
            type="button"
            onClick={getClickHandler(item.provider)}
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-white text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
            style={getInputStyle()}
          >
            {renderProviderIcon(item.provider)}
            <span className="hidden sm:inline text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
});

SocialAuthSection.displayName = 'SocialAuthSection';
