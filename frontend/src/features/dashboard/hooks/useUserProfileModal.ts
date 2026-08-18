'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../auth/state/authStore';
import type { StudentProfile, UserProfileModalProps } from '../types';

export function useUserProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: UserProfileModalProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  // Popup Picker States
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showAvatarPresets, setShowAvatarPresets] = useState(true);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showCoverPresets, setShowCoverPresets] = useState(true);

  // File Input References
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsSaved(false);
    },
    []
  );

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
  }, []);

  const handleSelectPresetAvatar = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setIsSaved(false);
    setShowAvatarMenu(false);
  }, []);

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
  }, []);

  const handleSelectPresetCover = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, coverUrl: url }));
    setIsSaved(false);
    setShowCoverMenu(false);
  }, []);

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

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth-store');
        localStorage.removeItem('dashboard_profile');
        localStorage.removeItem('onboarding-store');
      } catch (e) {
        console.error('Failed to clear local storage on logout', e);
      }
    }
    clearAuth();
    onClose();
    router.push('/login');
  }, [clearAuth, onClose, router]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSaveProfile(formData);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 800);
    },
    [formData, onSaveProfile, onClose]
  );

  return {
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
  };
}
