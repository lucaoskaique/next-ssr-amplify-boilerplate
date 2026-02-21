'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, Session } from '@/types/client';

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProfile: (profileId: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  refreshProfiles: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
  initialProfiles?: Profile[];
  initialProfileId?: string;
}

export function ProfileProvider({
  children,
  initialSession = null,
  initialProfiles = [],
  initialProfileId,
}: ProfileProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(
    initialProfileId
      ? initialProfiles.find(p => p.id === initialProfileId) || null
      : null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCurrentProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setCurrentProfileState(profile || null);
  };

  const addProfile = (profile: Profile) => {
    setProfiles(prev => [...prev, profile]);
  };

  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    setProfiles(prev =>
      prev.map(p => (p.id === profileId ? { ...p, ...updates } : p)),
    );

    if (currentProfile?.id === profileId) {
      setCurrentProfileState(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const refreshProfiles = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profiles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const fetchedProfiles = await response.json();
      setProfiles(fetchedProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && profiles.length === 0) {
      refreshProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const value: ProfileContextType = {
    profiles,
    currentProfile,
    session,
    isLoading,
    error,
    setCurrentProfile,
    addProfile,
    updateProfile,
    refreshProfiles,
    setSession,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
