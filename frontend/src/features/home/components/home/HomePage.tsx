'use client';

import { Navbar } from '@/features/home/components/nav/Navbar';
import { WelcomeBadge } from '../welcome/WelcomeBadge';
import { HeroHeader } from '../welcome/HeroHeader';
import { ActionButtons } from '../welcome/ActionButtons';
import { HomeChatTeaser } from './HomeChatTeaser';
import { HomeProvider } from '../../context/HomeContext';

export function HomePage() {
  return (
    <HomeProvider>
      <div
        className="min-h-screen w-full bg-dashboard-bg text-dashboard-text relative overflow-hidden"
        style={{
          fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
        }}
      >
        <Navbar />

        <main className="dash-hero-container">
          <WelcomeBadge />
          <HeroHeader />
          <ActionButtons />
          
          {/* Divider */}
          <div className="dash-divider" />
          
          <HomeChatTeaser />
        </main>
      </div>
    </HomeProvider>
  );
}
