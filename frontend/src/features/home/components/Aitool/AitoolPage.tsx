'use client';

import { Navbar } from '@/features/home/components/nav/Navbar';
import { AitoolSection } from './AitoolSection';
import { AiTutorDetail } from './AiTutorDetail';
import { AiQuizDetail } from './AiQuizDetail';
import { AiCareerDetail } from './AiCareerDetail';
import { AiChatDetail } from './AiChatDetail';
import { AiPlannerDetail } from './AiPlannerDetail';
import { AiReviewDetail } from './AiReviewDetail';
import { HomeProvider } from '../../context/HomeContext';

export function AitoolPage() {
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

        <AiTutorDetail />
        <AiQuizDetail />
        <AiCareerDetail />
        <AiChatDetail />
        <AiPlannerDetail />
        <AiReviewDetail />
        <AitoolSection />
      </div>
    </HomeProvider>
  );
}

export default AitoolPage;
