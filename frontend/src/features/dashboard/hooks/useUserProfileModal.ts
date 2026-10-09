'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProfileMedia } from './useProfileMedia';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '../../auth/hooks/useAuthQueries';
import { useAuthStore } from '../../auth/state/authStore';
import type { StudentProfile, UserProfileModalProps } from '../types';

export function useUserProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: UserProfileModalProps) {
  const { mutateAsync: logout } = useLogoutMutation();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previous, setPrevious] = useState({ profile, isOpen });

  if (previous.profile !== profile || previous.isOpen !== isOpen) {
    setPrevious({ profile, isOpen });
    setFormData(profile);
    if (previous.isOpen !== isOpen) {
      setIsSaved(false);
      setSaveError(null);
    }
  }

  const media = useProfileMedia(setFormData, setIsSaved, onClose);

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsSaved(false);
    },
    []
  );

  const handleLogout = useCallback(async () => {
    const session = useAuthStore.getState();
    try {
      if (session.refreshToken) await logout(session.refreshToken);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'Logout failed. Please try again.');
      return;
    }
    if (useAuthStore.getState().accessToken !== session.accessToken) return;
    clearAuth();
    onClose();
    router.push('/login');
  }, [clearAuth, onClose, router, logout]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSaveProfile(formData);
      setIsSaved(true);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'Profile could not be saved.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSaveProfile, isSaving]);

  return {
    ...media,
    activeTab,
    setActiveTab,
    formData,
    isSaved,
    saveError,
    isSaving,
    handleChange,
    handleLogout,
    handleSubmit,
  };
}
