'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '../../auth/state/authStore';
import { AuthService } from '../../auth/services/authService';
import { DEFAULT_STUDENT_PROFILE } from '../constants/profileConstants';
import { formatPhoneWithCountryCode, generateFormattedStudentId } from '../utilities';
import type { StudentProfile } from '../types/dashboard.types';

export function useStudentProfile() {
  const authUser = useAuthStore((s) => s.user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profile = useMemo<StudentProfile>(() => {
    if (!authUser) return DEFAULT_STUDENT_PROFILE;
    const joined = new Date(authUser.createdAt);
    const validJoined = !Number.isNaN(joined.getTime());
    return {
      ...DEFAULT_STUDENT_PROFILE,
      name: [authUser.firstName, authUser.lastName].filter(Boolean).join(' ') || authUser.username || '',
      email: authUser.email,
      isVerified: authUser.isVerified,
      phone: formatPhoneWithCountryCode(authUser.mobile, authUser.countryCode),
      studentId: generateFormattedStudentId(authUser.id, authUser.createdAt),
      gradeLevel: authUser.gradeLevel, bio: authUser.bio,
      preferredLanguage: authUser.preferredLanguage,
      avatarUrl: authUser.avatarUrl || '',
      coverUrl: authUser.coverUrl || DEFAULT_STUDENT_PROFILE.coverUrl,
      joinedDate: validJoined ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(joined) : '',
      dateFormatted: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date()),
    };
  }, [authUser]);

  const handleOpenProfile = useCallback(() => setIsProfileOpen(true), []);
  const handleCloseProfile = useCallback(() => setIsProfileOpen(false), []);
  const handleSaveProfile = useCallback(async (updated: Partial<StudentProfile>) => {
    const current = useAuthStore.getState();
    if (!current.user || !current.accessToken) throw new Error('Please sign in before saving your profile.');
    const userId = current.user.id;
    const name = (updated.name ?? profile.name).trim().split(/\s+/);
    const user = await AuthService.updateProfile({
      first_name: name[0] ?? '', last_name: name.slice(1).join(' '),
      email: updated.email, mobile: updated.phone,
      avatar_url: updated.avatarUrl, cover_url: updated.coverUrl,
      grade_level: updated.gradeLevel, bio: updated.bio, preferred_language: updated.preferredLanguage,
    });
    const latest = useAuthStore.getState();
    if (latest.user?.id !== userId || !latest.accessToken) throw new Error('The signed-in account changed.');
    latest.setUser(user, latest.accessToken);
  }, [profile.name]);

  return { profile, isProfileOpen, handleOpenProfile, handleCloseProfile, handleSaveProfile };
}
