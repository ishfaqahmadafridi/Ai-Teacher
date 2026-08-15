'use client';

import { memo } from 'react';
import { useStep6Interests } from '../../hooks';
import {
  subjectCategories,
  customSuggestions,
} from '../../types';

import { Step6InterestsLayout } from './Step6InterestsLayout';
import { InterestsHeader } from './InterestsHeader';
import { InterestsSearchBar } from './InterestsSearchBar';
import { CategorizedSubjectsSection } from './CategorizedSubjectsSection';
import { CustomSubjectCard } from './CustomSubjectCard';
import { LearningSummarySidebar } from './LearningSummarySidebar';
import { MobileSummaryBar } from './MobileSummaryBar';

export const Step6InterestsPage = memo(function Step6InterestsPage() {
  const {
    selectedInterests,
    searchQuery,
    customInput,
    toggleInterest,
    submitInterests,
    setSearchQuery,
    setCustomInput,
    handleAddCustomSubject,
  } = useStep6Interests();

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
          <CategorizedSubjectsSection
            categories={subjectCategories}
            searchQuery={searchQuery}
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
});

Step6InterestsPage.displayName = 'Step6InterestsPage';
