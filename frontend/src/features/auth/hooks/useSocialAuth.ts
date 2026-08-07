import { useCallback } from 'react';
import type { SocialProviderOption, SocialAuthSectionProps } from '../types';

export interface UseSocialAuthReturn {
  getClickHandler: (provider: SocialProviderOption['provider']) => (() => void) | undefined;
}

export function useSocialAuth(props: SocialAuthSectionProps): UseSocialAuthReturn {
  const { onGoogleClick, onMicrosoftClick, onAppleClick } = props;

  const getClickHandler = useCallback(
    (provider: SocialProviderOption['provider']) => {
      switch (provider) {
        case 'google':
          return onGoogleClick;
        case 'microsoft':
          return onMicrosoftClick;
        case 'apple':
          return onAppleClick;
      }
    },
    [onGoogleClick, onMicrosoftClick, onAppleClick]
  );

  return { getClickHandler };
}
