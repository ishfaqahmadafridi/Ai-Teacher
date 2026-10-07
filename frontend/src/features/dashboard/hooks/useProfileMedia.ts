'use client';

import { useState, useRef, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { StudentProfile } from '../types/dashboard.types';

export function useProfileMedia(setFormData: Dispatch<SetStateAction<StudentProfile>>, setIsSaved: Dispatch<SetStateAction<boolean>>, onClose: () => void) {
  // Popup Picker States
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showAvatarPresets, setShowAvatarPresets] = useState(true);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showCoverPresets, setShowCoverPresets] = useState(true);

  // File Input References
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        setIsSaved(false);
        setShowAvatarMenu(false);
      };
      reader.readAsDataURL(file);
    }
  }, [setFormData, setIsSaved]);

  const handleSelectPresetAvatar = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setIsSaved(false);
    setShowAvatarMenu(false);
  }, [setFormData, setIsSaved]);

  const handleCoverFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverUrl: reader.result as string }));
        setIsSaved(false);
        setShowCoverMenu(false);
      };
      reader.readAsDataURL(file);
    }
  }, [setFormData, setIsSaved]);

  const handleSelectPresetCover = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, coverUrl: url }));
    setIsSaved(false);
    setShowCoverMenu(false);
  }, [setFormData, setIsSaved]);

  const handleToggleCoverMenu = useCallback(() => {
    setShowCoverMenu((p) => !p);
    setShowAvatarMenu(false);
  }, []);

  const handleToggleCoverPresets = useCallback(() => {
    setShowCoverPresets((p) => !p);
  }, []);

  const handleCloseCoverMenu = useCallback(() => {
    setShowCoverMenu(false);
  }, []);

  const handleToggleAvatarMenu = useCallback(() => {
    setShowAvatarMenu((p) => !p);
    setShowCoverMenu(false);
  }, []);

  const handleToggleAvatarPresets = useCallback(() => {
    setShowAvatarPresets((p) => !p);
  }, []);

  const handleCloseAvatarMenu = useCallback(() => {
    setShowAvatarMenu(false);
  }, []);

  const handleCloseAllMenus = useCallback(() => {
    setShowAvatarMenu(false);
    setShowCoverMenu(false);
    onClose();
  }, [onClose]);

  return { showAvatarMenu, showAvatarPresets, showCoverMenu, showCoverPresets, avatarFileInputRef, coverFileInputRef, handleAvatarFileUpload, handleSelectPresetAvatar, handleCoverFileUpload, handleSelectPresetCover, handleToggleCoverMenu, handleToggleCoverPresets, handleCloseCoverMenu, handleToggleAvatarMenu, handleToggleAvatarPresets, handleCloseAvatarMenu, handleCloseAllMenus };
}
