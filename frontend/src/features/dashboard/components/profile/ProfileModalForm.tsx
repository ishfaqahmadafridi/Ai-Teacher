'use client';

import Link from 'next/link';
import { ProfileModalTabNav } from './ProfileModalTabNav';
import { ProfilePersonalTab } from './ProfilePersonalTab';
import { ProfilePreferencesTab } from './ProfilePreferencesTab';
import { ProfileModalFooter } from './ProfileModalFooter';
import type { ProfileModalSectionProps } from '../../types/profile.types';

export function ProfileModalForm({ model, onClose }: ProfileModalSectionProps) {
  const { activeTab, setActiveTab, formData, isSaved, saveError, isSaving, handleChange, handleLogout, handleSubmit } = model;
  return (
    <>
        {/* Tab Header Navigation Subcomponent */}
        <ProfileModalTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[55vh] overflow-y-auto">
          <div className="rounded-xl border border-slate-700 p-4 space-y-2">
            <p className="text-sm text-slate-300">Complete skipped details or update your education, academic year, country, timezone, and learning interests.</p>
            <Link href="/onboarding/step-3" className="inline-block text-sky-400 hover:text-sky-300">Edit learning details</Link>
          </div>
          {activeTab === 'personal' ? (
            <ProfilePersonalTab formData={formData} onChange={handleChange} />
          ) : (
            <ProfilePreferencesTab formData={formData} onChange={handleChange} />
          )}

          {saveError && <p role="alert">{saveError}</p>}

          {/* Action Buttons Footer Subcomponent */}
          <ProfileModalFooter isSaved={isSaved} isSaving={isSaving} onClose={onClose} onLogout={handleLogout} />
        </form>
    </>
  );
}
