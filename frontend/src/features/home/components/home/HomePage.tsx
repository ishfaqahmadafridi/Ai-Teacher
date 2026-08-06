'use client';

import { Navbar } from '@/features/home/components/nav/Navbar';
import { WelcomeBadge } from '../welcome/WelcomeBadge';
import { HeroHeader } from '../welcome/HeroHeader';
import { ActionButtons } from '../welcome/ActionButtons';
import { StatsGrid } from '../welcome/StatsGrid';
import { HomeChatTeaser } from './HomeChatTeaser';
import { HomeProvider } from '../../context/HomeContext';

export function HomePage() {
  return (
    <HomeProvider>
      <div
        className="min-h-screen w-full text-white relative overflow-hidden"
        style={{
          background: '#0a0f18',
          fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
        }}
      >
      {/* Immersive Background Glow Orbs */}
      <div 
        className="dash-glow-orb" 
        style={{
          width: '500px',
          height: '500px',
          background: 'rgba(99, 102, 241, 0.15)',
          top: '-10%',
          left: '15%',
        }}
      />
      <div 
        className="dash-glow-orb" 
        style={{
          width: '400px',
          height: '400px',
          background: 'rgba(139, 92, 246, 0.12)',
          bottom: '10%',
          right: '10%',
        }}
      />

      <Navbar />

      <main className="dash-hero-container">
        <WelcomeBadge />
        <HeroHeader />
        <ActionButtons />
        
        {/* Divider */}
        <div className="dash-divider" />
        
        <StatsGrid />
        <HomeChatTeaser />
      </main>
    </div>
    </HomeProvider>
  );
}
