'use client';

import { FAQSection } from './FAQSection';
import { Navbar } from '@/features/home/components/nav/Navbar';
import { WhyChooseUs } from './WhyChooseUs/WhyChooseUs';
import { FutureInterface } from './FutureInterface/FutureInterface';
import { TailoredLevels } from './TailoredLevels/TailoredLevels';
import { HomeProvider } from '../../context/HomeContext';

export function FeaturesPage() {
  return (
    <HomeProvider>
      <div
        className="min-h-screen w-full bg-dashboard-bg text-dashboard-text relative overflow-hidden"
        style={{
          fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
          paddingTop: '80px', // offset for fixed navbar
        }}
      >
        <Navbar />

        <WhyChooseUs />
        <FutureInterface />
        <TailoredLevels />
        <FAQSection />
      </div>
    </HomeProvider>
  );
}

export default FeaturesPage;
