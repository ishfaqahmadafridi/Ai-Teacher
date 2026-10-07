import type { RootLayoutProps } from '@/shared/types/layout.types';
import { geist, inter, outfit } from '@/shared/utilities/layoutFonts';

import '@/styles/globals.css';
import '@/features/intro/styles/intro.css';
import '@/features/home/styles/welcome.css';
import '@/features/home/styles/features.css';


import { QueryProvider } from '@/shared/components/providers/QueryProvider';
import { ReduxProvider } from '@/shared/components/providers/ReduxProvider';
import { VoiceLoader } from '@/shared/components/providers/VoiceLoader';
import { cn } from "@/lib/utils";

export { metadata } from '@/shared/constants/layoutConstants';

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" className={cn("antialiased", inter.variable, outfit.variable, "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <body className="bg-slate-950 text-white">
        <QueryProvider>
        <ReduxProvider>
          <VoiceLoader />
          {children}
        </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
