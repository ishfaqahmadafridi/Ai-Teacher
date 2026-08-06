'use client';

import { Navbar } from '@/features/home/components/nav/Navbar';
import { WhyChooseUs } from './WhyChooseUs/WhyChooseUs';
import { FutureInterface } from './FutureInterface/FutureInterface';
import { TailoredLevels } from './TailoredLevels/TailoredLevels';
import { HomeProvider } from '../../context/HomeContext';

export function FeaturesPage() {
  return (
    <HomeProvider>
      <div
        className="min-h-screen w-full text-white relative overflow-hidden"
        style={{
          background: '#0a0f18',
          fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
          paddingTop: '80px', // offset for fixed navbar
        }}
      >
        {/* Immersive Background Glow Orbs */}
        <div 
          className="dash-glow-orb" 
          style={{
            width: '600px',
            height: '600px',
            background: 'rgba(139, 92, 246, 0.12)',
            top: '10%',
            left: '-10%',
          }}
        />
        <div 
          className="dash-glow-orb" 
          style={{
            width: '500px',
            height: '500px',
            background: 'rgba(99, 102, 241, 0.1)',
            bottom: '20%',
            right: '-5%',
          }}
        />

        <Navbar />

        <WhyChooseUs />
        <FutureInterface />
        <TailoredLevels />
      </div>
    </HomeProvider>
  );
}

export default FeaturesPage;
