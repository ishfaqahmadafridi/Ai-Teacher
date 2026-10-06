import { Inter, Outfit, Geist } from 'next/font/google';

export const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

