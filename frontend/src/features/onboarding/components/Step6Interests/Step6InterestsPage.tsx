'use client';

import { useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  popularSubjects,
  aiRecommendations,
  allSubjects,
  customSuggestions,
} from '../../types';

import { Step6InterestsLayout } from './Step6InterestsLayout';
import { InterestsHeader } from './InterestsHeader';
import { InterestsSearchBar } from './InterestsSearchBar';
import { PopularSubjectsSection } from './PopularSubjectsSection';
import { AIRecommendationsSection } from './AIRecommendationsSection';
import { AllSubjectsSection } from './AllSubjectsSection';
import { CustomSubjectCard } from './CustomSubjectCard';
import { LearningSummarySidebar } from './LearningSummarySidebar';
import { MobileSummaryBar } from './MobileSummaryBar';

export function Step6InterestsPage() {
  const { selectedInterests, toggleInterest, submitInterests } = useOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const filterBySearch = <T extends { name: string }>(items: T[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleAddCustomSubject = (subjectToAdd: string) => {
    const trimmed = subjectToAdd.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      toggleInterest(trimmed);
    }
    setCustomInput('');
    setSearchQuery('');
  };

  return (
    <Step6InterestsLayout
      mobileBar={
        <MobileSummaryBar
          selectedCount={selectedInterests.length}
          onSubmit={submitInterests}
        />
      }
    >
      {/* Left Column: Subject Selection Area */}
      <div className="flex-1 space-y-8 w-full">
        <InterestsHeader />

        <InterestsSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCustom={handleAddCustomSubject}
        />

        <div className="space-y-8">
          <PopularSubjectsSection
            items={filterBySearch(popularSubjects)}
            selectedInterests={selectedInterests}
            onToggleInterest={toggleInterest}
          />

          <AIRecommendationsSection
            items={filterBySearch(aiRecommendations)}
            selectedInterests={selectedInterests}
            onToggleInterest={toggleInterest}
          />

          <AllSubjectsSection
            items={filterBySearch(allSubjects)}
            selectedInterests={selectedInterests}
            onToggleInterest={toggleInterest}
          />

          <CustomSubjectCard
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            onAddCustom={handleAddCustomSubject}
            customSuggestions={customSuggestions}
            selectedInterests={selectedInterests}
            onToggleInterest={toggleInterest}
          />
        </div>
      </div>

      {/* Right Column: Learning Summary Sidebar */}
      <LearningSummarySidebar
        selectedInterests={selectedInterests}
        onToggleInterest={toggleInterest}
        onSubmit={submitInterests}
      />
    </Step6InterestsLayout>
  );
}
