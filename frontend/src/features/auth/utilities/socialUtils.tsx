import { GoogleIcon, MicrosoftIcon, AppleIcon } from '../components/ui/Icons';
import type { SocialProviderOption } from '../types';

/**
 * Pure helper utility to render the corresponding SVG icon component for a social provider.
 * No React state, no Redux, zero side-effects.
 */
export function renderProviderIcon(provider: SocialProviderOption['provider']) {
  switch (provider) {
    case 'google':
      return <GoogleIcon />;
    case 'microsoft':
      return <MicrosoftIcon />;
    case 'apple':
      return <AppleIcon />;
  }
}
