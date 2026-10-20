'use client';

import { memo } from 'react';
import { AuthLearningPanel } from '../AuthLearningPanel';

export const LoginHeroPanel = memo(function LoginHeroPanel() {
  return <AuthLearningPanel imageSrc="/auth-signin-reading.jpg" imageAlt="A student reading a book at a table in a bright university library" />;
});

LoginHeroPanel.displayName = 'LoginHeroPanel';
