import type { Metadata } from 'next';
import { Inter, Outfit, Geist } from 'next/font/google';
import '@/styles/globals.css';
import '@/features/intro/styles/intro.css';
import '@/features/home/styles/welcome.css';
import '@/features/home/styles/features.css';


import { ReduxProvider } from '@/shared/components/providers/ReduxProvider';
import { VoiceLoader } from '@/shared/components/providers/VoiceLoader';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Physics Teacher — Prof. Gemini',
  description:
    'An immersive, AI-powered classroom simulator that brings physics lessons to life using Gemini LLM, RAG, and real-time SSE streaming.',
  keywords: ['AI teacher', 'physics', 'Gemini', 'education', 'interactive learning'],
  openGraph: {
    title: 'AI Physics Teacher — Prof. Gemini',
    description:
      'Ask Prof. Gemini any physics question and watch the lecture come alive with chalkboard, diagrams, and voice.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("antialiased", inter.variable, outfit.variable, "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <body className="bg-slate-950 text-white">
        <ReduxProvider>
          <VoiceLoader />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
