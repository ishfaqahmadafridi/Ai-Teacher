'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../auth/state/authStore';
import { DEFAULT_STUDENT_PROFILE } from '../constants/profileConstants';
import { formatPhoneWithCountryCode, generateFormattedStudentId } from '../utilities';
import type { StudentProfile } from '../types/dashboard.types';

export function useStudentProfile() {
  const authUser = useAuthStore((s) => s.user);
  const setUserInStore = useAuthStore((s) => s.setUser);
  const token = useAuthStore((s) => s.accessToken);

  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync profile state dynamically with live user data and restore from localStorage on refresh
  useEffect(() => {
    let savedProfile: Partial<StudentProfile> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dashboard_profile');
        if (stored) {
          savedProfile = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to parse dashboard_profile from localStorage', e);
      }
    }

    let currentUser = authUser;
    if (!currentUser && typeof window !== 'undefined') {
      try {
        const storedAuth = localStorage.getItem('auth-store');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed?.state?.user) {
            currentUser = parsed.state.user;
          }
        }
      } catch (e) {
        console.error('Failed to read auth-store from localStorage', e);
      }
    }

    setProfile((prev) => {
      let updated = { ...prev, ...savedProfile };

      if (currentUser) {
        const fullName =
          savedProfile.name ||
          [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') ||
          currentUser.username ||
          'Student User';

        const formattedPhone =
          savedProfile.phone ||
          formatPhoneWithCountryCode(currentUser.mobile, currentUser.countryCode);

        const formattedStudentId =
          savedProfile.studentId ||
          generateFormattedStudentId(currentUser.id ?? currentUser.username);

        updated = {
          ...updated,
          name: fullName,
          email: savedProfile.email || currentUser.email || prev.email,
          phone: formattedPhone,
          studentId: formattedStudentId,
          avatarUrl: savedProfile.avatarUrl || currentUser.avatarUrl || prev.avatarUrl,
          coverUrl: savedProfile.coverUrl || (currentUser as any).coverUrl || prev.coverUrl,
        };
      }

      return updated;
    });
  }, [authUser]);

  const handleOpenProfile = useCallback(() => {
    setIsProfileOpen(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const handleSaveProfile = useCallback(
    (updated: Partial<StudentProfile>) => {
      setProfile((prev) => {
        const newProfile = { ...prev, ...updated };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('dashboard_profile', JSON.stringify(newProfile));
          } catch (e) {
            console.error('Failed to save dashboard_profile to localStorage', e);
          }
        }

        if (authUser) {
          const nameParts = (newProfile.name || '').trim().split(' ');
          const fName = nameParts[0] || authUser.firstName;
          const lName = nameParts.slice(1).join(' ') || authUser.lastName;

          setUserInStore(
            {
              ...authUser,
              firstName: fName,
              lastName: lName,
              email: newProfile.email,
              mobile: newProfile.phone,
              avatarUrl: newProfile.avatarUrl,
              coverUrl: newProfile.coverUrl,
            },
            token || ''
          );
        }

        return newProfile;
      });
    },
    [authUser, setUserInStore, token]
  );

  return {
    profile,
    isProfileOpen,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
  };
}
