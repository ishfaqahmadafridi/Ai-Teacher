'use client';

import { memo } from 'react';
import { useUserProfileModal } from '../../hooks/useUserProfileModal';
import { ProfileFileInputs } from './ProfileFileInputs';
import { ProfileModalBackdrop } from './ProfileModalBackdrop';
import { ProfileCoverHeader } from './ProfileCoverHeader';
import { ProfileAvatarHeader } from './ProfileAvatarHeader';
import { ProfileMetaInfo } from './ProfileMetaInfo';
import { ProfileModalTabNav } from './ProfileModalTabNav';
import { ProfilePersonalTab } from './ProfilePersonalTab';
import { ProfilePreferencesTab } from './ProfilePreferencesTab';
import { ProfileModalFooter } from './ProfileModalFooter';
import type { UserProfileModalProps } from '../../types/profile.types';

export const UserProfileModal = memo(function UserProfileModal(props: UserProfileModalProps) {
  const {
    activeTab,
    setActiveTab,
    formData,
    isSaved,
    showAvatarMenu,
    showAvatarPresets,
    showCoverMenu,
    showCoverPresets,
    avatarFileInputRef,
    coverFileInputRef,
    handleChange,
    handleAvatarFileUpload,
    handleSelectPresetAvatar,
    handleCoverFileUpload,
    handleSelectPresetCover,
    handleToggleCoverMenu,
    handleToggleCoverPresets,
    handleCloseCoverMenu,
    handleToggleAvatarMenu,
    handleToggleAvatarPresets,
    handleCloseAvatarMenu,
    handleCloseAllMenus,
    handleLogout,
    handleSubmit,
  } = useUserProfileModal(props);

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden File Inputs Subcomponent */}
      <ProfileFileInputs
        avatarFileInputRef={avatarFileInputRef}
        coverFileInputRef={coverFileInputRef}
        onAvatarFileUpload={handleAvatarFileUpload}
        onCoverFileUpload={handleCoverFileUpload}
      />

      {/* Backdrop Subcomponent */}
      <ProfileModalBackdrop onClick={handleCloseAllMenus} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl z-10 font-['Hanken_Grotesk',sans-serif] my-8">
        {/* Top Header Cover Banner Subcomponent */}
        <ProfileCoverHeader
          coverUrl={formData.coverUrl}
          showCoverMenu={showCoverMenu}
          showCoverPresets={showCoverPresets}
          onToggleCoverMenu={handleToggleCoverMenu}
          onToggleCoverPresets={handleToggleCoverPresets}
          onCloseCoverMenu={handleCloseCoverMenu}
          onSelectPresetCover={handleSelectPresetCover}
          onUploadCoverClick={() => coverFileInputRef.current?.click()}
          onCloseModal={props.onClose}
        />

        {/* Profile Avatar & Header Meta Section */}
        <div className="px-6 sm:px-8 pb-5 relative bg-[#0F172A]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Header Subcomponent */}
            <ProfileAvatarHeader
              avatarUrl={formData.avatarUrl}
              studentName={formData.name}
              showAvatarMenu={showAvatarMenu}
              showAvatarPresets={showAvatarPresets}
              onToggleAvatarMenu={handleToggleAvatarMenu}
              onToggleAvatarPresets={handleToggleAvatarPresets}
              onCloseAvatarMenu={handleCloseAvatarMenu}
              onSelectPresetAvatar={handleSelectPresetAvatar}
              onUploadAvatarClick={() => avatarFileInputRef.current?.click()}
            />

            {/* Student Quick Meta Subcomponent */}
            <ProfileMetaInfo
              name={formData.name}
              email={formData.email}
              phone={formData.phone}
              studentId={formData.studentId}
              gradeLevel={formData.gradeLevel}
            />
          </div>
        </div>

        {/* Tab Header Navigation Subcomponent */}
        <ProfileModalTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[55vh] overflow-y-auto">
          {activeTab === 'personal' ? (
            <ProfilePersonalTab formData={formData} onChange={handleChange} />
          ) : (
            <ProfilePreferencesTab formData={formData} onChange={handleChange} />
          )}

          {/* Action Buttons Footer Subcomponent */}
          <ProfileModalFooter isSaved={isSaved} onClose={props.onClose} onLogout={handleLogout} />
        </form>
      </div>
    </div>
  );
});

UserProfileModal.displayName = 'UserProfileModal';
